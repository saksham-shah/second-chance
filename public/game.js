class Game {
    constructor(difficulty) {
        getElement('game difficulty').hide(true);
        setFilter(false);
        resetTutorial();

        this.entities = [];
        this.player = null;
        this.bullets = [];
        this.particles = [];

        this.player = new Player(createVector(400, 400));
        this.entities.push(this.player);

        this.ghost = null;

        this.spawnPoints = 0;
        this.timeSinceWave = 0;
        this.timeSinceEnemy = 0;
        this.counter = 0;

        switch (difficulty) {
            case 0:
                this.nextWave = 5;
                this.waveStep = 2;
                break;
            case 1:
                this.nextWave = 5;
                this.waveStep = 2;
                break;
            case 2:
                this.nextWave = 10;
                this.waveStep = 3;
                break;
            case 3:
                this.nextWave = 20;
                this.waveStep = 4;
                break;
            case 4:
                this.nextWave = 40;
                this.waveStep = 5;
                break;
            case 5:
                this.nextWave = 1000;
                this.waveStep = 100;
                break;
            default:
                this.nextWave = 3;
                this.waveStep = 1;   
        }

        if (difficulty == 0) {
            startTutorial();

            // setTimeout(() => tutorial('move', () => {
            //     setTimeout(() => tutorial('ready'), 2160);
            // }), 20);

            setTimeout(() => tutorial('move'), 20);

            // setTimeout(() => tutorial('ready', 4.5), 2160);
        }

        // switch (difficulty) {
        //     case 0:
        //         this.nextWave = 10;
        //         this.waveStep = 4;
        //         break;
        //     case 1:
        //         this.nextWave = 20;
        //         this.waveStep = 6;
        //         break;
        //     case 2:
        //         this.nextWave = 40;
        //         this.waveStep = 8;
        //         break;
        //     case 3:
        //         this.nextWave = 80;
        //         this.waveStep = 10;
        //         break;
        //     default:
        //         this.nextWave = 20;
        //         this.waveStep = 6;   
        // }

        this.playerDead = false;

        this.time = 0;
        this.rewinding = false;

        this.blur = 1;

        this.maxRewind = 120;
        this.lastRewind = 2 * this.maxRewind;

        this.score = 0;
        this.lastKill = 0;
        this.combo = 0;

        this.comboTime = 60;

        this.gameover = false;
        this.paused = false;
        this.readyToUnpause = false;

        this.stats = {
            time: 0,
            score: 0,
            combo: 0,
            rewind: 0,
            survival: 0,
            difficulty,
            newHS: false
        }
        // this.addEnemy();
    }

    update() {
        this.lastRewind++;
        // if (!this.playerDead) {
        if (!this.rewinding) {
            if (this.lastRewind > 2 * this.maxRewind) {
            // if (this.time >= this.lastRewind) {
                if (this.stats.difficulty == 0 && this.lastRewind == 3 * this.maxRewind) tutorial('ready');
                if (!this.gameover) this.updateSpawns();
                if (this.ghost) {
                    // this.ghost.hit = true;
                    this.ghost.deathTime = this.time;

                    this.particleExplosion({
                        pos: this.ghost.pos.copy(),
                        speed: 0.1,
                        speedErr: 0.1,
                        angle: 0,
                        angleErr: Math.PI * 2,
                        r: 7,
                        life: 180,
                        lifeErr: 60,
                        col: this.ghost.colour,
                        num: 20
                    });
    
                    this.particleExplosion({
                        pos: this.ghost.pos.copy(),
                        speed: 4,
                        speedErr: 2,
                        angle: 0,
                        angleErr: Math.PI * 2,
                        r: 3,
                        life: 30,
                        lifeErr: 10,
                        col: this.ghost.colour,
                        num: 20
                    });

                    this.ghost = null;

                    if (this.stats.difficulty == 0) tutorial('saved', () => tutorial('goodluck'));
                }
            }
            this.time++;
            this.updateEntitiesBullets();
            this.blur = 1;

            if (this.lastKill < this.comboTime) {
                this.lastKill++;
            } else {
                this.combo = 0;
            }
        } else {
            if (this.time > 0) this.time--;
            this.updateEntitiesBullets();

            if (this.lastRewind >= this.maxRewind - 1) {
            // if (this.time <= this.lastRewind - this.maxRewind + 1) {
                this.toggleRewind(false);
            } else if (this.lastRewind >= this.maxRewind - 20) {
            // } else if (this.time <= this.lastRewind - this.maxRewind + 20) {
                this.blur += 0.1;
            }

            this.blur -= 0.05;
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
        // for (let entity of this.entities) {
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            if (entity.deathTime >= this.time && entity.type != 'ghost') {
                // console.log('reviving', entity.type, this.time);
                entity.deathTime = -1;
                entity.hit = false;
            }
            if (entity.deathTime < 0 && entity.birthTime <= this.time) {
                if (entity.unborn && !entity.player) {
                    entity.unborn = false;
                    sounds.enemyspawn.play();
                }
                let bullets = entity.superUpdate(this);

                for (let bullet of bullets) {
                    this.bullets.push(bullet);

                    this.particleExplosion({
                        pos: bullet.pos.copy(),
                        speed: 3,
                        speedErr: 1.5,
                        angle: bullet.angle,
                        angleErr: Math.PI * 0.25,
                        r: 3,
                        life: 15,
                        lifeErr: 3,
                        col: bullet.colour,
                        num: 10
                    });
                    // console.log(bullet);
                }
            } else if (entity.birthTime > this.time) {
                if (entity.type == 'splity' && entity.stage == 1) {
                    this.entities.splice(i, 1);
                }
                entity.unborn = true;
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

                this.particleExplosion({
                    pos: bullet.pos.copy(),
                    speed: 3,
                    speedErr: 1.5,
                    angle: bullet.angle,
                    angleErr: Math.PI * 0.25,
                    r: 3,
                    life: 15,
                    lifeErr: 3,
                    col: bullet.colour,
                    num: 10
                });
                // this.bullets.splice(i, 1);

            } else if (bullet.birthTime > this.time) {
                this.bullets.splice(i, 1);
                sounds.bulletreverse.play();
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            if (particle.deathTime >= this.time) particle.deathTime = -1;
            if (particle.deathTime >= 0) {
                if (this.time - particle.deathTime > this.maxRewind) {
                    this.particles.splice(i, 1);
                }

            } else if (particle.birthTime <= this.time && particle.update(this)) {
                particle.deathTime = this.time;
                // this.bullets.splice(i, 1);

            } else if (particle.birthTime > this.time) {
                this.particles.splice(i, 1);
            }
        }

        for (let i = this.entities.length - 1; i >= 0; i--) {
            let entity = this.entities[i];
            if (entity.deathTime >= 0) {
                if (this.time - entity.deathTime > this.maxRewind || entity.type == 'ghost') {
                    this.entities.splice(i, 1);
                }

            } else if (entity.hit) {
                if (entity.type != 'ghost') {
                    entity.deathTime = this.time;

                    if (!this.gameover && entity.type == 'splity' && entity.stage == 0) {
                        let splity1 = new Splity(entity.pos.copy(), 1);
                        let splity2 = new Splity(entity.pos.copy(), 1);

                        this.entities.push(splity1);
                        this.entities.push(splity2);

                        let angleVec = p5.Vector.fromAngle(entity.hitAngle + Math.PI / 2, 25);
                        splity1.vel.add(angleVec);
                        splity2.vel.sub(angleVec);
                    }

                    this.particleExplosion({
                        pos: entity.pos.copy(),
                        speed: 0.1,
                        speedErr: 0.1,
                        angle: 0,
                        angleErr: Math.PI * 2,
                        r: 7,
                        life: 180,
                        lifeErr: 60,
                        col: entity.colour,
                        num: 20
                    });
    
                    this.particleExplosion({
                        pos: entity.pos.copy(),
                        speed: 4,
                        speedErr: 2,
                        angle: 0,
                        angleErr: Math.PI * 2,
                        r: 3,
                        life: 30,
                        lifeErr: 10,
                        col: entity.colour,
                        num: 20
                    });

                    if (entity.type != 'player' && !this.gameover) sounds.enemydeath.play();
                }

                if (!this.gameover && !entity.player && !this.rewinding && !entity.scored) {
                    entity.scored = true;
                    this.lastKill = 0;
                    this.combo++;

                    if (this.combo > this.stats.combo) this.stats.combo = this.combo;

                    let combo = this.combo;
                    if (combo > 10) combo = 10;

                    // Increase score
                    this.score += entity.scoreValue * combo;

                    if (this.score > highscore) {
                        this.stats.newHS = true;
                        highscore = this.score;
                    }
                }
                // this.entities.splice(i, 1);
            }
        }

        if (this.player.hit && !this.gameover) {
            // this.playerDead = true;
            // this.rewinding = true;
            // this.lastRewind = this.time;
            let thisSurvival = this.lastRewind - 2 * this.maxRewind;
            if (thisSurvival > this.stats.survival) this.stats.survival = thisSurvival;
            if (this.lastRewind < 3 * this.maxRewind) {
                getElement('game difficulty').hide(false);
                setFilter(true);

                this.gameover = true;
                this.stats.time = this.time;
                this.stats.score = this.score;

                if (this.stats.newHS) {
                    localStorage.setItem('highscore', this.score);
                    // highscore = this.score;
                }

                for (let entity of this.entities) {
                    entity.hit = true;
                }

            // if (this.time < this.lastRewind + this.maxRewind + 10) {
                this.particleExplosion({
                    pos: this.player.pos.copy(),
                    speed: 0.1,
                    speedErr: 0.1,
                    angle: 0,
                    angleErr: Math.PI * 2,
                    r: 7,
                    life: 300,
                    lifeErr: 150,
                    col: this.player.colour,
                    num: 20
                });

                this.particleExplosion({
                    pos: this.player.pos.copy(),
                    speed: 4,
                    speedErr: 2,
                    angle: 0,
                    angleErr: Math.PI * 2,
                    r: 3,
                    life: 30,
                    lifeErr: 10,
                    col: this.player.colour,
                    num: 20
                });

                sounds.gameover.play();

                if (this.stats.difficulty == 0) endTutorial();
                return;
            }
            this.player.hit = false;
            this.toggleRewind(true);

            sounds.rewind.play();
            // sounds.rewind2.play();
            // sounds.rewind3.play();

            // setTimeout(() => {
            //     // game = new Game();
            //     // this.rewinding = false;
            //     this.toggleRewind(false);
            // }, 5000);
        }
    }

    toggleRewind(rewind) {
        this.rewinding = rewind;
        setFilter(rewind);

        if (rewind) {
            this.lastRewind = 0;
            // this.lastRewind = this.time;
            this.combo = 0;
            this.stats.rewind++;

            if (this.stats.difficulty == 0) tutorial('rewind');
        } else {
            this.ghost = new Ghost(this.player);
            this.entities.push(this.ghost);

            if (this.stats.difficulty == 0) tutorial('ghost');
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

        let particles = [];
        for (let particle of this.particles) {
            if (particle.deathTime < 0 && particle.birthTime <= this.time) {
                particles.push(particle.toObject());
            }
        }

        if (this.blur < 0) this.blur = 0;
        if (this.blur > 1) this.blur = 1;

        return { entities, bullets, particles, 
            blurred: this.blur,
            time: this.gameover ? this.stats.time : this.time,
            score: this.gameover ? this.stats.score : this.score,
            combo: this.combo,
            lastKill: this.lastKill,
            rewind: this.lastRewind
        }
    }
}