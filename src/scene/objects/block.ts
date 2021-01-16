import Object from "./object";
import Ray from "./ray";
import Vector2 from "../utils/vector2";

class Block extends Object {
    vector: Vector2
    flipped: boolean
    index: number

    constructor() {
        super(0, 0)
        this.vector = new Vector2(0,0)
        this.flipped = false
        this.index = 0
    }

    center() {
        return this.origin.add(this.vector.scalarMultiply(0.5))
    }

    copy() {
        const newBlock = new Block()
        newBlock.parent = this.parent
        newBlock.origin = this.origin.copy()
        newBlock.vector = this.vector.copy()
        newBlock.flipped = this.flipped
        return newBlock
    }

    checkFlipped(ray: Ray) {
        const norm = this.vector.normal()
        const angle = norm.angleBetween(ray.vector)
        if (angle > Math.PI / 2)
            return true
        else
            return false
    }

    flip() {
        this.origin = this.origin.add(this.vector)
        this.vector.rotate(Math.PI)
        this.flipped = !this.flipped
    }
}

export default Block