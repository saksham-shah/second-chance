let game;
let gameWidth = 800, gameHeight = 800;
let difficulty = 0;
let difficulties = ['Easy', 'Normal', 'Hard', 'Insane'];

let sounds = {}, font;

function preload() {
    sounds.click = loadSound('assets/buttonclick.wav');
    sounds.hover = loadSound('assets/buttonhover.mp3');

    sounds.click.setVolume(0.3);

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
        }
    })

    addScreen('game', {
        style: 'game',
        draw: () => drawGame(game.toObject())
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
        },
        hidden: true,
        label: 'difficulty'
    });

    addStyles();

    setupUI();

    setFont(font);
    setSounds(sounds);

    setScreen('menu');

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