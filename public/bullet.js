class Bullet {
    constructor(pos, speed, angle, playerFired = true) {
        this.pos = pos;
        this.vel = p5.Vector.fromAngle(angle, speed);

        this.speed = speed;
        this.angle = angle;

        this.playerFired = playerFired;

        this.past = [];
        this.deathTime = -1;
    }

    update(game) {
        let x = this.pos.x;
        let y = this.pos.y;

        // Ensures that the bullet only moves a maximum of 5 pixels at a time
        // Prevents fast bullets from going through objects without skipping them
        var distanceMoved = 0;
        var step = this.speed / Math.ceil(this.speed / 3);
        var collide = false;
        // Keeps moving until it collides or moves the max distance of one frame
        while (distanceMoved < this.speed && !collide) {
            x += step * Math.cos(this.angle);
            y += step * Math.sin(this.angle);
            distanceMoved += step;
            collide = this.checkCollisions(x, y, game.entities);
        }

        this.pos.add(this.vel);

        if (this.past.length > game.maxRewind) {
            this.past.splice(0, 1);
        }

        return collide;
    }

    checkCollisions(x, y, entities) {
        let testVec = createVector(x, y);
        for (let entity of entities) {
            if (this.playerFired == (entity.type == 'player')) continue
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
            angle: this.angle
        }
    }
}