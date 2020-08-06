class Splity extends Enemy {
    constructor(pos, stage = 0) {
        super(pos, stage == 0 ? 20 : 10, 'splity');

        this.stage = stage;

        this.maxVel = stage == 0 ? 1.5 : 5;
        this.maxAcc = stage == 0 ? 0.1 : 0.5;

        this.scoreValue = stage == 0 ? 20 : 10;

        this.colour = [0, 255, 0];
    }

    subUpdate(game, pastData) {
        if (!game.rewinding) {
            if (this.isColliding(game, game.player)) {
                game.player.hit = true;
            }
        }

        // if (pastData) {
        //     this.rotation = pastData.rotation;
        //     return [];
        // }

        // this.rotation += 0.01;
        // this.frameData.rotation = this.rotation;

        return [];
    }

    // toObject() {
    //     return {
    //         pos: this.pos,
    //         angle: this.rotation,
    //         r: this.r,
    //         type: this.type
    //     }
    // }
}