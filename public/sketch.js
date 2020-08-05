let game;
let gameWidth = 800, gameHeight = 800;

function setup() {
    createCanvas(windowWidth, windowHeight);

    createUI({
        width: 1600,
        height: 900,
        buffer: 1
    });

    addScreen('game', {
        draw: () => drawGame(game.toObject())
    })
    .on('keyDown', e => {
        if (game.gameover && e.keyCode == 32) {
            game = new Game();
        }
    });

    addStyles();

    setupUI();

    setScreen('game');

    game = new Game();
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