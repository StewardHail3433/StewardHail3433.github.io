export default class Button {
    #canvas
    #x
    #y
    #width
    #height
    #color
    #pressed

    constructor(canvas, x, y, width, height, color) {
        this.#canvas = canvas;
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.#x, this.#y, this.#width, this.#height);
        ctx.fillStyle = this.#color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.stroke();
        ctx.closePath();
    }

    touchButton(event) {
        event.preventDefault();
        target_touches = event.targetTouches;

        for (i = 0; i < target_touches.length; i++) {

            touch = target_touches[i];
            if (containsPoint((touch.clientX - this.#canvas.getBoundingClientRect().left), (touch.clientY - this.#canvas.getBoundingClientRect().top))) {
  
              pressed = true;
              break;
            }
          }
    }

    containsPoint(x, y) {
        if (x < this.#x || x > this.#x + this.#width || y < this.#y || y > this.#y + this.#width) {
  
          return false;
  
        }
  
        return true;
  
    }

    setColor(color) {
        this.#color = color
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

    isPressed() {
        return this.#pressed;
    }
    test() {
        console.log("test");
    }
}