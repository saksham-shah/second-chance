class Entity {
    constructor(pos, r, type = 'player', vel = createVector(0, 0)) {
        this.pos = pos;
        this.vel = vel;
        this.acc = null;
        this.angle = 0;

        this.player = false;

        this.type = type;
        this.r = r;

        this.colour = 255;

        this.maxAcc = 0.8;
        this.maxVel = 7;

        this.hit = false;

        this.past = [];
        this.birthTime = -1;
        this.frameData = null;
        this.deathTime = -1;

        this.unborn = false;
    }

    superUpdate(game) {
        if (this.past.length > 0 && this.past[this.past.length - 1].time >= game.time) {
            let indexFromEnd = this.past[this.past.length - 1].time - game.time;
            let pastData = this.past[this.past.length - indexFromEnd - 1];
            this.pos.x = pastData.x;
            this.pos.y = pastData.y;
            this.angle = pastData.angle;
            this.deathTime = -1;
            return this.update(game, pastData);
        }

        if (this.birthTime < 0) this.birthTime = game.time; 
        this.acc = createVector(0, 0);
        this.frameData = { time: game.time };

        let bullets = this.update(game);

        this.acc.limit(this.maxAcc);
        this.vel.add(this.acc);

        this.vel.limit(this.maxVel);
        this.pos.add(this.vel);

        this.angle = Math.atan2(this.vel.y, this.vel.x);

        this.limitToWalls();

        this.frameData.x = this.pos.x;
        this.frameData.y = this.pos.y;
        this.frameData.angle = this.angle;

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
        // if (this.past.length == 0) {
        //     return;
        // }
        // if (game.time < this.deathTime || this.deathTime < 0) {
        //     let pastData = this.past.pop();
        //     this.pos.x = pastData.x;
        //     this.pos.y = pastData.y;
        //     this.deathTime = -1;
        // }
        if (game.time < this.birthTime) return;
        if (this.past[this.past.length - 1].time > game.time) {
            let indexFromEnd = this.past[this.past.length - 1].time - game.time;
            let pastData = this.past[this.past.length - indexFromEnd];
            this.pos.x = pastData.x;
            this.pos.y = pastData.y;
            this.deathTime = -1;
        }
    }

    toObject() {
        return {
            pos: this.pos,
            angle: this.angle,
            // vel: this.vel,
            r: this.r,
            type: this.type
        }
    }
}