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

        // this.addEnemy();
    }

    update() {
        let bullets;
        for (let entity of this.entities) {
            bullets = entity.superUpdate(this.player);

            for (let bullet of bullets) {
                this.bullets.push(bullet);
            }
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].update(this.entities)) {
                this.bullets.splice(i, 1);
            }
        }

        for (let i = this.entities.length - 1; i >= 0; i--) {
            if (this.entities[i].hit) {
                this.entities.splice(i, 1);
            }
        }

        this.updateSpawns();
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
            } else {
                console.log(this.timeSinceEnemy)
            }
        } else {
            this.counter -= 1;
        }
    }

    addEnemy() {
        let pos = createVector(50 + Math.random() * 800, 50 + Math.random() * 500);
        this.entities.push(new Shooty(pos));
    }

    toObject() {
        let entities = [];
        for (let entity of this.entities) {
            entities.push(entity.toObject());
        }

        let bullets = [];
        for (let bullet of this.bullets) {
            bullets.push(bullet.toObject());
        }

        return { entities, bullets }
    }
}