import Scene from "../scene";
import Vector2 from "../utils/vector2";

class SceneObject extends Vector2 {
    parent: Scene | null = null
    origin: Vector2 = new Vector2(0, 0)
    velocity: Vector2 = new Vector2(0, 0)
    acceleration: Vector2 = new Vector2(0, 0)
}

export default SceneObject