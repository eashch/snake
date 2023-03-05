
const GameStateEnum = {
    startScreen: 0,
    pregamePause: 1,
    game: 2,
    gameOverScreen: 3
}

class GameCore {

    #gameState = GameStateEnum.startScreen;
    #gameField = null;

    #snake = null;

    #record = 0;
    #score = 0;

    #timeDeltams = null;
    #timeDeltamsInitial = 500;
    #timeDeltaSpeedUp = 0.95;
    #timeoutID = null;

    #startWindow = null;
    #gameOverWindow = null;
    #pregameTip = null;
    #inGameWindow = null;

    #scoreDisplay = null;
    #recordDisplays = null;

    constructor () {
        this.#loadRecord();
        this.#gameField = new GameField();
        
        this.#startWindow = document.querySelector(".div_start-window");
        this.#gameOverWindow = document.querySelector(".game-over");
        this.#pregameTip = document.querySelector(".text-tip");
        this.#inGameWindow = document.querySelector(".div_in-game");

        this.#scoreDisplay = document.querySelector(".score");
        this.#recordDisplays = document.querySelectorAll(".record");

        let startButton = document.querySelector(".button_start");
        startButton.addEventListener("click", (event) => {
            this.#startGame();
            event.stopPropagation();
        });

        this.#pregameTip.style.display = "none";
        const body = document.querySelector(".body");
        body.addEventListener("click", () => {
            if (this.#gameState !== GameStateEnum.pregamePause)
                return;
            this.#switchGameState(GameStateEnum.game);
            this.#snake.startMovement();
            this.#gameStep();
        });

        let restartButton = document.querySelector(".game-over__restart");
        restartButton.addEventListener("click", () => {
            this.#switchGameState(GameStateEnum.startScreen);
        });

        this.#updateRecordDisplay();
        this.#switchGameState(GameStateEnum.startScreen);
    }

    #startGame() {
        if (!this.#gameField.getDimensions())
                return;
        this.#timeDeltams = this.#timeDeltamsInitial;

        this.#score = 0;
        this.#updateScoreDisplay();
        this.#updateRecordDisplay();
        this.#gameField.createField();

        const middleCell = this.#gameField.getMiddleCell();
        this.#snake = new Snake(this.#gameField,
                                middleCell.getX(), 
                                middleCell.getY(),
                                this.finishGame.bind(this),
                                this.onAppleCollide.bind(this));
        this.#gameField.rollNewApple(this.#snake);
        this.#switchGameState(GameStateEnum.pregamePause);
    }

    #gameStep() {
        this.#timeoutID = setTimeout(() => {
            if (this.#gameState !== GameStateEnum.game)
                return;
            this.#snake.makeMove();
            this.#snake.draw();
            this.#gameStep();
        }, this.#timeDeltams);
    }

    #loadRecord() {
        const recordSaved = localStorage.getItem("record");
        if (recordSaved != null)
            this.#record = recordSaved;
    }

    #isNewRecord() {
        if (this.#record >= this.#score)
            return false;
        this.#record = this.#score;
        localStorage.setItem("record", this.#record);
        return true;
    }

    finishGame() {
        clearTimeout(this.#timeoutID);
        this.#switchGameState(GameStateEnum.gameOverScreen);
        this.#gameField.clearField();
        this.#snake.stopMovement();
        const scoreItem = document.querySelector(".game-over__score");

        const isNewRecord = this.#isNewRecord();
        const isBlinking = scoreItem.classList.contains("blink");
        scoreItem.innerHTML = `${this.#score}${isNewRecord
                                        ? " (New record!)" : ""}`;
        if (isBlinking && !isNewRecord)
            scoreItem.classList.remove("blink");
        
        if (!isBlinking && isNewRecord)
            scoreItem.classList.add("blink");
        this.#updateRecordDisplay();
    }

    onAppleCollide () {
        this.#score++;
        this.#updateScoreDisplay();
        const applePlaced = this.#gameField.rollNewApple(this.#snake);
        if (!applePlaced) {
            this.finishGame();
        }
        this.#timeDeltams *= this.#timeDeltaSpeedUp;
    }

    #updateScoreDisplay() {
        this.#scoreDisplay.innerHTML = `${this.#score}`;
    }

    #updateRecordDisplay() {
        for (let item of this.#recordDisplays)
            item.innerHTML = `${this.#record}`;
    }

    #switchGameState (newState) {
        const setVisible = (item, isVisible, 
                            displayVisible = "flex") => {
            item.style.display = isVisible 
                                ? displayVisible : "none";            
        }

        setVisible(this.#startWindow, 
            newState === GameStateEnum.startScreen);
        setVisible(this.#gameOverWindow, 
            newState === GameStateEnum.gameOverScreen);

        setVisible(this.#pregameTip, 
            newState === GameStateEnum.game 
                                        || newState === GameStateEnum.pregamePause);
        this.#pregameTip.style.opacity = newState === GameStateEnum.pregamePause ? 1 : 0;
        setVisible(this.#inGameWindow,
            newState === GameStateEnum.game 
                                        || newState === GameStateEnum.pregamePause);
        this.#gameField.setFieldVisible(newState === GameStateEnum.game 
                                        || newState === GameStateEnum.pregamePause);

        this.#gameState = newState;
    };
}