export default class Button {
    #x
    #y
    #width
    #height
    #color
    #inputDown
    #pressed
    #name

    constructor(canvas, x, y, width, height, color, name) {
        //this.canvas = canvas;
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#color = color;
        this.#name = name;
    }

    draw(/** @type {CanvasRenderingContext2D} */ ctx) {
        ctx.beginPath();
        ctx.rect(this.#x, this.#y, this.#width, this.#height);
        ctx.fillStyle = this.#color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.stroke();
        ctx.closePath();
    }

    mouseButton(/** @type {Event} */ event, canvas) {
        document.getElementById("test2").innerText = (event.pageX - canvas.getBoundingClientRect().left) + ", " + (event.pageY - canvas.getBoundingClientRect().top) + " ";
        if (this.containsPoint((event.pageX - canvas.getBoundingClientRect().left), (event.pageY - canvas.getBoundingClientRect().top))) {
            this.#pressed = true;
        } else {
            this.#inputDown = false;
            this.#pressed = false;
        }
    }

    touchButton( /** @type {Event} */ event, canvas) {
        const rect = canvas.getBoundingClientRect();
        let isTouching = false;
        for (let i = 0; i < event.touches.length; i++) {
            const x = event.touches[i].pageX - rect.left;
            const y = event.touches[i].pageY - rect.top;
            document.getElementById("test2").innerText = `${x}, ${y} =`;
            if (this.containsPoint(x, y)) {
                isTouching = true;
                break;
            }
        }
        if (isTouching) {
            this.#pressed = true;
            this.#inputDown = true;
        } else {
            this.#inputDown = false;
            this.#pressed = false;
        }


    }

    containsPoint(x, y) {
        if (x < this.#x || x > this.#x + this.#width || y < this.#y || y > this.#y + this.#height) {
            return false;

        }
        return true;

    }

    setColor(color) {
        this.#color = color;
    }

    setInputDown(input) {
        this.#inputDown = input;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;
    }

    getWidth() {
        return this.#width;
    }

    getHeight() {
        return this.#height;
    }

    getColor() {
        return this.#color;
    }
    getName() {
        return this.#name;
    }

    isInputDown() {
        return this.#inputDown;
    }

    isPressed() {
        return this.#pressed;
    }
    test() {
        console.log("test");
    }
}