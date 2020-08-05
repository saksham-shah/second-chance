class Bullet {
    constructor(pos, speed, angle, playerFired = true, colour = [255, 255, 0]) {
        this.pos = pos;
        this.vel = p5.Vector.fromAngle(angle, speed);

        this.speed = speed;
        this.angle = angle;

        this.playerFired = playerFired;

        this.colour = colour;

        this.past = [];
        this.birthTime = -1;
        this.deathTime = -1;
    }

    update(game) {
        if (game.rewinding && this.past.length > 0 && this.past[this.past.length - 1].time >= game.time) {
            let indexFromEnd = this.past[this.past.length - 1].time - game.time;
            let pastData = this.past[this.past.length - indexFromEnd - 1];
            this.pos.x = pastData.x;
            this.pos.y = pastData.y;
            this.deathTime = -1;
            return false;
        }

        if (this.birthTime < 0) this.birthTime = game.time; 
        let x = this.pos.x;
        let y = this.pos.y;

        // Ensures that the bullet only moves a maximum of 5 pixels at a time
        // Prevents fast bullets from going through objects without skipping them
        var distanceMoved = 0;
        var step = this.speed / Math.ceil(this.speed);
        var collide = false;
        // Keeps moving until it collides or moves the max distance of one frame
        while (distanceMoved < this.speed && !collide) {
            x += step * Math.cos(this.angle);
            y += step * Math.sin(this.angle);
            distanceMoved += step;
            collide = this.checkCollisions(x, y, game);
        }

        this.pos.x = x;
        this.pos.y = y;

        this.past.push({ x, y, time: game.time });
        if (this.past.length > game.maxRewind) {
            this.past.splice(0, 1);
        }

        return collide;
    }

    rewind(game) {
        // if (this.past.length == 0) {
        //     return;
        // }
        if (game.time < this.birthTime) return;
        if (this.past[this.past.length - 1].time > game.time) {
            let indexFromEnd = this.past[this.past.length - 1].time - game.time;
            let pastData = this.past[this.past.length - indexFromEnd];
            this.pos.x = pastData.x;
            this.pos.y = pastData.y;
            this.deathTime = -1;
        }
        // if (game.time < this.deathTime || this.deathTime < 0) {
        //     let pastData = this.past.pop();
        //     this.pos.x = pastData.x;
        //     this.pos.y = pastData.y;
        //     this.deathTime = -1;
        // }
    }

    checkCollisions(x, y, game) {
        let testVec = createVector(x, y);
        for (let entity of game.entities) {
            if (entity.deathTime >= 0 || entity.birthTime > game.time) continue;
            if (this.playerFired == entity.player) continue;
            let diffVec = p5.Vector.sub(testVec, entity.pos);
            let dSq = diffVec.magSq();
            if (dSq < entity.r * entity.r) {
                entity.hit = true;
                return true;
            }
        }

        if (x < 0 || x > gameWidth || y < 0 || y > gameHeight) {
            return true;
        }

        return false;
    }

    toObject() {
        return {
            pos: this.pos,
            angle: this.angle,
            colour: this.colour
        }
    }
}