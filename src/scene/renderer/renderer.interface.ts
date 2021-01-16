import Object from "../objects/object";

interface Renderer {
    clear: () => void
    draw: () => void
}

export default Renderer