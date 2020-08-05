class Game {
    constructor() {
        this.entities = [];
        this.player = null;
        this.bullets = [];

        this.player = new Player(createVector(450, 300));
        this.entities.push(this.player);

        this.spawnPoints = 0;
        this.timeSinceWave = 0;
        this.timeSinceEnemy = 0;
        this.counter = 0;

        this.nextWave = 20;
        this.waveStep = 4;

        this.playerDead = false;

        this.time = 0;
        this.lastRewind = 0;
        this.rewinding = false;

        this.maxRewind = 350;

        // this.addEnemy();
    }

    update() {

        // if (!this.playerDead) {
        if (!this.rewinding) {
            if (this.time >= this.lastRewind) this.updateSpawns();
            this.updateEntitiesBullets();
            this.time++;
        } else {
            this.updateEntitiesBullets();
            if (this.time > 0) this.time--;
            // this.rewind();
        }
        // }
    }

    updateSpawns() {
        this.timeSinceEnemy++;
        this.timeSinceWave++;

        // If it has been 20 seconds since the last wave or all enemies of this wave have been killed
        if (this.timeSinceWave > 1200 || (this.spawnPoints < 1 && this.entities.length == 1)) {
            this.spawnPoints += this.nextWave;
            // Each wave gets slightly harder
            this.nextWave += this.waveStep;
            this.timeSinceWave = 0;
        }

        if (this.counter < 0) {
            this.counter = 30;
            // The more spawnPoints there are, the higher chance of an enemy spawning
            // This means whenever a new wave begins, lots of enemies suddenly spawn
            if (Math.random() < this.spawnPoints * 0.025 || this.timeSinceEnemy > 180) {
                this.spawnEnemy();
                this.timeSinceEnemy = 0;
            }
        } else {
            this.counter -= 1;
        }
    }

    updateEntitiesBullets() {
        if (this.time < 0) return;
        for (let entity of this.entities) {
            if (entity.deathTime >= this.time) {
                // console.log('reviving', entity.type, this.time);
                entity.deathTime = -1;
                entity.hit = false;
            }
            if (entity.deathTime < 0 && entity.birthTime <= this.time) {
                let bullets = entity.superUpdate(this);

                for (let bullet of bullets) {
                    this.bullets.push(bullet);
                    // console.log(bullet);
                }
            }
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let bullet = this.bullets[i];
            if (bullet.deathTime >= this.time) bullet.deathTime = -1;
            if (bullet.deathTime >= 0) {
                if (this.time - bullet.deathTime > this.maxRewind) {
                    this.bullets.splice(i, 1);
                }

            } else if (bullet.birthTime <= this.time && bullet.update(this)) {
                bullet.deathTime = this.time;
                // this.bullets.splice(i, 1);

            } else if (bullet.birthTime > this.time) {
                this.bullets.splice(i, 1);
            }
        }

        for (let i = this.entities.length - 1; i >= 0; i--) {
            let entity = this.entities[i];
            if (entity.deathTime >= 0) {
                if (this.time - entity.deathTime > this.maxRewind) {
                    this.entities.splice(i, 1);
                }

            } else if (entity.hit) {
                entity.deathTime = this.time;
                // this.entities.splice(i, 1);
            }
        }

        if (this.player.hit) {
            // this.playerDead = true;
            this.rewinding = true;
            this.lastRewind = this.time;

            setTimeout(() => {
                // game = new Game();
                this.rewinding = false;
            }, 5000);
        }
    }

    rewind() {
        if (this.time == 0) return;
        this.time--;

        for (let entity of this.entities) {
            entity.superUpdate(this)
            // entity.rewind(game);
        }

        for (let bullet of this.bullets) {
            if (bullet.deathTime >= 0 && bullet.deathTime <= this.time) continue;
            if (bullet.birthTime > this.time) continue;
            bullet.update(this);
            // bullet.rewind(game);
        }
    }

    toObject() {
        let entities = [];
        for (let entity of this.entities) {
            if (entity.deathTime < 0 && entity.birthTime <= this.time) {
                entities.push(entity.toObject());
            }
        }

        let bullets = [];
        for (let bullet of this.bullets) {
            if (bullet.deathTime < 0 && bullet.birthTime <= this.time) {
                bullets.push(bullet.toObject());
            }
        }

        return { entities, bullets }
    }
}