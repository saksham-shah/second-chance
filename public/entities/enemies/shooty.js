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

        this.scoreValue = 10;

        this.colour = [255, 0, 255];
    }

    subUpdate(game, pastData) {
        let bullets = [];

        if (!pastData) {
            this.updateEnraged();
            this.frameData.rage = this.enraged;

            if (this.cooldown > 0) this.cooldown--;
    
            if (this.cooldown == 0) bullets.push(this.shoot(game.player));

        } else {
            // if (pastData.rage !== undefined) {
                // console.log('rewind rage')
            if (!game.rewinding && !this.enraged && pastData.rage) sounds.shootyrage.play();
            // }
            this.enraged = pastData.rage;

            if (pastData.shoot != undefined && !game.rewinding) {
                sounds.enemyshoot.play();
                bullets.push(new Bullet(this.pos.copy(), 15, pastData.shoot, false, [255, 0, 255]));
                return bullets;
            }
        }

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

            sounds.shootyrage.play();
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

        this.frameData.shoot = angle;

        sounds.enemyshoot.play();

        return new Bullet(this.pos.copy(), 15, angle, false, [255, 0, 255]);
    }

    toObject() {
        return {
            pos: this.pos,
            angle: this.angle,
            r: this.r,
            type: this.type,
            enraged: this.enraged
        }
    }
}