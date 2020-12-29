import Vector2 from "../utils/vector2";

class Sun extends Vector2 {
    velocity: Vector2
    acceleration: Vector2
    maxSpeed: number
    dragged: boolean
    free: boolean
    doDraw: boolean
    directControl: boolean
    size: number
    color: number[]

    constructor(x: number, y: number) {
        super(x, y)
        this.velocity = new Vector2(0,0)
        this.acceleration = new Vector2(0,0)
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

        // TODO: - Handle non-global canvas
        // if (this.x > canvas.width) {
        //     this.vel.x *= -1;
        //     this.x = canvas.width;
        // }
        // else if (this.x < 0) {
        //     this.vel.x *= -1;
        //     this.x = 0;
        // }
        // if (this.y > canvas.height) {
        //     this.vel.y *= -1;
        //     this.y = canvas.height;
        // }
        // else if (this.y < 0) {
        //     this.vel.y *= -1;
        //     this.y = 0;
        // }
    }

    draw() {
        // TODO: - Handle non-global canvas
        // ctx.strokeStyle = "red";
        // ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI, false);
        // ctx.stroke();
    }
}