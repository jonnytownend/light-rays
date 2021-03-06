class Vector2 {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    lenSq() {
        return (this.x * this.x) + (this.y * this.y)
    }

    len() {
        return Math.sqrt( this.lenSq() )
    }

    add( vector: Vector2 ) {
        const x = this.x + vector.x
        const y = this.y + vector.y

        return new Vector2(x, y)
    }

    subtract( vector: Vector2 ) {
        const x = this.x - vector.x
        const y = this.y - vector.y

        return new Vector2(x, y)
    }

    scalarMultiply( scalar: number ) {
        const x = this.x * scalar
        const y = this.y * scalar

        return new Vector2(x, y)
    }

    scale( scale: number ) {
        const len = this.len()
        this.x *= scale / len
        this.y *= scale / len

    }

    rotate( angle: number ) {
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
        const y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
        this.x = x
        this.y = y
    }

    dot( vector: Vector2 ) {
        return this.x * vector.x + this.y * vector.y
    }

    angleBetween( vector: Vector2 ): number {
        const dot = this.dot( vector )
        const multiply = this.len() * vector.len()
        if (multiply == 0) {
            return 0
        }
        else {
            const costheta = dot / multiply
            return Math.acos( costheta )
        }
    }

    normal() {
        return new Vector2(this.y, -this.x)
    }

    set(x: number, y: number) {
        this.x = x
        this.y = y
    }

    copy() {
        return new Vector2(this.x, this.y)
    }

    drawFrom(context: CanvasRenderingContext2D, x: number, y: number) {
        context.beginPath()
        context.moveTo( x, y )
        context.lineTo( x + this.x, y + this.y )
        context.stroke()
        context.closePath()
    }
}

export default Vector2