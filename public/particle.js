class Particle {
    constructor(pos, vel, r, life, col = [255, 255, 0]) {
        this.pos = pos;
        this.vel = vel;
        this.r = r;
        this.life = life;
        this.maxLife = life;
        this.col = col.slice();
        this.col.push(255);

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
            this.life = pastData.life;
            this.deathTime = -1;
            return false;
        }

        if (this.birthTime < 0) this.birthTime = game.time;

        this.pos.add(this.vel);

        this.life--;

        this.past.push({ x: this.pos.x, y: this.pos.y, life: this.life, time: game.time });
        if (this.past.length > game.maxRewind) {
            this.past.splice(0, 1);
        }

        return this.life <= 0;
    }

    toObject() {
        this.col[3] = this.life / this.maxLife * 255;
        let r = this.r * this.life / this.maxLife;
        if (r >= 10) console.error('big particle', this.life, this.maxLife);
        if (this.maxLife < 0) console.log('negative life')
        return {
            pos: this.pos,
            colour: this.col,
            r
        }
    }

    show() {
        push();
        translate(this.pos);
        fill(this.col);
        noStroke();
        ellipse(0, 0, this.r * this.life / this.maxLife * 2);
        pop();
    }
}

Game.prototype.particleExplosion = function(options) {
    for (let i = 0; i < options.num; i++) {
        let { speed, angle, life } = options;
        if (options.speedErr) {
            speed += (Math.random() - 0.5) * 2 * options.speedErr;
        }
        if (options.angleErr) {
            angle += (Math.random() - 0.5) * 2 * options.angleErr;
        }
        if (options.lifeErr) {
            life += (Math.random() - 0.5) * 2 * options.lifeErr;
        }
        if (!options.gravity) {
            options.gravity = 0;
        }

        let vel = p5.Vector.fromAngle(angle, speed);

        let p = new Particle(options.pos.copy(), vel, options.r, life, options.col);
        this.particles.push(p);
    }
}