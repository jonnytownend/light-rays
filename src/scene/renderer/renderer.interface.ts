import Object from "../objects/object";

interface Renderer {
    width: number
    height: number
    clear: () => void
    draw: (object: Object) => void
}

export default Renderer