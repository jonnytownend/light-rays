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
        this.free = false
        this.doDraw = false
        this.directControl = false
        this.size = 20
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

    getInput() {
        // TODO: - Handle user input that isn't global
        // if (this.directControl) {
        //     this.x += inpt.x * this.maxSpeed;
        //     this.y += inpt.y * this.maxSpeed;
        //     return;
        // }
        //
        // this.acc.set(0,0);
        // this.acc.x = inpt.x*this.speedUp();
        // this.acc.y = inpt.y*this.speedUp();
    }

    update() {
        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y

        if (!this.free && this.velocity.len() > this.maxSpeed)
            this.velocity.scale(this.maxSpeed)
        else if (this.free && this.velocity.len() > this.maxSpeed * 10)
            this.velocity.scale(this.maxSpeed * 5)

        this.x += this.velocity.x
        this.y += this.velocity.y

        // TODO: - Handle user input that isn't global
        // if (inpt.x==0 && inpt.y==0) {
        //     this.vel.x *= this.speedDown();
        //     this.vel.y *= this.speedDown();
        // }

        if (!this.parent) {
            return
        }
        if (this.x > this.parent.renderer.width) {
            this.velocity.x *= -1;
            this.x = this.parent.renderer.width;
        } else if (this.x < 0) {
            this.velocity.x *= -1;
            this.x = 0;
        }
        if (this.y > this.parent.renderer.height) {
            this.velocity.y *= -1;
            this.y = this.parent.renderer.height;
        } else if (this.y < 0) {
            this.velocity.y *= -1;
            this.y = 0;
        }
    }
}

export default Sun