interface Mouse {
  x: number
  y: number
}

export class Input {
  horizontal: number = 0
  vertical: number = 0
  mouse: Mouse = {x: 0, y: 0}
  prevMouse: Mouse = {x: 0, y: 0}
  deltaMouse: Mouse = {x: 0, y: 0}
  isMouseDown: boolean = false

  private element: HTMLElement
  private keyPressCallback?: (e: any) => void

  constructor(element: HTMLElement) {
    this.element = element
    element.addEventListener("mousedown", this.onMouseDown.bind(this), false)
    element.addEventListener("mouseup", this.onMouseUp.bind(this), false)
    element.addEventListener("mousemove", this.onMouseMove.bind(this), false)
    window.addEventListener("keydown", this.onKeyDown.bind(this), false)
    window.addEventListener("keyup", this.onKeyUp.bind(this), false)
    window.addEventListener("keypress", this.onKeyPress.bind(this), false)
  }

  observeKeyPress(callback: (e: any) => void) {
    this.keyPressCallback = callback
  }

  private onMouseDown() {
    this.isMouseDown = true
  }

  private onMouseUp() {
    this.isMouseDown = false
  }

  private onMouseMove(e: any) {
    const rect = this.element.getBoundingClientRect()
    this.prevMouse.x = this.mouse.x
    this.prevMouse.y = this.mouse.y
    this.mouse.x = e.pageX - rect.x
    this.mouse.y = e.pageY - rect.y
    this.deltaMouse.x = this.mouse.x - this.prevMouse.x
    this.deltaMouse.y = this.mouse.y - this.prevMouse.y
  }

  private onKeyDown(e: any) {
    if (e.keyCode === 38) //Up
      this.vertical = -1
    else if (e.keyCode === 40) //Down
      this.vertical = 1
    else if (e.keyCode === 37) //Left
      this.horizontal = -1
    else if (e.keyCode === 39) //Right
      this.horizontal = 1
  }

  private onKeyUp(e: any) {
    if (e.keyCode == 38 || e.keyCode == 40) // Up or down
      this.vertical = 0
    else if (e.keyCode == 37 || e.keyCode == 39) // Left or right
      this.horizontal = 0
  }

  private onKeyPress(e: any) {
    if (this.keyPressCallback) { this.keyPressCallback(e) }
  }

}