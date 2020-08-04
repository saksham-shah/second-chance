class Enemy extends Entity {
    constructor(pos, r, type) {
        super(pos, r, type);
    }

    update(player) {
        this.moveToPlayer(player);

        return this.subUpdate(player);
    }

    subUpdate(player) {
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