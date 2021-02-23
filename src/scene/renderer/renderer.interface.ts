import Scene from "../scene";

interface Renderer {
    draw: (scene: Scene) => void
}

export default Renderer