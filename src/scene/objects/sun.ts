import Object from "./object";

class Sun extends Object {
    maxSpeed: number
    dragged: boolean
    free: boolean
    doDraw: boolean
    directControl: boolean
    size: number
    color: number[]

    constructor(x: number, y: number) {
        super(x, y)
        this.maxSpeed = 7
        this.dragged = false
        this.free = true
        this.doDraw = false
        this.directControl = true
        this.size = 60
        this.color = [255,255,255]
    }

    speedUp() {
        return 3
    }

    speedDown() {
        if (this.free)
            return 0.99
        else
            return 0.9
    }

    handleInput() {
        const input = this.parent?.input
        if (!input) { return }

        if (this.directControl && (input.vertical !== 0 || input.horizontal !== 0)) {
            this.acceleration.set(0, 0)
            this.velocity.set(0, 0)
            this.x += input.horizontal * this.maxSpeed;
            this.y += input.vertical * this.maxSpeed;
        } else {
            this.acceleration.set(0,0);
            this.acceleration.x = input.horizontal * this.speedUp();
            this.acceleration.y = input.vertical * this.speedUp();
        }

        // Dragging
        if (!input.isMouseDown) {
            this.dragged = false
            return
        }

        if (
            input.isMouseDown &&
            !this.dragged &&
            input.mouse.x < this.x + this.size &&
            input.mouse.x > this.x - this.size &&
            input.mouse.y < this.y + this.size &&
            input.mouse.y > this.y - this.size
        ) {
            this.dragged = true
        }

        if (this.dragged) {
            this.set(input.mouse.x, input.mouse.y)
            this.velocity.set(
                (input.mouse.x - input.prevMouse.x),
                (input.mouse.y - input.prevMouse.y),
            )
        }
    }

    update() {
        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y

        this.x += this.velocity.x
        this.y += this.velocity.y

        const input = this.parent?.input
        if (input && input.vertical === 0 && input.horizontal === 0) {
            this.velocity.x *= this.speedDown()
            this.velocity.y *= this.speedDown()
        }

        if (!this.parent) {
            return
        }
        if (this.x > this.parent.width) {
            this.velocity.x *= -1;
            this.x = this.parent.width;
        } else if (this.x < 0) {
            this.velocity.x *= -1;
            this.x = 0;
        }
        if (this.y > this.parent.height) {
            this.velocity.y *= -1;
            this.y = this.parent.height;
        } else if (this.y < 0) {
            this.velocity.y *= -1;
            this.y = 0;
        }
    }
}

export default Sun