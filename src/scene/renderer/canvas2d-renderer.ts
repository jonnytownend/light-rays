import Block from "../objects/block";
import Renderer from "./renderer.interface";
import Ray from "../objects/ray";
import Sun from "../objects/sun";
import Scene from '../scene'

class Canvas2DRenderer implements Renderer {
    ctx: CanvasRenderingContext2D
    scene: Scene
    drawWireframe: boolean = false

    constructor(context: CanvasRenderingContext2D, scene: Scene) {
        this.ctx = context
        this.scene = scene
    }

    clear() {
        this.ctx.strokeStyle = 'rgb(255,0,0)'
        this.ctx.fillRect(0, 0, this.scene.width, this.scene.height)
    }

    draw() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        this.ctx.fillRect(0, 0, this.scene.width, this.scene.height);
        this.scene.getObjects().forEach(object => {
            if (object instanceof Ray) {
                this.drawRay(object)
            } else if (object instanceof Block && this.drawWireframe) {
                this.drawBlock(object)
            } else if (object instanceof Sun && this.drawWireframe) {
                this.drawSun(object)
            }
        })
    }

    private drawBlock(block: Block) {
        const ctx = this.ctx
        ctx.strokeStyle = 'red'
        block.vector.drawFrom(ctx, block.origin.x, block.origin.y)
        let norm = block.vector.normal()
        norm.scale(50)
        norm.drawFrom(
            ctx,
            block.origin.x + block.vector.x/2,
            block.origin.y + block.vector.y/2
        )
    }

    private drawRay(ray: Ray) {
        const alpha = 0.02
        if (ray.diffuse) {
            const col1 = 'rgba('+ray.color[0]+','+ray.color[1]+','+ray.color[2]+','+alpha+')'
            const col2 = 'rgba('+ray.color[0]+','+ray.color[1]+','+ray.color[2]+',0)'
            const grad = this.ctx.createLinearGradient(
                ray.origin.x,
                ray.origin.y,
                ray.origin.x + ray.vector.x,
                ray.origin.y + ray.vector.y,
            )
            grad.addColorStop(0, col1)
            grad.addColorStop(1, col2)
            this.ctx.lineWidth = 1
            this.ctx.strokeStyle = grad
        }
        else {
            const col = 'rgba('+ray.color[0]+','+ray.color[1]+','+ray.color[2]+','+alpha+')'

            this.ctx.lineWidth = 1.5
            this.ctx.strokeStyle = col
        }
        ray.vector.drawFrom(this.ctx, ray.origin.x, ray.origin.y)
    }

    private drawSun(sun: Sun) {
        const ctx = this.ctx
        ctx.strokeStyle = "red";
        ctx.arc(sun.x, sun.y, sun.size, 0, 2*Math.PI, false);
        ctx.stroke();
    }
}

export default Canvas2DRenderer