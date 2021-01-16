import Scene from "./scene";
import Canvas2DRenderer from './renderer/canvas2d-renderer'
import startString from "./saved-stated/start";
import Fps from "./utils/fps";
import { setupKeyBindings } from "./key-bindings";
import Renderer from "./renderer/renderer.interface";

let scene: Scene
let renderer: Renderer
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
    scene = new Scene(width, height);
    renderer = new Canvas2DRenderer(ctx, scene);
    scene.setSamples(4200);
    scene.secondaryBounces = 1;
    scene.shimmer = false;
    scene.loadString(startString)

    scene.castRays();
    scene.sun.velocity.set(10,2)

    fps = new Fps(0);
}

function render() {
    window.requestAnimationFrame(render)
    scene.update()
    renderer.draw()

    fps.showFps(ctx)
}
