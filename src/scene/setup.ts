import Scene from "./scene";
import Canvas2DRenderer from './renderer/canvas2d-renderer'
import startString from "./saved-stated/start";
import Fps from "./utils/fps";
import { Input } from './utils/input'
import Renderer from "./renderer/renderer.interface";

let scene: Scene
let renderer: Renderer
let fps: Fps
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

export function start(_canvas: HTMLCanvasElement, width: number, height: number) {
    const context = _canvas.getContext('2d')
    if (!context) { return }

    ctx = context
    canvas = _canvas

    setup(width, height)
    render()
}

function setup(width: number, height: number) {
    scene = new Scene(width, height)
    scene.input = new Input(canvas)
    scene.setSamples(3300);
    scene.loadString(startString)

    scene.sun.set(width / 3, height / 2.2)
    scene.sun.velocity.set(5, 0)

    renderer = new Canvas2DRenderer(ctx)
    fps = new Fps(30)

    scene.start()
}

function render() {
    window.requestAnimationFrame(render)
    scene.update()
    renderer.draw(scene)

    // TODO: - Show / hide fps on key press
    // fps.showFps(ctx)
}
