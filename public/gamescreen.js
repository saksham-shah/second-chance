function drawGame(game) {
    let { entities, bullets } = game;

    for (let bullet of bullets) {
        drawBullet(bullet);
    }

    for (let entity of entities) {
        drawEntity(entity);
    }
}

function drawEntity(entity) {
    push();
    translate(entity.pos);
    rotate(entity.angle);
    strokeWeight(2);

    switch (entity.type) {
        case 'player':
            fill(200, 200, 0);
            stroke(255, 255, 0);
            ellipse(0, 0, entity.r * 2);

            strokeWeight(5);
            line(entity.r + 15, 0, entity.r + 10, 5)
            line(entity.r + 15, 0, entity.r + 10, -5)
            break;
        default:
            fill(0);
            stroke(255);
            ellipse(0, 0, entity.r * 2);
            break;
    }

    pop();
}

function drawBullet(bullet) {
    push();
    translate(bullet.pos);
    rotate(bullet.angle);

    stroke(255, 255, 0);
    strokeWeight(4);
    line(0, 0, -10, 0);

    pop();
}