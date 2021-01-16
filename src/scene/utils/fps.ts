class Fps {
    interval: number
    last: number
    now: number

    constructor(fps: number) {
        this.interval = 1000 / fps;
        this.last = Date.now();
        this.now = Date.now();
    }

    fps() {
        const delta = (Date.now() - this.last)/1000;
        this.last = Date.now();
        return 1/delta;
    }

    showFps(ctx: CanvasRenderingContext2D) {
        ctx.font = '20px Arial';
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,100,50);
        ctx.fillStyle = "red";
        ctx.fillText("Fps: "+parseInt(`${this.fps()}`), 10, 30);
    }
}

export default Fps