let game;
let gameWidth = 900, gameHeight = 600;

function setup() {
    createCanvas(windowWidth, windowHeight);

    createUI(gameWidth, gameHeight, 0.9);

    addScreen('game', {
        draw: () => drawGame(game.toObject())
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