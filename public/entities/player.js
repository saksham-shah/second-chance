class Player extends Entity {
    constructor(pos) {
        super(pos, 10, 'player');

        this.fireRate = 10;

        this.cooldown = 0;
    }

    update(game) {
        this.move();
        this.aimToMouse();

        if (this.cooldown > 0) this.cooldown--;

        let bullets = [];

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
    }

    shoot() {
        this.cooldown = this.fireRate;

        let pos = this.pos.copy();
        pos.add(p5.Vector.fromAngle(this.angle), 15);

        return new Bullet(pos, 15, this.angle);
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