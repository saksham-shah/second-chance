class Enemy extends Entity {
    constructor(pos, r, type) {
        super(pos, r, type);
    }

    update(game) {
        this.moveToPlayer(game.player);

        return this.subUpdate(game);
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
}