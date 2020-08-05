class Player extends Entity {
    constructor(pos) {
        super(pos, 10, 'player');

        this.fireRate = 10;

        this.player = true;

        this.cooldown = 0;
    }

    update(game, pastData) {
        let bullets = [];

        if (pastData) {
            this.angle = pastData.angle;
            if (pastData.shoot != undefined && !game.rewinding) {
                let pos = this.pos.copy();
                pos.add(p5.Vector.fromAngle(this.angle), 15);

                bullets.push(new Bullet(pos, 15, this.angle));
            }
            return bullets;
        }

        this.move();
        this.aimToMouse();

        if (this.cooldown > 0) this.cooldown--;


        if (mouseIsPressed && this.cooldown == 0) bullets.push(this.shoot());

        return bullets;
    }

    move() {
        let des = createVector(0, 0);

        if (keyIsDown(87)) { // w
            des.y -= this.maxVel;
        }

        if (keyIsDown(83)) { // s
            des.y += this.maxVel;
        }

        if (keyIsDown(65)) { // a
            des.x -= this.maxVel;
        }

        if (keyIsDown(68)) { // d
            des.x += this.maxVel;
        }

        des.normalize();
        des.mult(this.maxVel);

        this.acc.add(des);
        this.acc.sub(this.vel);
    }

    aimToMouse() {
        let mousePos = getScreen('game').mousePos;
        let dx = mousePos.x - this.pos.x;
        let dy = mousePos.y - this.pos.y;

        this.angle = Math.atan2(dy, dx);

        this.frameData.angle = this.angle;
    }

    shoot() {
        this.frameData.shoot = this.angle;
        this.cooldown = this.fireRate;

        let pos = this.pos.copy();
        pos.add(p5.Vector.fromAngle(this.angle), 15);

        return new Bullet(pos, 15, this.angle);
    }

    rewind(game) {
        // if (this.past.length == 0) {
        //     return;
        // }
        // if (game.time < this.deathTime || this.deathTime < 0) {
        //     let pastData = this.past.pop();
        //     this.pos.x = pastData.x;
        //     this.pos.y = pastData.y;
        //     this.angle = pastData.angle;
        //     this.deathTime = -1;
        // }
        if (game.time < this.birthTime) return;
        if (this.past[this.past.length - 1].time > game.time) {
            let indexFromEnd = this.past[this.past.length - 1].time - game.time;
            let pastData = this.past[this.past.length - indexFromEnd];
            this.pos.x = pastData.x;
            this.pos.y = pastData.y;
            this.angle = pastData.angle;
            this.deathTime = -1;
        }
    }

    toObject() {
        return {
            pos: this.pos,
            angle: this.angle,
            r: this.r,
            type: this.type
        }
    }
}