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
                let pos, distFromPlayerSq;
                let attempts = 0;
                do {
                    attempts++;
                    pos = createVector(50 + Math.random() * 700, 50 + Math.random() * 700);
                    distFromPlayerSq = p5.Vector.sub(pos, game.player.pos).magSq();
                } while (distFromPlayerSq < 15000 && attempts < 20)
                game.entities.push(new Shooty(pos));
            }
        ),
        // Spiky Enemy
        new Spawn(1, 50,
            function(game) {
                let pos, distFromPlayerSq;
                let attempts = 0;
                do {
                    attempts++;
                    pos = game.player.pos.copy();
                    pos.add(p5.Vector.mult(game.player.vel, 20));
                    pos.x += Math.random() * 250 - 125;
                    pos.y += Math.random() * 250 - 125;
                    if (pos.x < 15) pos.x = 15;
                    if (pos.y < 15) pos.y = 15;
                    if (pos.x > 785) pos.x = 785;
                    if (pos.y > 785) pos.y = 785;

                    distFromPlayerSq = p5.Vector.sub(pos, game.player.pos).magSq();
                } while (distFromPlayerSq < 15000 && attempts < 20)

                if (distFromPlayerSq < 15000) {
                    attempts = 0;
                    do {
                        attempts++;
                        pos = createVector(50 + Math.random() * 700, 50 + Math.random() * 700);
                        distFromPlayerSq = p5.Vector.sub(pos, game.player.pos).magSq();
                    } while (distFromPlayerSq < 15000 && attempts < 20)
                }
                game.entities.push(new Spiky(pos));
            }
        ),
        // Splity Enemy
        new Spawn(3, 200,
            function(game) {
                let pos, distFromPlayerSq;
                let attempts = 0;
                do {
                    attempts++;
                    pos = createVector(50 + Math.random() * 700, 50 + Math.random() * 700);
                    distFromPlayerSq = p5.Vector.sub(pos, game.player.pos).magSq();
                } while (distFromPlayerSq < 40000 && attempts < 20)
                game.entities.push(new Splity(pos));
            }
        ),
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
        if (this.score >= spawns[i].reqScore && this.spawnPoints >= spawns[i].reqPoints) {
        // if (this.spawnPoints >= spawns[i].reqPoints) {
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
