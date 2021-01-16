import Object from "./object";
import Vector2 from "../utils/vector2";

class Ray extends Object {
    vector: Vector2
    color: number[]
    diffuse: boolean

    constructor() {
        super(0, 0)
        this.origin = new Vector2(0, 0)
        this.vector = new Vector2(0,0)
        this.color = [255,255,255]
        this.diffuse = false
    }

    setRaySize(size: number) {
        this.vector = new Vector2(size,0)
    }

    copy() {
        const newRay = new Ray()
        newRay.parent = this.parent
        newRay.color = this.color
        newRay.origin.set(this.origin.x, this.origin.y)
        newRay.vector.set(this.vector.x, this.vector.y)
        return newRay
    }
}

export default Ray