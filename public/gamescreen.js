let comboPercentage = 0;

function drawGame(game) {
    let { entities, bullets, rewind, time, score, combo, lastKill } = game;

    // if (rewind) {
        background(0, 0, 30, 30 + 255 * rewind);
    // } else {
    //     background(0, 0, 30, 255);
    // }

    fill(0, 0, 40);
    noStroke();
    rect(800, 25, 1600, 50);
    rect(800, 875, 1600, 50);
    rect(200, 450, 400, 900);
    rect(1400, 450, 400, 900);

    noFill();
    stroke(0, 0, 100);
    rect(800, 450, 800, 800);

    push();
    translate(400, 50);

    for (let bullet of bullets) {
        drawBullet(bullet);
    }

    for (let entity of entities) {
        drawEntity(entity);
    }

    pop();

    let seconds = Math.floor(time / 60);
    let min = Math.floor(seconds / 60).toString();
    let sec = (seconds % 60).toString();

    if (sec.length == 1) sec = '0' + sec;

    let timeStr = `${min}:${sec}`;
    
    textAlign(CENTER);
    textSize(80);
    fill(255);
    noStroke();

    text(timeStr, 200, 200);

    text(score, 1400, 200);

    // Draw combo
    let percentage = (60 - lastKill) / 60;
    if (comboPercentage < percentage) {
        comboPercentage += 0.1;
        if (comboPercentage > percentage) {
            comboPercentage = percentage;
        }
    } else {
        comboPercentage = percentage;
    }

    if (combo > 0 && comboPercentage > 0) {
        push();
        translate(1400, 500);

        let r = 80;

        fill(0, 200, 0, 150);
        stroke(0, 255, 0);
        arc(0, 0, r * 2, r * 2, -Math.PI / 2, comboPercentage * 2 * Math.PI - Math.PI / 2);

        fill(0, 0, 40);
        arc(0, 0, r * 1.5, r * 1.5, -Math.PI / 2, comboPercentage * 2 * Math.PI - Math.PI / 2);

        textSize(r);
        textAlign(CENTER);
        noStroke();
        fill(255);
        text(combo + 'x', 0, r/3);

        pop();
    }
}

function drawEntity(entity) {
    push();
    translate(entity.pos);
    rotate(entity.angle);
    strokeWeight(2);

    switch (entity.type) {
        case 'player':
            fill(200, 200, 0, 150);
            stroke(255, 255, 0);
            ellipse(0, 0, entity.r * 2);

            strokeWeight(5);
            line(entity.r + 15, 0, entity.r + 10, 5)
            line(entity.r + 15, 0, entity.r + 10, -5)
            break;
        case 'ghost':
            fill(0, 200, 200, 150);
            stroke(0, 255, 255);
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