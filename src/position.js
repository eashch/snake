
class Position {
    #x = 0;
    #y = 0;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    isCollided(x, y) {
        return x === this.#x 
                && y === this.#y;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }
}