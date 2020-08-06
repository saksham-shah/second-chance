class Spiky extends Enemy {
    constructor(pos) {
        super(pos, 20, 'spiky');

        this.maxVel = 0;
        this.maxAcc = 0;

        this.rotation = 0;

        this.scoreValue = 15;

        this.colour = [255, 150, 0];
    }

    subUpdate(game, pastData) {
        if (!game.rewinding) {
            if (this.isColliding(game, game.player)) {
                game.player.hit = true;
            }
        }

        if (pastData) {
            this.rotation = pastData.rotation;
            return [];
        }

        this.rotation += 0.01;
        this.frameData.rotation = this.rotation;

        return [];
    }

    toObject() {
        return {
            pos: this.pos,
            angle: this.rotation,
            r: this.r,
            type: this.type
        }
    }
}