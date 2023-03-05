
class Cell extends Position {
    #domItem = null;
    #className = null;
    
    constructor (x, y, parentInDOM) {
        super(x, y);
        this.#domItem = document.createElement("div");
        this.#domItem.classList.add("cell");
        parentInDOM.appendChild(this.#domItem);
    }

    getDOMItem () {
        return this.#domItem;
    }

    addClass(className) {
        if (className === this.#className)
            return;
        this.clearClass();
        this.#domItem.classList.add(className);
        this.#className = className;
    }

    clearClass() {
        if (this.#className !== null) {
            this.#domItem.classList.remove(this.#className);
            this.#className = null;
        }
    }

    clearExactClass(className) {
        this.#domItem.classList.remove(className);
    }

    rotateImage(degrees) {
        this.#domItem.style.transform = `rotate(${degrees}deg)`;
    }

};