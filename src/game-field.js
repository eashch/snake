
class GameField {
    #container = null;
    #cellsArray = [];

    #fieldWidth = 10;
    #fieldHeight = 10;
    #fieldDimensionMin = 3;
    #fieldDimensionMax = 20;

    #inputWidth = null;
    #inputHeight = null;

    #apple = null;

    constructor() {
        this.#container = document.querySelector(".div_game-field");
        this.#initInputs();
    }

    #initInputs() {
        this.#inputWidth = document.querySelector(".input_width");
        this.#inputHeight = document.querySelector(".input_height");
        const widthSaved = localStorage.getItem("width");
        if (widthSaved != null)
            this.#fieldWidth = widthSaved;
        const heightSaved = localStorage.getItem("height");
        if (heightSaved != null)
            this.#fieldHeight = heightSaved;
        const setInputParams = (input, value) => {
            input.value = value;
            input["min"] = this.#fieldDimensionMin;
            input["max"] = this.#fieldDimensionMax;
            input.addEventListener("focusout", () => {
                input.value = Math.min(Math.max(input.value, input["min"]), 
                                        input["max"]);
            });
        }
        setInputParams(this.#inputWidth, this.#fieldWidth);
        setInputParams(this.#inputHeight, this.#fieldHeight);      
    }

    createField() {
        this.clearField();
        this.setFieldVisible(true);
        this.saveDimensions();
        this.#container.style.gridTemplateColumns 
                = `30px `.repeat(this.#fieldWidth);
        
        for (let i = 0; i < this.#fieldHeight; i++) {
            let row = [];
            for (let j = 0; j < this.#fieldWidth; j++) {
                const cell = new Cell(j, i, this.#container);
                row.push(cell);
            }
            this.#cellsArray.push(row);
        }        
    }

    clearField() {
        this.#cellsArray = [];
        this.#container.innerHTML = "";
        this.setFieldVisible(false);
    }

    getCell(x, y) {
        return this.#cellsArray[y][x];
    }

    getContainerDOM() {
        return this.#container;
    }

    getDimensions() {
        const width = parseInt(this.#inputWidth.value);
        const height = parseInt(this.#inputHeight.value);

        const isValid = (dim) => !isNaN(dim) 
                                && dim >= this.#fieldDimensionMin 
                                && dim <= this.#fieldDimensionMax;
        if (isValid(width) && isValid(height)) {
            this.#fieldWidth = width;
            this.#fieldHeight = height;
            return true;
        }
        return false;
    }

    saveDimensions() {
        localStorage.setItem("width", this.#fieldWidth);
        localStorage.setItem("height", this.#fieldHeight);
    }

    getMiddleCell() {
        return this.#cellsArray[Math.floor(this.#fieldHeight / 2)][Math.floor(this.#fieldWidth / 2)];
    }

    isCollidedWithBorder(x, y) {
        const isOutOfRange = (val, max) => (val < 0 || val > max - 1);
        return (isOutOfRange(x, this.#fieldWidth) 
                || isOutOfRange(y, this.#fieldHeight));
    }

    isCollidedWithApple(x, y) {
        if (this.#apple === null)
            return false;
        return this.#apple.getX() === x 
                && this.#apple.getY() === y;
    }

    rollNewApple (snake) {
        if (snake.getLength() == (this.#fieldWidth 
                * this.#fieldHeight))
            return false;
        if (this.#apple !== null)
            this.#apple.clearExactClass("cell_apple");
        while (true) {
            const x = Math.floor(Math.random() * this.#fieldWidth);
            const y = Math.floor(Math.random() * this.#fieldHeight);

            if (!snake.isCollided(x, y)) {
                this.#cellsArray[y][x].addClass("cell_apple");
                this.#apple = this.#cellsArray[y][x];
                return true;
            }
        }
    }

    setFieldVisible(isVisible) {
        this.#container.style.display = isVisible ? "grid" : "none";
    }
};