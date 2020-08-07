let comboPercentage = 0;

function drawGame(gameObj) {
    let { entities, bullets, particles, blurred, time, score, combo, lastKill, rewind } = gameObj;

    // if (rewind) {
        background(0, 0, 30, 30 + 255 * blurred);
    // } else {
    //     background(0, 0, 30, 255);
    // }

    // fill(0, 0, 40, 30 + 255 * blurred);
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

    for (let particle of particles) {
        drawParticle(particle);
    }

    pop();

    // Pause symbol
    if (game.paused) {
        noStroke();
        fill(255, 50);
        rect(750, 450, 30, 200);
        rect(850, 450, 30, 200);

        textAlign(CENTER);
        textSize(40);
        text(game.readyToUnpause ? 'CLICK TO CONTINUE' : 'PAUSED', 800, 600);
    }

    // Game over screen
    if (game.gameover) {
        fill(0, 0, 30, 150);
        stroke(0, 0, 100, 30 + 255 * blurred);
        rect(800, 450, 800, 800);

        fill(titleColours[titleColour]);
        noStroke();
        textAlign(CENTER);
        textSize(100);
        text('GAME OVER', 800, 200);

        textSize(50);
        text('Press space to play again', 800, 750);

        fill(titleColours[game.stats.difficulty]);
        text(difficulties[game.stats.difficulty].toUpperCase(), 800, 275);

        fill(255);
        text(`Time: ${framesToTime(game.stats.time)}`, 800, 390);
        text(`Score: ${game.stats.score}`, 800, 450);
        text(`Rewinds: ${game.stats.rewind}`, 800, 510);
        text(`Highest combo: ${game.stats.combo}`, 800, 570);
        text(`Longest survival: ${framesToTime(game.stats.survival)}`, 800, 630);

        textSize(40);
        text('DIFFICULTY', 1400, 675);
    }

    function framesToTime(time) {
        let seconds = Math.floor(time / 60);
        let min = Math.floor(seconds / 60).toString();
        let sec = (seconds % 60).toString();
    
        if (sec.length == 1) sec = '0' + sec;
    
        return `${min}:${sec}`;
    }
    
    let timeStr = framesToTime(time);
    
    textAlign(CENTER);
    textSize(80);
    fill(255);
    noStroke();

    text(timeStr, 200, 200);

    text(score, 1400, 200);

    textSize(30);
    text('HIGH SCORE', 1400, 275);
    text(highscore, 1400, 315);

    // Draw combo
    let percentage = (game.comboTime - lastKill) / game.comboTime;
    if (comboPercentage < percentage) {
        comboPercentage += 0.1;
        if (comboPercentage > percentage) {
            comboPercentage = percentage;
        }
    } else {
        comboPercentage = percentage;
    }

    let r = 80;

    if (combo > 0 && comboPercentage > 0) {
        push();
        translate(1400, 500);

        fill(0, 200, 0, 150);
        stroke(0, 255, 0);
        strokeWeight(1);
        arc(0, 0, r * 2, r * 2, -Math.PI / 2, comboPercentage * 2 * Math.PI - Math.PI / 2);

        fill(0, 0, 40);
        arc(0, 0, r * 1.5, r * 1.5, -Math.PI / 2, comboPercentage * 2 * Math.PI - Math.PI / 2);

        textSize(r * 0.75);
        textAlign(CENTER);
        noStroke();
        fill(255);
        text(combo + 'x', 0, r / 4);

        pop();
    }

    // Draw timer
    let stage;
    if (rewind < game.maxRewind) {
        percentage = 1 - rewind / game.maxRewind;
        stage = 1;
    } else if (rewind < 2 * game.maxRewind) {
        percentage = (rewind - game.maxRewind) / game.maxRewind;
        stage = 2;
    } else if (rewind < 3 * game.maxRewind) {
        percentage = (rewind - 2 * game.maxRewind) / game.maxRewind;
        stage = 3;
    } else {
        percentage = 0;
        stage = 4;
    }

    push();
    translate(200, 500);

    // fill(0, 0, 40);
    // noStroke();
    // ellipse(0, 0, r * 2);
    strokeWeight(3);

    // fill(100, 150);

    switch (stage) {
        case 1:
            fill(200, 200, 0, 150);
            stroke(255, 255, 0);
            ellipse(0, 0, r * 2);
            fill(75, 75, 0);
            break;
        case 2:
            fill(0, 200, 200, 150);
            stroke(0, 255, 255);
            ellipse(0, 0, r * 2);
            fill(0, 75, 75);
            break;
        case 3:
            fill(200, 150);
            stroke(255);
            ellipse(0, 0, r * 2);
            fill(75);
            break;
        default:
            fill(0, 75, 0);
            stroke(0, 255, 0);
            ellipse(0, 0, r * 2);
    }

    arc(0, 0, r * 2, r * 2, -Math.PI / 2, percentage * 2 * Math.PI - Math.PI / 2);
    rotate(-Math.PI / 2)
    line(0, 0, r, 0);
    for (let i = 0; i < 12; i++) {
        if (i % 3 == 0) {
            line(r * 0.8, 0, r, 0);
        } else {
            line(r * 0.9, 0, r, 0);
        }
        rotate(Math.PI / 6);
    }
    rotate(percentage * 2 * Math.PI);
    line(0, 0, r, 0);

    pop();
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

            let offset = game.lastRewind - 2 * game.maxRewind;
            if (offset >= 0 && offset < 120) {
                // Circle flashes
                noFill();
                stroke(255, 255, 0, 75 - 75 * Math.cos(offset * 2 * Math.PI / 40));
                strokeWeight(entity.r * 3);
                ellipse(0, 0, entity.r * 9);
            }
            break;
        case 'ghost':
            fill(0, 200, 200, 150);
            stroke(0, 255, 255);
            ellipse(0, 0, entity.r * 2);

            strokeWeight(5);
            line(entity.r + 15, 0, entity.r + 10, 5)
            line(entity.r + 15, 0, entity.r + 10, -5)
            break;
        case 'shooty':
            fill(200, 0, 200, 150);
            stroke(255, 0, 255);
            entity.r *= 1.3
            // ellipse(0, 0, entity.r * 2);
            beginShape();
            vertex(entity.r, 0);
            vertex(entity.r * Math.cos(Math.PI * 2 / 3), entity.r * Math.sin(Math.PI * 2 / 3));
            vertex(entity.r * Math.cos(Math.PI * 4 / 3), entity.r * Math.sin(Math.PI * 4 / 3));
            endShape(CLOSE);

            if (entity.enraged) {
                rotate(-entity.angle);
                translate(0, -40)
                rotate(0.3 * Math.sin(frameCount / 30 * Math.PI * 2))
                rect(0, 15, 5, 5);
                rect(0, -2.5, 5, 20);
            }
            break;
        case 'spiky':
            fill(200, 120, 0, 150);
            stroke(255, 150, 0);
            beginShape();
            let spikes = 16;
            let aOffset = Math.PI * 2 / spikes;
            let r1 = entity.r;
            let r2 = r1 * 1.2;
            for (let i = 0; i < spikes; i++) {
                let a1 = i * aOffset;
                let a2 = a1 + aOffset * 0.5;
                vertex(r2 * Math.cos(a1), r2 * Math.sin(a1));
                vertex(r1 * Math.cos(a2), r1 * Math.sin(a2));
            }
            endShape(CLOSE);
            // ellipse(0, 0, entity.r * 2);
            break;
        case 'splity':
            fill(0, 200, 0, 150);
            stroke(0, 255, 0);
            rect(0, 0, entity.r * 2, entity.r * 2);
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

    stroke(bullet.colour);
    strokeWeight(4);
    line(0, 0, -10, 0);

    pop();
}

function drawParticle(particle) {
    push();
    translate(particle.pos);

    fill(particle.colour);
    noStroke(4);
    ellipse(0, 0, particle.r * 2);

    pop();
}