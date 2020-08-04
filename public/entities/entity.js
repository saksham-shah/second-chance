class Entity {
    constructor(pos, r, type = 'player', vel = createVector(0, 0)) {
        this.pos = pos;
        this.vel = vel;
        this.acc = null;

        this.type = type;
        this.r = r;

        this.maxAcc = 0.8;
        this.maxVel = 7;

        this.hit = false;

        this.past = [];
        this.birthTime = -1;
        this.frameData = null;
        this.deathTime = -1;
    }

    superUpdate(game) {
        if (this.birthTime < 0) this.birthTime = game.time; 
        this.acc = createVector(0, 0);
        this.frameData = {};

        let bullets = this.update(game);

        this.acc.limit(this.maxAcc);
        this.vel.add(this.acc);

        this.vel.limit(this.maxVel);
        this.pos.add(this.vel);

        this.limitToWalls();

        this.frameData.x = this.pos.x;
        this.frameData.y = this.pos.y;

        this.past.push(this.frameData);
        if (this.past.length > game.maxRewind) {
            this.past.splice(0, 1);
        }

        return bullets;
    }

    limitToWalls() {
        let buffer = 3;

        if (this.pos.x < this.r + buffer) {
            this.pos.x = this.r + buffer;
        } else if (this.pos.x > gameWidth - this.r - buffer) {
            this.pos.x = gameWidth - this.r - buffer;
        }

        if (this.pos.y < this.r + buffer) {
            this.pos.y = this.r + buffer;
        } else if (this.pos.y > gameHeight - this.r - buffer) {
            this.pos.y = gameHeight - this.r - buffer;
        }
    }

    rewind(game) {
        if (this.past.length == 0) {
            return;
        }
        if (game.time < this.deathTime || this.deathTime < 0) {
            let pastData = this.past.pop();
            this.pos.x = pastData.x;
            this.pos.y = pastData.y;
            this.deathTime = -1;
        }
    }

    toObject() {
        return {
            pos: this.pos,
            angle: 0,
            // vel: this.vel,
            r: this.r,
            type: this.type
        }
    }
}