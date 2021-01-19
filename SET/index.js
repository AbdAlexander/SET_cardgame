/* Állapottér */
let testerOption_EndRightNow = false;

let players = [];
let cards = [];
let gameTable = [];
playerID = 0;

let gameSettings = {
    gameMode: "Practice",
    difficulty: "Normal",
    helperButtonSetFinder: false,
    helperButtonSetShower: false,
    helperButtonAddCards: false,
    playerSettingsIsSaved: false
}

/* Állapottér -> Kártyatulajdoságok */
const shapes = ["oval", "wavy", "diamond"];
const colors = ["red", "green", "purple"];
const numbers = ["null", "1", "2", "3"];
const contents = ["solid", "striped", "empty"];

/* Állapottér -> Timer állapottér */
let start_time = 0;
let final_time = null;
const pad2 = num => num.toString().padStart(2, '0');


/* Állapottér -> Kártya osztály */
class Card {
    constructor(shape, color, number, content, name) {
        this.shape = shape;
        this.color = color;
        this.number = number;
        this.content = content;
        this.name = name;
    }
    toImage() {
        return `<img src = "res/icons/${this.name}.svg" alt = "${this.name}" width="60" height="90">`
    }
    toImageSM() {
        return `<img src = "res/icons/${this.name}.svg" alt = "${this.name}" width="30" height="60">`
    }
}
/* Állapottér -> Player osztály */
class Player {
    constructor(name) {
        this.id = playerID++;
        this.name = name;
        this.points = 0;
        this.banned = false;
    }
}
/* Állapottér -> inicializáló függvények */
function initGameTable(cards) {
    gameTable = [];
    for (let i = 0; i < 4; i++) {
        const row = []
        for (let j = 0; j < 3; j++) {
            row.push(cards.pop());
        }
        gameTable.push(row)
    }
}

function initDeck() {
    if (gameSettings.difficulty === "Normal") {
        for (let cardShape = 0; cardShape < 3; cardShape++) {
            for (let cardColor = 0; cardColor < 3; cardColor++) {
                for (let cardNumber = 1; cardNumber <= 3; cardNumber++) {
                    for (let cardContent = 0; cardContent < 3; cardContent++) {
                        const cardName = getCardName(cardShape, cardColor, cardNumber, cardContent);
                        cards.push(new Card(shapes[cardShape], colors[cardColor], numbers[cardNumber], contents[cardContent], cardName));
                    }
                }
            }
        }
    } else if (gameSettings.difficulty === "Easy") {
        for (let cardShape = 0; cardShape < 3; cardShape++) {
            for (let cardColor = 0; cardColor < 3; cardColor++) {
                for (let cardNumber = 1; cardNumber <= 3; cardNumber++) {
                    const cardName = getCardNameOnEasy(cardShape, cardColor, cardNumber);
                    cards.push(new Card(shapes[cardShape], colors[cardColor], numbers[cardNumber], contents[0], cardName));
                }
            }
        }
    }
}


/* Referenciák */
const mainWindow = document.querySelector('.MainWindow');
const gameWindow = document.querySelector('.GameWindow');
const rulesTitle = document.querySelector('#rulesTitle');
const rules = document.querySelector('.rules');
const settingsTitle = document.querySelector('#settingsTitle');
const settings = document.querySelector('.settings');
const start = document.querySelector('#start');
const playerSettingButton = document.querySelector('#playerSettingButton');
const playersSumInput = document.querySelector('#playersSumInput');
const playerSettingsDiv = document.querySelector('.playerSettingsDiv');
const gameModeChooser = document.querySelector('.gameModeChooser');
const gameModeDifficultyChooser = document.querySelector('.gameModeDifficultyChooser');
const helpersChooser = document.querySelector('.helperChooser');
const cb1 = document.querySelector('#cb1');
const cb2 = document.querySelector('#cb2');
const cb3 = document.querySelector('#cb3');
const header = document.querySelector('.header');

/* Eseménykezelő referenciák */
rulesTitle.addEventListener('click', displayGameRules);
settingsTitle.addEventListener('click', displayGameSettings);
playerSettingButton.addEventListener('click', playerSettingsButtonListener);
gameModeChooser.addEventListener('click', gameModeChooserListener);
gameModeDifficultyChooser.addEventListener('click', gameModeDifficultyChooserListener);
helpersChooser.addEventListener('click', helpersListener);
start.addEventListener('click', startTheGameButtonListener);

/* Eseménykezelő függvények */
function displayGameRules() {
    if (rules.style.display === "none") {
        rulesTitle.innerHTML = "<h1>Játékszabályzat 🔽</h1>"
        rules.style.display = "block";
    } else {
        rulesTitle.innerHTML = "<h1>Játékszabályzat 🔼</h1>"
        rules.style.display = "none";
    }
}

function displayGameSettings() {
    if (settings.style.display === "none") {
        settingsTitle.innerHTML = "<h1>Játékbeállítások 🔽</h1>"
        settings.style.display = "block";
    } else {
        settingsTitle.innerHTML = "<h1>Játékbeállítások 🔼</h1>"
        settings.style.display = "none";
    }
}

function playerSettingsButtonListener() {
    playerSettingsDiv.innerHTML = "";
    document.querySelector('.alert').innerHTML = "";
    players = [];

    if (playersSumInput.value > 10 || playersSumInput.value <= 0) {
        playersSumInput.value = 1;
        document.querySelector('.alert').innerHTML = `
        <div class="alert alert-danger alert-dismissible">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>HIBA: </strong> 1 és 10 között kell lennie a játékosok számosságának!
        </div>`;
        return;
    }
    const sumOfPlayers = playersSumInput.value;
    for (let i = 1; i <= sumOfPlayers; i++) {
        playerSettingsDiv.innerHTML += `<br>${i}. Játékos neve: <input type="text" value="Játékos${i}" id="player${i}">`;
    }
    playerSettingsDiv.innerHTML += `<br><br><button type="button" class="btn btn-primary" id="savePlayers">Játékosok elmentése</button>`
    document.querySelector('#savePlayers').addEventListener("click", function() {
        players = [];
        for (let i = 1; i <= sumOfPlayers; i++) {
            const player = document.querySelector(`#player${i}`);
            players.push(new Player(player.value));
        }
        document.querySelector('.alert').innerHTML = `
            <div class="alert alert-success alert-dismissible">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                Játékosok nevei sikeresen el lettek mentve!
            </div>`;
        gameSettings.playerSettingsIsSaved = true;
        document.querySelector('#savePlayers').disabled = true;
        playerSettingsDiv.innerHTML = "";
    });
}

function gameModeChooserListener() {
    if (document.getElementById('Practice').checked) {
        gameSettings.gameMode = "Practice";
        helpersChooser.style.display = "block";
    } else if (document.getElementById('Competition').checked) {
        gameSettings.gameMode = "Competition";
        helpersChooser.style.display = "none";
        gameSettings.helperButtonSetFinder = false;
        gameSettings.helperButtonSetShower = false;
        gameSettings.helperButtonAddCards = false;
        cb1.checked = false;
        cb2.checked = false;
        cb3.checked = false;
    }
}

function gameModeDifficultyChooserListener() {
    if (document.getElementById('NormalDifficulty').checked) {
        gameSettings.difficulty = "Normal";
    } else if (document.getElementById('EasyDifficulty').checked) {
        gameSettings.difficulty = "Easy";
    }
}

function helpersListener() {
    if (document.getElementById('cb1').checked && gameSettings.gameMode === "Practice") {
        gameSettings.helperButtonSetFinder = true;
    } else {
        gameSettings.helperButtonSetFinder = false;
    }
    if (document.getElementById('cb2').checked) {
        gameSettings.helperButtonSetShower = true;
    } else {
        gameSettings.helperButtonSetShower = false;
    }
    if (document.getElementById('cb3').checked) {
        gameSettings.helperButtonAddCards = true;
    } else {
        gameSettings.helperButtonAddCards = false;
    }
}

/* Eseménykezelő -> Átirányítás a játék ablakba és játék kezdése */
function startTheGameButtonListener() {
    if (!gameSettings.playerSettingsIsSaved) { //Játékos nevek el vannak-e mentve?
        alert("A játékosok beállításai nem lettek elmentve!");
        return;
    }
    mainWindow.style.display = "none";
    gameWindow.style.display = "block";

    header.innerHTML = `
    <div class="jumbotron text-center">
        <h1>Set kártyajáték</h1>
        <p>A játék elkezdődött jó szórakozást!</p>
    </div>`;

    initDeck();
    cards = shuffleCards(cards); //Kártyák megkeverése
    console.log(cards); //Megkevert kártyák kiíratása

    initGameTable(cards);

    gameWindow.innerHTML = genGameArea(gameTable); // Játéktábla, játékosok és kártyák legenerálása

    /* Referenciák a játékoldalon */
    const gameModeH1 = document.querySelector('#gM');
    const timer = document.querySelector('#timer');
    const setButton = document.querySelector('#SET');
    const setSpan = document.querySelector('#setSpan');
    const playerTable = document.querySelector('#playerRow');
    const table = document.querySelector('.col-sm-8');
    const addButton = document.querySelector('#ADD');
    const showSetButton = document.querySelector('#SHOW');
    const findSetButton = document.querySelector('#FIND');
    const helpAnswerSpan = document.querySelector('#helpAnswer');
    const maxCardSpan = document.querySelector('#maxCardSpan');
    const gameAnswer = document.querySelector('#gameAnswer');
    const deck = document.querySelector('#deck');
    const playerRow = document.querySelector('#playerRow');
    const progressBarSpan = document.querySelector('#progressBarSpan')
    const log = document.querySelector('#logOfCards');

    progressBarSpan.innerHTML = `<progress value="0" max="10" id="progressBar" width:"200"></progress>`
    const progressBarTimer = document.querySelector('#progressBar');
    progressBarTimer.style.display = "none";

    deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 81`;
    if (gameSettings.difficulty === "Easy") {
        deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 27`;
    }

    /* Álllapottér ellenőrzés */
    if (isSinglePlayer()) {
        setSpan.innerHTML = updateInfoBox(0);
    }

    if (gameSettings.gameMode === "Practice") {
        gameModeH1.innerHTML = "Gyakorló játékmód";
    } else {
        gameModeH1.innerHTML = "Verseny játékmód";
        addButton.style.display = "none";
        showSetButton.style.display = "none";
        findSetButton.style.display = "none";
        addButton.value = "automatikus";
        showSetButton.value = "nem";
        findSetButton.value = "nem";
    }
    if (!gameSettings.helperButtonAddCards) { addButton.disabled = true; }
    if (!gameSettings.helperButtonSetFinder) { findSetButton.disabled = true; }
    if (!gameSettings.helperButtonSetShower) { showSetButton.disabled = true; }

    let playerIsSelected = false;
    let logOfSelectedCards = [];

    /* Eseménykezelő referenciák */
    setButton.addEventListener('click', setIsClicked);
    addButton.addEventListener('click', addCards);
    findSetButton.addEventListener('click', isThereSet);
    showSetButton.addEventListener('click', showSet);

    playerRow.innerHTML = reGenPlayerRow(players);

    /* Időszámláló beállítás */
    if (!isSinglePlayer() || gameSettings.gameMode === "Competition") { //Egyszemélyes gyakorlómódban nincs időmérés!
        final_time = null;
        start_time = new Date().getTime();
        timer.style.color = "black";
        timer.innerHTML = "00:00:00";

        let update_timer = setInterval(function() {
            if (final_time === null) {
                let now = new Date().getTime();
                let total_time = now - start_time;
                let seconds = Math.floor(total_time / 1000);
                let minutes = Math.floor(seconds / 60);
                let hours = Math.floor(minutes / 60);
                let time = pad2(hours) + ":" + pad2(minutes % 60) + ":" + pad2(seconds % 60);
                timer.innerHTML = time;
            } else {
                timer.style.color = "blue";
                timer.innerHTML = final_time;
            }
        }, 1000);
    }

    /* Eseménykezelő függvények */
    function addCards() {
        let row = [];
        for (let card = 0; card < 3; card++) {
            row.push(cards.pop());
        }
        gameTable.push(row)
        table.innerHTML = reGenTable(gameTable);
        gameAnswer.innerHTML = `
            <div class="alert alert-success alert-dismissible">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Rendszer: </strong> Sikeresen lehelyzetél +3 lapot a játéktablára!
            </div>`;
        deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 81`;
        if (gameSettings.difficulty === "Easy") {
            deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 27`;
        }
        if (gameTable.length >= 7) {
            addButton.disabled = true;
            maxCardSpan.innerHTML = `
                <div class="alert alert-warning">
                    <strong>21 lap lett kitéve a játékasztalra, több lapot nem lehet kitenni</strong>, mivel 1 SET biztosan van a leosztásban!
                </div>
            `
        }

    }

    function setIsClicked() {
        let targets = [];
        let selectedCards = [];
        let selectedCardsCoords = [];

        let elapsedTime = timer.innerHTML;

        setButton.disabled = true; // Különböző buggok elkerülése végett!

        /* Egyszemélyes játékmód */
        if (isSinglePlayer()) {
            setSpan.innerHTML = updateInfoBox(2);
            table.addEventListener('click', cardSelection);

            function cardSelection(e) {
                /* Játékos kiválaszt 3 kártyát */
                if (selectedCards.length < 3) {
                    if (e.target.matches('img')) {
                        const { x, y } = xyCoord(e.target.parentElement);
                        if (gameTable[y][x].name === "empty") { //Amennyiben olyan helyre kattintott a felhasználó, ahol nincs kártya
                            gameAnswer.innerHTML = `
                            <div class="alert alert-danger alert-dismissible">
                                <button type="button" class="close" data-dismiss="alert">&times;</button>
                                <strong>Rendszer: </strong> A kiválasztott helyen már nincs kártya! Válassz újra!
                            </div>`;
                        } else { // Jó helyre való kattintáskor
                            let clickedState = true;
                            for (let i = 0; i < selectedCards.length; i++) { //Megnézzük, hogy ki volt-e már választva az adott kártya
                                if (gameTable[y][x] === selectedCards[i]) {
                                    e.target.style.border = "0px";
                                    selectedCards.splice(i, 1);
                                    selectedCardsCoords.splice(i, 1);
                                    targets.splice(i, 1);
                                    clickedState = false;
                                }
                            }
                            if (clickedState) {
                                e.target.style.border = "3px solid black";
                                selectedCards.push(gameTable[y][x]);
                                selectedCardsCoords.push([y, x]);
                                targets.push(e.target);
                            }
                        }
                    }
                }
                /* 3 kártya ki lett választva */
                if (selectedCards.length == 3) {
                    /* Ha a 3 Kártya SET */
                    if (checkSelectedCards(selectedCards)) {
                        gameAnswer.innerHTML = `
                            <div class="alert alert-success alert-dismissible">
                                <button type="button" class="close" data-dismiss="alert">&times;</button>
                                <strong>Rendszer: </strong> Sikeresen találtál egy SET-et! <strong>+1 pont 😎</strong> <br>
                                <strong>Kiválasztott lapok:</strong> ${selectedCards[0].toImage()}  ${selectedCards[1].toImage()}  ${selectedCards[2].toImage()}
                            </div>`;
                        players[0].points += 1;
                        logOfSelectedCards.push(selectedCards); //log bővítése
                        replaceCards(gameTable, cards, selectedCardsCoords); //Kártyák kicserlésée
                        table.innerHTML = reGenTable(gameTable); //Játéktábla újragenerálása
                        deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 81`; //Pakli számosságának újragenereálása
                        if (gameSettings.difficulty === "Easy") {
                            deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 27`;
                        }
                        log.innerHTML += `<li><strong>${logOfSelectedCards.length}. kör:</strong> ${selectedCards[0].toImageSM()}  ${selectedCards[1].toImageSM()}  ${selectedCards[2].toImageSM()}</li>`
                    }
                    /* Ha a 3 kártya NEM SET */
                    else {
                        gameAnswer.innerHTML = `
                        <div class="alert alert-danger alert-dismissible">
                            <button type="button" class="close" data-dismiss="alert">&times;</button>
                            <strong>Rendszer: </strong> A kiválasztott lapok nem SET! <strong>-1 pont 😔</strong> <br>
                            <strong>Kiválasztott lapok:</strong> ${selectedCards[0].toImage()} ${selectedCards[1].toImage()} ${selectedCards[2].toImage()}
                        </div>`;
                        players[0].points -= 1;
                    }


                    playerRow.innerHTML = reGenPlayerRow(players); //Játékos pontjának updatelése!
                    deselect(targets); // Kijelölt kártyák ki-jelölése!


                    /* Kattintás állapotterének újrainicializálása */
                    targets = [];
                    selectedCards = [];
                    selectedCardsCoords = [];
                    setButton.disabled = false;

                    /* Eseménykezelő letiltása, hogy csak a step button megnyomása utána lehessen kijelölni */
                    e.stopImmediatePropagation();
                    this.removeEventListener("click", cardSelection);

                    setSpan.innerHTML = updateInfoBox(0);


                    /* Játék végének és pakli számosságának ellenőrzése */
                    elapsedTime = timer.innerHTML;
                    let SETsFound = SETs();
                    let over = false;

                    if (cards.length < 3) {
                        addButton.disabled = true;
                        if (SETsFound.length == 0) {
                            over = true;
                        }
                    } else if (cards.length >= 3 && SETsFound.length == 0) {
                        gameAnswer.innerHTML = `
                        <div class="alert alert-warning alert-dismissible">
                            <button type="button" class="close" data-dismiss="alert">&times;</button>
                            <strong>Rendszer:</strong> Játéktáblán nincs több SET, így automatikusan hozzáadtunk +3 lapot!
                        </div>`;
                        let row = [];
                        for (let card = 0; card < 3; card++) {
                            row.push(cards.pop());
                        }
                        gameTable.push(row)
                        table.innerHTML = reGenTable(gameTable);
                        deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 81`;
                        if (gameSettings.difficulty === "Easy") {
                            deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 27`;
                        }
                    }

                    /* Játék végének ellenőrzése */
                    if (over || testerOption_EndRightNow) {
                        clearInterval(timer);
                        header.innerHTML = `
                            <div class="jumbotron text-center">
                                <h1>Set kártyajáték</h1>
                                <p>A játék befejeződött (Gyakorló egyszemélyes játékmód)!</p>
                            </div>`;
                        if (gameSettings.gameMode === "Competition") {
                            header.innerHTML = `
                            <div class="jumbotron text-center">
                                <h1>Set kártyajáték</h1>
                                <p>A játék befejeződött (Verseny egyszemélyes játékmód)!</p>
                            </div>`;
                            gameWindow.innerHTML = `     
                            <div class = "container">
                                <h1> Az eredményed </h1>
                                <table class="table"> 
                                    <tr>
                                        <th scope="col" style="text-align: center;">
                                            <img src = "res/player.png" alt = "playerProfilePic" width="80" height="100">
                                            <br><p style="color:red">${players[0].name}</p>
                                            Pontszám: ${players[0].points} <br>
                                            Eltelt idő: <strong>${elapsedTime}</strong> <br>
                                        </th>
                                    </tr>
                                </table>
                                <button type="button " class="btn btn-success btn-lg" id="reStart">Új játék kezdése</button>
                                <button type="button " class="btn btn-success btn-lg" id="reStartSame">Új játék kezdése beállítások és játékosok megőrzésével</button>
                            </div>`;
                        } else {
                            gameWindow.innerHTML = `     
                            <div class = "container">
                                <h1> Az eredményed </h1>
                                <table class="table"> 
                                    <tr>
                                        <th scope="col" style="text-align: center;">
                                            <img src = "res/player.png" alt = "playerProfilePic" width="80" height="100">
                                            <br><p style="color:red">${players[0].name}</p>
                                            Pontszám: ${players[0].points} <br>
                                        </th>
                                    </tr>
                                </table>
                                <button type="button " class="btn btn-success btn-lg" id="reStart">Új játék kezdése</button>
                                <button type="button " class="btn btn-success btn-lg" id="reStartSame">Új játék kezdése beállítások és játékosok megőrzésével</button>
                            </div>`;
                        }

                        const reStart = document.querySelector('#reStart');
                        const reStartSame = document.querySelector('#reStartSame');

                        reStart.addEventListener('click', function() {
                            location.reload();
                        });
                        reStartSame.addEventListener('click', function() {
                            alert("Sajnos erre a + funkcióra nem maradt időm! Használd az új játék kezdése gombot!");
                        });

                        let saveResult = {
                            Players: players,
                            Winner: [players[0].name, players[0].points],
                            eTime: elapsedTime
                        }
                        localStorage.setItem('Game results:', saveResult);
                    }

                }
            }
        }
        /* Többszemélyes játékmód */
        else {
            let playerTarget;
            let playerID;

            setSpan.innerHTML = updateInfoBox(3);
            playerTable.addEventListener('click', playerSelection);

            function playerSelection(e) {
                /* Amennyiben még nincs kiválasztva a SET-et bemondó játékos */
                if (!playerIsSelected) {
                    if (e.target.matches('th') || e.target.matches('img')) {
                        if (e.target.matches('th')) {
                            playerTarget = e.target;
                            playerID = playerTarget.getAttribute('id');
                            if (!players[playerID].banned) {
                                e.target.style.border = "3px solid black";
                                playerIsSelected = true;
                                setSpan.innerHTML = updateInfoBox(4);
                                /* Eseménykezelő letiltása, hogy csak a step button megnyomása utána lehessen kijelölni */
                                e.stopImmediatePropagation();
                                this.removeEventListener("click", playerSelection);
                            } else {
                                gameAnswer.innerHTML = `
                                <div class="alert alert-danger alert-dismissible">
                                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                                    <strong>Rendszer: </strong> ${players[playerID].name} már egyszer rosszul tippelt ebben a körben, csak a következő körben tippelhet újra!<br>
                                    Válassz ki olyasvalakit, aki még nem tippelt ebben a körben!
                                </div>`;
                            }
                        } else {
                            playerTarget = e.target.parentElement;
                            playerID = playerTarget.getAttribute('id');
                            if (!players[playerID].banned) {
                                playerTarget.style.border = "3px solid black";
                                playerIsSelected = true;
                                setSpan.innerHTML = updateInfoBox(4);
                                /* Eseménykezelő letiltása, hogy csak a step button megnyomása utána lehessen kijelölni */
                                e.stopImmediatePropagation();
                                this.removeEventListener("click", playerSelection);
                            } else {
                                gameAnswer.innerHTML = `
                                <div class="alert alert-danger alert-dismissible">
                                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                                    <strong>Rendszer: </strong> ${players[playerID].name} már egyszer rosszul tippelt ebben a körben, csak a következő körben tippelhet újra!<br>
                                    Válassz ki olyasvalakit, aki még nem tippelt ebben a körben!
                                </div>`;
                            }
                        }
                    }
                }
                /* SET-et bemondó játékos ki lett választva */
                if (playerIsSelected) {
                    table.addEventListener('click', cardSelection);
                    let finished = false;
                    let stopListener = false;

                    progressBarTimer.style.display = "block";

                    let timeleft = 10;
                    let countDownTimer = setInterval(function() {
                        if (timeleft <= 0) { //Lejárt az idő?
                            clearInterval(countDownTimer);
                            if (!finished) { //A felhasználó befejezte a körét? 
                                gameAnswer.innerHTML = `
                                <div class="alert alert-danger alert-dismissible">
                                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                                    <strong>Rendszer: </strong> Lejárt ${players[playerID].name} rendelkezésére álló 10 másodperce! <strong>-1 pont 😔 </strong>
                                </div>`;
                                players[playerID].points -= 1;
                                playerRow.innerHTML = reGenPlayerRow(players); //Játékosok pontjainak updatelése!

                                progressBarTimer.value = 0;
                                progressBarTimer.style.display = "none";
                                deselect(targets);
                                targets = [];
                                selectedCards = [];
                                selectedCardsCoords = [];
                                playerIsSelected = false;
                                setButton.disabled = false;
                                playerTarget.style.border = "0px";
                                playerID = -1;
                                setSpan.innerHTML = updateInfoBox(1);

                                stopListener = true;
                            }
                        }
                        progressBarTimer.value = 10 - timeleft;
                        timeleft -= 1;
                    }, 1000);

                    function cardSelection(e) {
                        if (stopListener) {
                            e.stopImmediatePropagation();
                            this.removeEventListener("click", cardSelection);
                        } else {
                            /* 3 Kártya kiválasztása */
                            if (selectedCards.length < 3) {
                                if (e.target.matches('img')) {
                                    const { x, y } = xyCoord(e.target.parentElement);
                                    if (gameTable[y][x].name === "empty") { //Amennyiben olyan helyre kattintott a felhasználó, ahol nincs kártya
                                        gameAnswer.innerHTML = `
                                        <div class="alert alert-danger alert-dismissible">
                                            <button type="button" class="close" data-dismiss="alert">&times;</button>
                                            <strong>Rendszer: </strong> A kiválasztott helyen már nincs kártya! Válassz újra!
                                        </div>`;
                                    } else { // Jó helyre való kattintáskor
                                        let clickedState = true;
                                        for (let i = 0; i < selectedCards.length; i++) {
                                            if (gameTable[y][x] === selectedCards[i]) {
                                                e.target.style.border = "0px";
                                                selectedCards.splice(i, 1);
                                                selectedCardsCoords.splice(i, 1);
                                                targets.splice(i, 1);
                                                clickedState = false;
                                            }
                                        }
                                        if (clickedState) {
                                            e.target.style.border = "3px solid black";
                                            selectedCards.push(gameTable[y][x]);
                                            selectedCardsCoords.push([y, x]);
                                            targets.push(e.target);
                                        }
                                    }
                                }
                            }
                            /* 3 Kártya kiválasztása megtörtént */
                            if (selectedCards.length == 3) {
                                /* Sikeres SET */
                                if (checkSelectedCards(selectedCards)) {
                                    players[playerID].points += 1;
                                    logOfSelectedCards.push(selectedCards); //log bővítése
                                    replaceCards(gameTable, cards, selectedCardsCoords); //Kártyák kicserlésée
                                    table.innerHTML = reGenTable(gameTable); //Játéktábla újragenerálása
                                    deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 81`; //Pakli számosságának újragenerálása
                                    if (gameSettings.difficulty === "Easy") {
                                        deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 27`;
                                    }
                                    log.innerHTML += `<li><strong>${logOfSelectedCards.length}. kör:</strong> ${selectedCards[0].toImageSM()}  ${selectedCards[1].toImageSM()}  ${selectedCards[2].toImageSM()}</li>`
                                    for (let i = 0; i < players.length; i++) {
                                        players[i].banned = false;
                                    }
                                    gameAnswer.innerHTML = `
                                    <div class="alert alert-success alert-dismissible">
                                        <button type="button" class="close" data-dismiss="alert">&times;</button>
                                        <strong>Rendszer: </strong> ${players[playerID].name} sikeresen talált egy SET-et! <strong>+1 pont 😎</strong><br>
                                        <strong> Mostantól mindenki tippelhet újra! </strong> <br>
                                        <strong>Kiválasztott lapok:</strong> ${selectedCards[0].toImage()} ${selectedCards[1].toImage()} ${selectedCards[2].toImage()}
                                    </div>`;
                                }
                                /* Sikertelen SET */
                                else {
                                    gameAnswer.innerHTML = `
                                        <div class="alert alert-danger alert-dismissible">
                                            <button type="button" class="close" data-dismiss="alert">&times;</button>
                                            <strong>Rendszer: </strong> ${players[playerID].name} rosszul tippelt, a kiválasztott lapok nem SET! <strong>-1 pont 😔</strong><br>
                                            <strong> ${players[playerID].name} ebből a körből kimarad! </strong> <br>
                                            <strong>Kiválasztott lapok:</strong> ${selectedCards[0].toImage()} ${selectedCards[1].toImage()} ${selectedCards[2].toImage()}
                                        </div>`;
                                    players[playerID].points -= 1;
                                    players[playerID].banned = true;
                                    let isEveryoneBanned = true;
                                    for (let i = 0; isEveryoneBanned && i < players.length; i++) {
                                        isEveryoneBanned = players[i].banned && isEveryoneBanned
                                    }
                                    if (isEveryoneBanned) {
                                        for (let i = 0; i < players.length; i++) {
                                            players[i].banned = false;
                                        }
                                        gameAnswer.innerHTML = `
                                        <div class="alert alert-danger alert-dismissible">
                                            <button type="button" class="close" data-dismiss="alert">&times;</button>
                                            <strong>Rendszer: </strong> ${players[playerID].name} rosszul tippelt, a kiválasztott lapok nem SET! <strong>-1 pont 😔</strong><br>
                                            <strong> Mivel mindenki rosszul tippelt ebben körben, így mindenki újratippelhet mostantól! </strong> <br>
                                            <strong>Kiválasztott lapok:</strong> ${selectedCards[0].toImage()} ${selectedCards[1].toImage()} ${selectedCards[2].toImage()}
                                        </div>`;
                                    }
                                }

                                playerRow.innerHTML = reGenPlayerRow(players); //Játékosok pontjainak updatelése!
                                deselect(targets); // Kijelölt kártyák ki-jelölése!

                                /* Kattintás állapotterének újrainicializálása */
                                targets = [];
                                selectedCards = [];
                                selectedCardsCoords = [];
                                playerIsSelected = false;
                                setButton.disabled = false;
                                playerTarget.style.border = "0px";
                                playerID = -1;
                                finished = true;
                                progressBarTimer.value = 0;
                                progressBarTimer.style.display = "none";
                                clearInterval(countDownTimer);

                                /* Eseménykezelő letiltása, hogy csak a step button megnyomása utána lehessen kijelölni */
                                e.stopImmediatePropagation();
                                this.removeEventListener("click", cardSelection);

                                setSpan.innerHTML = updateInfoBox(1);


                                /* Játék végének és pakli számosságának ellenőrzése */
                                elapsedTime = timer.innerHTML;
                                let SETsFound = SETs();
                                let over = false;

                                if (cards.length < 3) {
                                    addButton.disabled = true;
                                    if (SETsFound.length == 0) {
                                        over = true;
                                    }
                                } else if (cards.length >= 3 && SETsFound.length == 0) {
                                    gameAnswer.innerHTML = `
                                    <div class="alert alert-warning alert-dismissible">
                                        <button type="button" class="close" data-dismiss="alert">&times;</button>
                                        <strong>Rendszer:</strong> Játéktáblán nincs több SET, így automatikusan hozzáadtunk +3 lapot!
                                    </div>`;
                                    let row = [];
                                    for (let card = 0; card < 3; card++) {
                                        row.push(cards.pop());
                                    }
                                    gameTable.push(row)
                                    table.innerHTML = reGenTable(gameTable);
                                    deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 81`;
                                    if (gameSettings.difficulty === "Easy") {
                                        deck.innerHTML = `Pakli: <strong>${cards.length}</strong> / 27`;
                                    }

                                }

                                /* Játék végének ellenőrzése */
                                if (over || testerOption_EndRightNow) {
                                    clearInterval(countDownTimer);
                                    let maxPoint = maxPointFinder();
                                    let winners = winnersFinder(maxPoint);

                                    if (winners.length == 1) {
                                        header.innerHTML = `
                                            <div class="jumbotron text-center">
                                                <h1>Set kártyajáték</h1>
                                                <p>A játék befejeződött (Gyakorló többszemélyes játékmód)!<br>Gratulálunk <strong>${winners[0].name} (-nak/-nek)</strong> a győzelemhez!</p>
                                                <p>Eltelt idő: <strong>${elapsedTime}</strong></p>
                                            </div>`;
                                        if (gameSettings.gameMode === "Competition") {
                                            header.innerHTML = `
                                            <div class="jumbotron text-center">
                                                <h1>Set kártyajáték</h1>
                                                <p>A játék befejeződött (Verseny többszemélyes játékmód)!<br> Gratulálunk <strong>${winners[0].name} (-nak/-nek)</strong> a győzelemhez!</p>
                                                <p>Eltelt idő: <strong>${elapsedTime}</strong></p>
                                            </div>`;
                                        }
                                        gameWindow.innerHTML = `     
                                            <div class = "container">
                                                <h1> A győztes </h1>
                                                <table class="table"> 
                                                    <tr>
                                                        <th scope="col" style="text-align: center;">
                                                            <img src = "res/player.png" alt = "playerProfilePic" width="80" height="100">
                                                            <br><p style="color:red">${winners[0].name}</p>
                                                            Pontszám: ${winners[0].points} <br>
                                                        </th>
                                                    </tr>
                                                </table>
                                                <h1> Összes játékos eredménye ebben a partyban </h1>
                                                <table class="table" id="playerRowEndGame">
                                                <tr>
                                                    ${players.map(player => 
                                                        `<th scope="col" style="text-align: center;" id="${player.id}">
                                                            <img src = "res/player.png" alt = "playerProfilePic" width="80" height="100">
                                                            <br><p style="color:red">${player.name}</p>
                                                            Pontszám: ${player.points} <br>
                                                        </th>`
                                                    ).join('')}
                                                </tr>;
                                                </table>
    
                                                <button type="button " class="btn btn-success btn-lg" id="reStart">Új játék kezdése</button>
                                                <button type="button " class="btn btn-success btn-lg" id="reStartSame">Új játék kezdése beállítások és játékosok megőrzésével</button>
                                            </div>`;
                                    } else {
                                        header.innerHTML = `
                                            <div class="jumbotron text-center">
                                                <h1>Set kártyajáték</h1>
                                                <p>A játék befejeződött (Gyakorló többszemélyes játékmód)!<br> Gratulálunk a győzteseknek!</p>
                                                <p>Eltelt idő: <strong>${elapsedTime}</strong></p>
                                            </div>`;
                                        if (gameSettings.gameMode === "Competition") {
                                            header.innerHTML = `
                                            <div class="jumbotron text-center">
                                                <h1>Set kártyajáték</h1>
                                                <p>A játék befejeződött (Verseny többszemélyes játékmód)!<br> Gratulálunk <strong>${winners[0].name} (-nak/-nek)</strong> a győzelemhez!</p>
                                                <p>Eltelt idő: <strong>${elapsedTime}</strong></p>
                                            </div>`;
                                        }
                                        gameWindow.innerHTML = `     
                                            <div class = "container">
                                                <h1> A győztesek </h1>
                                                <table class="table"> 
                                                    <tr>
                                                    ${winners.map( winner => 
                                                        `<th scope="col" style="text-align: center;">
                                                            <img src = "res/player.png" alt = "playerProfilePic" width="80" height="100">
                                                            <br><p style="color:red">${winner.name}</p>
                                                            Pontszám: ${winner.points} <br>
                                                        </th>`
                                                    ).join('')}
                                                    </tr>
                                                </table>
                                                <h1> Összes játékos eredménye ebben a partyban </h1>
                                                <table class="table" id="playerRowEndGame">
                                                <tr>
                                                    ${players.map(player => 
                                                        `<th scope="col" style="text-align: center;" id="${player.id}">
                                                            <img src = "res/player.png" alt = "playerProfilePic" width="80" height="100">
                                                            <br><p style="color:red">${player.name}</p>
                                                            Pontszám: ${player.points} <br>
                                                        </th>`
                                                    ).join('')}
                                                </tr>;
                                                </table>
    
                                                <button type="button " class="btn btn-success btn-lg" id="reStart">Új játék kezdése</button>
                                                <button type="button " class="btn btn-success btn-lg" id="reStartSame">Új játék kezdése beállítások és játékosok megőrzésével</button>
                                            </div>`;
                                        }
                                        let saveResult = {
                                            Players: players,
                                            Winner: [winners[0].name, winners[0].points],
                                            eTime: elapsedTime
                                        }
                                        localStorage.setItem('Game results:', saveResult);

                                        const reStart = document.querySelector('#reStart');
                                        const reStartSame = document.querySelector('#reStartSame');

                                        reStart.addEventListener('click', function() {
                                            location.reload();
                                        });
                                        reStartSame.addEventListener('click', function() {
                                            alert("Sajnos erre a + funkcióra nem maradt időm! Használd az új játék kezdése gombot!");
                                        });
                                }
                            }     
                        }
                    }
                }
            }
        }
    }

    function isThereSet() {
        let SETsFound = SETs();

        if (SETsFound.length == 1) {
            gameAnswer.innerHTML = `
            <div class="alert alert-warning alert-dismissible">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Rendszer:</strong> Pontosan 1 SET van a játéktáblán
            </div>`;
        } else if (SETsFound.length > 1) {
            gameAnswer.innerHTML = `
            <div class="alert alert-warning alert-dismissible">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Rendszer:</strong> Több, mint 1 SET van a játéktáblán
            </div>`;
        } else {
            gameAnswer.innerHTML = `
            <div class="alert alert-warning alert-dismissible">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Rendszer:</strong> Játéktáblán nincs SET!
            </div>`;
        }
    }

    function showSet() {
        let SETsFound = SETs();

        if (SETsFound.length >= 1) {
            gameAnswer.innerHTML = `
            <div class="alert alert-warning alert-dismissible">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Rendszer:</strong> Az alábbi kártyák egy SET: <br>
                ${SETsFound[0][0].toImage()} ${SETsFound[0][1].toImage()} ${SETsFound[0][2].toImage()}
            </div>`;
        } else {
            gameAnswer.innerHTML = `
            <div class="alert alert-warning alert-dismissible">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Rendszer:</strong> Játéktáblán nincs SET!
            </div>`;
        }

    }
}

/* HTML Generálók */
function reGenTable(gameTable) {
    return `
        <table class="table borderless" style="text-align: center;">
            ${gameTable.map(row => 
                `<tr>
                    ${row.map(card => 
                        `<td>${card.toImage()}</td>`
                    ).join('')}
                </tr>`  
            ).join('')}
        </table>
    `;
}
function reGenPlayerRow(players) {
    if(isSinglePlayer()) {
        return `
        <tr>
            ${players.map(player => 
                `<th scope="col" style="text-align: center;" id="${player.id}">
                    <img src = "res/player.png" alt = "playerProfilePic" width="80" height="100">
                    <br><p style="color:red">${player.name}</p>
                    Pontszám: ${player.points} <br>
                </th>`
            ).join('')}
        </tr>`;
    } else {
        return `
        <tr>
            ${players.map(player => 
                `<th scope="col" style="text-align: center;" id="${player.id}">
                    <img src = "res/player.png" alt = "playerProfilePic" width="80" height="100">
                    <br><p style="color:red">${player.name}</p>
                    Pontszám: ${player.points} <br>
                    Tippelhet: ${player.banned ? `<span style="color:red">nem</span>` : `<span style="color:green">igen</span>`}
                </th>`
            ).join('')}
        </tr>`;
    }
}

function genGameArea(gameTable) {
    return `
    <div class = "container">
        <table class="table" id="playerRow"> 

        </table>
        <span id="gameAnswer"> </span>
        <div class="row">
            <div class="col-sm-8" style="background-color:#e8fced;">
                <table class="table borderless" style="text-align: center;">
                    ${gameTable.map(row => 
                        `<tr>
                        ${row.map(card => 
                            `<td>${card.toImage()}</td>`
                        ).join('')}
                        </tr>`  
                    ).join('')}
                </table>
            </div>
            <div class="col-sm-4"">
                <h1 id=gM> </h1>
                <h2 id="deck">Pakli: 81/81</h2>
                <h1 id="timer"></h1>
                <button type="button " class="btn btn-success btn-lg" id="SET">SET</button>
                <button type="button " class="btn btn-primary btn-lg" id="ADD">+3 lap hozzáadása</button>
                <br>
                <span id="maxCardSpan"> </span>
                <span id="setSpan">
                    <div class="alert alert-dark">

                    </div>
                </span>
                <span id="progressBarSpan"></span>

                <h2>Segítség</h2>
                <button type="button" class="btn btn-warning btn-lg" id="FIND">Van-e SET?</button>
                <button type="button" class="btn btn-warning btn-lg" id="SHOW">Mutass egy SET-et!</button>
                <span id="helpAnswer">

                </span> 
                <br>
                <div class="alert alert-dark">
                    <a href="https://fejlesztojatekvilag.hu/uploaded/set_magyar_szabaly.pdf" target="_blank">A játék részletes leírásáért kattints ide!</a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-8" style="background-color: #f8f9fa;">
                <h4><strong>Eddigi eljátszott lapok: </strong></h4>
                <ul id="logOfCards" style="list-style-type:none;">

                </ul>
                    
            </div>
        </div>
                            
    </div>
  `;
}
function updateInfoBox(infoBoxState) {
    if (infoBoxState == 0) {
        return `
        <div class="alert alert-dark">
            <strong>INFO:</strong> Ha találtál egy SET-et, kattints a SET gombra, 
            ezt követően ki kell választanod 3 kártyát!
        </div>`;
    } else if (infoBoxState == 1) {
        return ` 
        <div class="alert alert-dark">
            <strong>INFO:</strong> Ha találtál egy SET-et, kattints a SET gombra, majd válaszd ki a SET-et
            megtaláló játékost, ezt követően 10 másodperc fog állni a rendelkezésedre, hogy kiválaszd a három kártyát!
        </div>`;
    } else if (infoBoxState == 2) {
        return ` 
        <div class="alert alert-dark">
            <strong>INFO:</strong> Válassz ki 3 kártyát!
        </div>`;
    } else if (infoBoxState == 3) {
        return `
        <div class="alert alert-dark">
            <strong>INFO:</strong> Válaszd ki a SET-et megtaláló játékost!
        </div>`;
    } else if (infoBoxState == 4) {
        return `
        <div class="alert alert-dark">
            <strong>INFO:</strong> 10 másodperced van kijelölni a 3 kártyát!
        </div>`;

    }
}

/* Segédfüggvények */

/* Segédfüggvények -> SET találó függvények */
function SETs() {
    let SETsFound = [];
    let cardsOnTable = [];

    /* Mátrix elemeit áthelyzetem egy egydimenziós tömbbe, hogy könnyebb lehessen velük dolgozni */
    for (let i = 0; i < gameTable.length; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameTable[i][j].name !== "empty")
                cardsOnTable.push(gameTable[i][j]);
        }
    }
    /* Megkeresem az összes SET-et, majd pusholom őket a SETsFound tömbbe */
    for (let i = 0; i < cardsOnTable.length; i++) {
        for (let j = i + 1; j < cardsOnTable.length; j++) {
            for (let k = j + 1; k < cardsOnTable.length; k++) {
                if (checkSelectedCards([cardsOnTable[i], cardsOnTable[j], cardsOnTable[k]])) {
                    SETsFound.push([cardsOnTable[i], cardsOnTable[j], cardsOnTable[k]]);
                }
            }
        }
    }
    return SETsFound;
}

function checkSelectedCards(selCards) {
    let SET = true;
    let properties = {
        shape: [],
        color: [],
        number: [],
        content: [],
    };
    for(let prop = 0; prop < 4; prop++) {
        for(let cardProp = 0; cardProp < 3; cardProp++) {
            if(prop == 0) {
                properties.shape.push(selCards[cardProp].shape);
            } else if( prop == 1) {
                properties.color.push(selCards[cardProp].color);
            } else if( prop == 2) {
                properties.number.push(selCards[cardProp].number);
            } else if( prop == 3) {
                properties.content.push(selCards[cardProp].content);
            }
        }
    }
    for (let property in properties) {
        if (!checkIfSameOrDifferent(properties[property])) {
            SET = false;
        }
    }
    return SET;
}

function checkIfSameOrDifferent(properties) {
    let same = true,
        different = true;
    if (properties[0] === properties[1]) {
        different = false;
    } else {
        same = false;
    }
    if (properties[1] === properties[2]) {
        different = false;
    } else {
        same = false;
    }
    if (properties[0] === properties[2]) {
        different = false;
    } else {
        same = false;
    }
    return same || different;
}

/* Segédfüggvények -> Egyéb segédfüggvények */
function countDown() {
    let timeleft = 10;
    let progressBarTimer = setInterval(function(){
        if(timeleft <= 0){
            clearInterval(progressBarTimer);
        }
        document.getElementById("progressBar").value = 10 - timeleft;
        timeleft -= 1;
    }, 1000);
    return timeleft;
}

function deselect(targets) {
    for (let i = 0; i < targets.length; i++) {
        targets[i].style.border = "0px"
    }
}

function replaceCards(gameTable, cards, selectedCardsCoords) {
    if (cards.length >= 3) {
        for (let i = 0; i < 3; i++) {
            gameTable[selectedCardsCoords[i][0]][selectedCardsCoords[i][1]] = cards.pop();
        }
    } else if (cards.length == 0) {
        for (let i = 0; i < 3; i++) {
            gameTable[selectedCardsCoords[i][0]][selectedCardsCoords[i][1]] = new Card("null", "null", -1, "null", "empty");
        }
    }
}


function isSinglePlayer() {
    return players.length == 1;
}

function shuffleCards(cardsArray) {
    let currentIndex = cardsArray.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cardsArray[currentIndex];
        cardsArray[currentIndex] = cardsArray[randomIndex];
        cardsArray[randomIndex] = temporaryValue;
    }
    return cardsArray;
}

function getCardName(cardShape, cardColor, cardNumber, cardContent) {
    let cardShapeName = "";
    let cardColorName = "";
    let cardContentName = "";
    let cardName = "";

    if (cardShape == 0) {
        cardShapeName = "P"
    } else if (cardShape == 1) {
        cardShapeName = "S";
    } else if (cardShape == 2) {
        cardShapeName = "D";
    }

    if (cardColor == 0) {
        cardColorName = "r"
    } else if (cardColor == 1) {
        cardColorName = "g";
    } else if (cardColor == 2) {
        cardColorName = "p";
    }

    if (cardContent == 0) {
        cardContentName = "S"
    } else if (cardContent == 1) {
        cardContentName = "H";
    } else if (cardContent == 2) {
        cardContentName = "O";
    }

    return cardName = (cardNumber.toString() + cardContentName + cardColorName + cardShapeName);
}
//Overload
function getCardNameOnEasy(cardShape, cardColor, cardNumber) {
    let cardShapeName = "";
    let cardColorName = "";
    let cardName = "";

    if (cardShape == 0) {
        cardShapeName = "P"
    } else if (cardShape == 1) {
        cardShapeName = "S";
    } else if (cardShape == 2) {
        cardShapeName = "D";
    }

    if (cardColor == 0) {
        cardColorName = "r"
    } else if (cardColor == 1) {
        cardColorName = "g";
    } else if (cardColor == 2) {
        cardColorName = "p";
    }
    return cardName = (cardNumber.toString() + "S" + cardColorName + cardShapeName);
}

function xyCoord(td) {
    const x = td.cellIndex
    const tr = td.parentNode
    const y = tr.sectionRowIndex
    return { x, y }
}
function getPlayerID(tr) {
    const x = tr.cellIndex
    const table = tr.parentNode
    const y = table.sectionRowIndex
    return { x, y }
}

function maxPointFinder() {
    let maxPoint = 0;
    for (let i = 0; i < players.length; i++) {
        if (maxPoint < players[i].points) {
            maxPoint = players[i].points;
        }
    }
    return maxPoint;
}
function winnersFinder(maxPoint) {
    let winners = [];
    for (let i = 0; i < players.length; i++) {
        if (maxPoint === players[i].points) {
            winners.push(players[i]);
        }
    }
    return winners;
}

/* Segédfüggvények -> Teszter függvény: Következő SET-nél azonnal játék vége vizsgálat */ 
function tester_EndRightNow() {
    testerOption_EndRightNow = true;
    console.log("Következő SET vizsgálatnál véget for érni a játék!");
}