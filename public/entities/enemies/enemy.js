class Enemy extends Entity {
    constructor(pos, r, type) {
        super(pos, r, type);

        this.scoreValue = 10;
        this.scored = false;
    }

    update(game, pastData) {
        if (!pastData) this.moveToPlayer(game.player);

        return this.subUpdate(game, pastData);
    }

    subUpdate(game) {
        return [];
    }

    moveToPlayer(player) {
        let des = createVector(0, 0);
        des.add(player.pos);
        des.sub(this.pos);

        this.acc.add(des);
        this.acc.sub(this.vel);
    }

    isColliding(game, player = game.player) {
        if (player.deathTime >= 0 || player.birthTime > game.time) return false;

        let diffVec = p5.Vector.sub(this.pos, player.pos);
        let dSq = diffVec.magSq();
        return dSq < Math.pow(this.r + player.r, 2);
    }
}