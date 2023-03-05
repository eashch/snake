
const Direction = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
};

const SnakePartsCSSClasses = {
    head: "snake_head",
    body: "snake_body",
    tail: "snake_tail"
};

class SnakeSegment extends Position {
    #direction = null;
    #cell = null;

    constructor(x, y, direction, 
                cellObj, partOfSnake = SnakePartsCSSClasses.head) {
        super(x, y);
        this.#direction = direction;
        this.#cell = cellObj;
        this.setPartOfSnake(partOfSnake);
    }

    setPartOfSnake(partOfSnake) {
        this.#cell.addClass(partOfSnake);
    }
    
    clearCell() {
        this.#cell.clearClass();
    }

    rotateByDirection() {
        this.#cell.rotateImage(this.#direction * 90);
    }
}

class Snake {
    #segmentsArray = [];
    #headTowards = Direction.up;
    #gameField = null;
    #lockedTillNextStep = false;
    #onCollideWithBorder = null;
    #onCollideWithApple = null;

    constructor (gameField, x, y, 
                    onCollideWithBorder, 
                    onCollideWithApple) {
        this.#gameField = gameField;
        this.#onCollideWithBorder = onCollideWithBorder;
        this.#onCollideWithApple = onCollideWithApple;

        this.#segmentsArray.push(new SnakeSegment(x, y, Direction.up, 
                                            this.#gameField.getCell(x, y)));
        this.#segmentsArray.push(new SnakeSegment(x, y + 1, Direction.up, 
                                            this.#gameField.getCell(x, y + 1), 
                                            SnakePartsCSSClasses.tail));
    }

    startMovement() {
        document.querySelector(".body").addEventListener("keydown", 
                                    this.inputControl.bind(this));
        
    }

    stopMovement() {
        document.querySelector(".body").removeEventListener("keydown", 
                                    this.inputControl);
    }

    inputControl(event) {
        if (this.#lockedTillNextStep)
            return;

        const availableDirections = [(this.#headTowards + 1) % 4, 
                                        (this.#headTowards + 3) % 4];
        const keyCheck = (code, avalilableDir, dirToCheck, char, altChar) => {
            const isPressed = avalilableDir === dirToCheck 
                    && (code === char || code === altChar);
            if (isPressed)
                this.#headTowards = dirToCheck;
            this.#lockedTillNextStep = true;
        }
        const code = event.code;
        for (let dir of availableDirections) {
            keyCheck(code, dir, Direction.up, 'KeyW', 'ArrowUp');
            keyCheck(code, dir, Direction.right, 'KeyD', 'ArrowRight');
            keyCheck(code, dir, Direction.down, 'KeyS', 'ArrowDown');
            keyCheck(code, dir, Direction.left, 'KeyA', 'ArrowLeft');
        }
    }

    isCollided(x, y) {
        return this.#segmentsArray.find(item => item.isCollided(x, y)) 
                !== undefined;
    }

    getLength() {
        return this.#segmentsArray.length;
    }

    makeMove() {
        this.#lockedTillNextStep = false;
        let headX = this.#segmentsArray[0].getX();
        let headY = this.#segmentsArray[0].getY();

        switch(this.#headTowards) {
            case Direction.up:
                headY--;
                break;
            case Direction.right:
                headX++;
                break;
            case Direction.down:
                headY++;
                break;
            case Direction.left:
                headX--;
                break;
        };

        const createNewHead = () => {
            this.#segmentsArray.unshift(new SnakeSegment(headX, 
                headY, 
                this.#headTowards, 
                this.#gameField.getCell(headX, headY)));
        };

        if (this.isCollided(headX, headY) 
                || this.#gameField.isCollidedWithBorder(headX, headY)) {
            this.#onCollideWithBorder();
        } else if (this.#gameField.isCollidedWithApple(headX, headY)) {
            createNewHead();
            this.#onCollideWithApple();
        } else {
            const previousTail = this.#segmentsArray.pop();
            previousTail.clearCell();
            createNewHead();
        }
        for (let segment of this.#segmentsArray) {
            segment.rotateByDirection();
        }
    }

    draw() {
        const length = this.#segmentsArray.length;
        if (length > 2)
            this.#segmentsArray[1].setPartOfSnake(
                        SnakePartsCSSClasses.body);
        this.#segmentsArray[length - 1].setPartOfSnake(
                        SnakePartsCSSClasses.tail);
    }
};