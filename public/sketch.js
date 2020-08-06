let game;
let gameWidth = 800, gameHeight = 800;
let difficulty = 0;
let difficulties = ['Easy', 'Normal', 'Hard', 'Insane'];

let highscore = 0;

let sounds = {}, font;

const soundsToLoad = [
    {
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
        name: 'rewind2',
        file: 'rewind2.wav'
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
    hover: 2,
    playershoot: 0.5,
    gameover: 2,
    enemyspawn: 0.5,
    rewind2: 2,
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

    createUI({
        width: 1600,
        height: 900,
        buffer: 1
    });

    addScreen('menu', {
        draw: () => {
            textAlign(CENTER);
            fill(255);
            noStroke();

            textSize(150);
            text('Second Chance', 800, 200);

            textSize(40);
            text('DIFFICULTY', 800, 675);
        }
    })
    .addButton({
        position: { x: 800, y: 450 },
        width: 300,
        height: 150,
        text: 'PLAY',
        textSize: 75,
        onClick: () => {
            setScreen('game');
            game = new Game(difficulty);
        }
    })
    .addButton({
        position: { x: 800, y: 750 },
        width: 200,
        height: 75,
        text: () => difficulties[difficulty],
        textSize: 50,
        onClick: () => {
            difficulty = (difficulty + 1) % difficulties.length;
            localStorage.setItem('difficulty', difficulty);
        }
    })

    addScreen('game', {
        style: 'game',
        draw: () => drawGame(game.toObject()),
        getCursorState: () => {
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
    .addButton({
        style: 'default',
        position: { x: 1400, y: 750 },
        width: 200,
        height: 75,
        text: () => difficulties[difficulty],
        textSize: 50,
        onClick: () => {
            difficulty = (difficulty + 1) % difficulties.length;
            localStorage.setItem('difficulty', difficulty);
        },
        hidden: true,
        label: 'difficulty'
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

    let storedHS = localStorage.getItem('highscore');
    if (storedHS !== null) {
        highscore = parseInt(storedHS);
    }

}

function draw() {    
    if (game) game.update();

    updateUI();
    drawUI();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    resizeUI();
}