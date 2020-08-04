class Shooty extends Enemy {
    constructor(pos) {
        super(pos, 10, 'shooty');

        this.maxVel = 3;
        this.maxAcc = 0.2;

        this.enraged = false;
        this.timeSinceEnraged = 0;
        this.enragedTime = 0;
        this.enrangedMax = 30;

        this.fireRate = 40;

        this.cooldown = 60;
    }

    subUpdate(game) {
        let bullets = [];

        this.updateEnraged();

        if (this.cooldown > 0) this.cooldown--;

        if (this.cooldown == 0) bullets.push(this.shoot(game.player));

        return bullets;
    }

    updateEnraged() {
        if (this.enraged) {
            this.enragedTime++;

            if (this.enragedTime > this.enrangedMax) {
                this.enraged = false;
                this.timeSinceEnraged = 0;
                this.enragedTime = 0;
                this.rageUpdate();
            }
            return;
        }

        this.timeSinceEnraged++;

        if (Math.random() < this.timeSinceEnraged / 600 / 100) {
            this.enraged = true;
            this.rageUpdate();
            return;
        }
    }

    rageUpdate() {
        if (this.enraged) {
            this.cooldown = 0;
            this.fireRate = 10;
            this.maxVel = 5;
            this.maxAcc = 0.5;
        } else {
            this.fireRate = 40;
            this.maxVel = 3;
            this.maxAcc = 0.2;
        }
    }

    shoot(player) {
        this.cooldown = this.fireRate;

        let diff = p5.Vector.sub(player.pos, this.pos);

        if (this.enraged) {
            let t = diff.mag() / 15;
            diff.add(p5.Vector.mult(player.vel, t));
        }

        let angle = Math.atan2(diff.y, diff.x);

        return new Bullet(this.pos.copy(), 15, angle, false);
    }
}