class Ghost extends Entity {
    constructor(player) {
        super(player.pos.copy(), player.r, 'ghost');

        this.fireRate = player.fireRate;

        this.player = true;

        this.cooldown = player.cooldown;

        this.colour = [0, 255, 255];
    }

    update(game, pastData) {
        let bullets = [];

        // if (pastData) {
        //     this.mouseAngle = pastData.mouseAngle;
        //     if (pastData.shoot != undefined && !game.rewinding) {
        //         let pos = this.pos.copy();
        //         pos.add(p5.Vector.fromAngle(this.mouseAngle), 15);

        //         bullets.push(new Bullet(pos, 15, this.mouseAngle));
        //     }
        //     return bullets;
        // }

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
        let dx = mousePos.x - 400 - this.pos.x;
        let dy = mousePos.y - 50 - this.pos.y;

        this.mouseAngle = Math.atan2(dy, dx);

        this.frameData.mouseAngle = this.mouseAngle;
    }

    shoot() {
        this.frameData.shoot = this.mouseAngle;
        this.cooldown = this.fireRate;

        let pos = this.pos.copy();
        pos.add(p5.Vector.fromAngle(this.mouseAngle), 15);

        sounds.playershoot.play();

        return new Bullet(pos, 15, this.mouseAngle, true, [0, 255, 255]);
    }

    toObject() {
        return {
            pos: this.pos,
            angle: this.mouseAngle,
            r: this.r,
            type: this.type
        }
    }
}