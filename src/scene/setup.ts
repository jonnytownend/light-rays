import Scene from "./scene";
import Canvas2DRenderer from './renderer/canvas2d-renderer'
import startString from "./saved-stated/start";
import Fps from "./utils/fps";
import { setupKeyBindings } from "./key-bindings";

let scene: Scene
let fps: Fps
let ctx: CanvasRenderingContext2D

export function start(canvas: HTMLCanvasElement, width: number, height: number) {
    const context = canvas.getContext('2d')
    if (!context) { return }

    ctx = context
    setup(width, height)
    setupKeyBindings(canvas, scene)
    render()
}

function setup(width: number, height: number) {
    const renderer = new Canvas2DRenderer(ctx, width, height)
    scene = new Scene(renderer);
    scene.setSamples(4200);
    scene.secondaryBounces = 2;
    scene.shimmer = false;
    scene.loadString(startString)

    scene.castRays();
    scene.sun.velocity.set(10,2)

    fps = new Fps(0);
}

function render() {
    window.requestAnimationFrame(render)
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, scene.renderer.width, scene.renderer.height);
    scene.update()
    scene.draw()

    fps.showFps(ctx)
}
