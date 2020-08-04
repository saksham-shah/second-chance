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
    }

    superUpdate(player) {
        this.acc = createVector(0, 0);

        let bullets = this.update(player);

        this.acc.limit(this.maxAcc);
        this.vel.add(this.acc);

        this.vel.limit(this.maxVel);
        this.pos.add(this.vel);

        this.limitToWalls();

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