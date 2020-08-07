let game;
let gameWidth = 800, gameHeight = 800;
let difficulty = 0;
let difficulties = ['Tutorial', 'Easy', 'Normal', 'Hard', 'Insane', 'Impossible'];

let highscore = 0;

let titleColours = [[255, 255, 0], [0, 255, 0], [0, 255, 255], [255, 0, 255], [255, 150, 0], [255, 0, 0]];
let titleColour = 0;

let difficultyColours = ['yellow', 'green', 'blue', 'pink', 'orange', 'red'];

let sounds = {}, font;
let filter;
let filterToggle = true;

function setFilter(bool) {
    if (filterToggle == bool) return;
    filter.toggle();
    filterToggle = !filterToggle;
}
const soundsToLoad = [
    {
        name: 'music',
        file: 'secondchance.wav'
    }, {
        name: 'click',
        file: 'buttonclick.wav'
    }, {
        name: 'hover',
        file: 'buttonhover.mp3'
    }, {
        name: 'playershoot',
        file: 'playershoot.wav'
    }, {
        name: 'enemyshoot',
        file: 'enemyshoot.wav'
    }, {
        name: 'rewind',
        file: 'rewind.wav'
    }, {
        name: 'gameover',
        file: 'gameover.wav'
    }, {
        name: 'enemydeath',
        file: 'enemydeath.wav'
    }, {
        name: 'enemyspawn',
        file: 'enemyspawn.wav'
    }, {
        name: 'shootyrage',
        file: 'shootyrage.wav'
    }, {
        name: 'bulletreverse',
        file: 'bulletreverse.wav'
    },
];

const volumes = {
    music: 0.7,
    hover: 2,
    playershoot: 0.5,
    gameover: 2,
    enemyspawn: 0.5,
    bulletreverse: 0.3
}

function preload() {
    for (let sound of soundsToLoad) {
        let p5sound = loadSound('assets/' + sound.file);
        let vol = volumes[sound.name];
        if (vol == undefined) vol = 1;
        p5sound.setVolume(vol);

        sounds[sound.name] = p5sound;
    }
    // sounds.click = loadSound('assets/buttonclick.wav');
    // sounds.hover = loadSound('assets/buttonhover.mp3');
    // sounds.shoot = loadSound('assets/playershoot.wav');

    // sounds.click.setVolume(0.3);

    font = loadFont('assets/ShareTechMono-Regular.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    setInterval(() => {
        titleColour = (titleColour + 1) % 5;
    }, 500);

    setTimeout(() => {
        resizeCanvas(windowWidth, windowHeight);

        resizeUI();
    }, 2000);

    sounds.music.loop();

    filter = new p5.LowPass();
    filter.freq(600);
    sounds.music.disconnect();
    sounds.music.connect(filter);

    createUI({
        width: 1600,
        height: 900,
        buffer: 1
    });

    // addLoadScreen();
    
    addScreen('menu', {
        draw: () => {
            textAlign(CENTER);
            fill(titleColours[titleColour]);
            noStroke();

            textSize(150);
            text('Second Chance', 800, 200);

            fill(255);
            textSize(40);
            text('DIFFICULTY', 800, 675);
        }
    })
    .addButton({
        style: 'yellow',
        position: { x: 800, y: 450 },
        width: 300,
        height: 150,
        text: 'PLAY',
        textSize: 100,
        onClick: () => {
            setScreen('game');
            game = new Game(difficulty);
        }
    })
    .addButton({
        position: { x: 800, y: 750 },
        width: 300,
        height: 75,
        text: () => difficulties[difficulty],
        textSize: 50,
        onClick: () => {
            difficulty = (difficulty + 1) % difficulties.length;
            localStorage.setItem('difficulty', difficulty);
            getElement('menu difficulty')._setStyle(difficultyColours[difficulty]);
            getElement('game difficulty')._setStyle(difficultyColours[difficulty]);
        },
        label: 'menu difficulty'
    })

    addScreen('game', {
        style: 'game',
        draw: () => {
            drawGame(game.toObject());
            drawTutorials();
        },
        getCursorState: state => {
            if (state) return state;
            if (!game.gameover) {
                if (game.ghost) return 'ghost';
                return 'game';
            }
        }
    })
    .on('keyDown', e => {
        if (game.gameover && e.keyCode == 32) {
            game = new Game(difficulty);
        }
    })
    .on('mouseDown', e => {
        if (game.paused && game.readyToUnpause) {
            game.paused = false;
            resetTutorial();
            if (typeof tutorialCallback == 'function') tutorialCallback();
        }
    })
    .addButton({
        // style: 'default',
        position: { x: 1400, y: 750 },
        width: 300,
        height: 75,
        text: () => difficulties[difficulty],
        textSize: 50,
        onClick: () => {
            difficulty = (difficulty + 1) % difficulties.length;
            localStorage.setItem('difficulty', difficulty);
            getElement('menu difficulty')._setStyle(difficultyColours[difficulty]);
            getElement('game difficulty')._setStyle(difficultyColours[difficulty]);
        },
        hidden: true,
        label: 'game difficulty'
    })
    .addButton({
        style: 'yellow',
        position: { x: 200, y: 750 },
        width: 300,
        height: 75,
        text: () => 'BACK',
        textSize: 50,
        onClick: () => {
            setScreen('menu');
            if (game.stats.difficulty == 0) endTutorial();
            game = null;
        }
    });

    addStyles();

    setupUI();

    setFont(font);
    setSounds(sounds);
    setCursors({
        game: 'assets/game.cur',
        ghost: 'assets/ghost.cur'
    });

    setScreen('menu');

    let storedDifficulty = localStorage.getItem('difficulty');
    if (storedDifficulty !== null) {
        difficulty = parseInt(storedDifficulty);
    }
    
    getElement('menu difficulty')._setStyle(difficultyColours[difficulty]);
    getElement('game difficulty')._setStyle(difficultyColours[difficulty]);

    let storedHS = localStorage.getItem('highscore');
    if (storedHS !== null) {
        highscore = parseInt(storedHS);
    }

}

function draw() {
    // updateTutorials();
    if (game && !game.paused) game.update();

    updateUI();
    drawUI();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    resizeUI();
}