var spawns;

function Spawn(reqPoints_, reqScore_, doFunction_) {
    this.reqPoints = reqPoints_;
    this.reqScore = reqScore_;
    this.doFunction = doFunction_;

    this.randScore = 0;
}

function createSpawns() {
    spawns = [
        // Shooty Enemy
        new Spawn(1, 0,
            function(game) {
                let pos = createVector(50 + Math.random() * 800, 50 + Math.random() * 500);
                game.entities.push(new Shooty(pos));
            }
        )
    ]
}

createSpawns();

// Selects an enemy to spawn
// The harder the enemy, the more spawnPoints it uses up and the rarer it is
// Therefore no matter what enemies the player faces, the difficulty will always be the same
Game.prototype.spawnEnemy = function() {
    var possible = [];
    var highest = 0;
    for (var i = 0; i < spawns.length; i++) {
        // if (this.score >= spawns[i].reqScore && this.spawnPoints >= spawns[i].reqPoints) {
        if (this.spawnPoints >= spawns[i].reqPoints) {
            possible.push(spawns[i]);
            if (spawns[i].reqPoints > highest) {
                highest = spawns[i].reqPoints;
            }
        }
    }

    var total = 0;

    for (var i = 0; i < possible.length; i++) {
        possible[i].randScore = highest / possible[i].reqPoints;
        total += possible[i].randScore;
    }

    var randomNum = Math.random() * total;
    var currentTotal = 0;
    for (var i = 0; i < possible.length; i++) {
        currentTotal += possible[i].randScore;
        if (currentTotal > randomNum) {
            possible[i].doFunction(this);
            this.spawnPoints -= possible[i].reqPoints;
            return possible[i];
        }
    }
}
