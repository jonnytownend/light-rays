export {}
// import Scene from "./scene";
// import Block from "./objects/block";
// import Vector2 from "./utils/vector2";
// import { Input } from './utils/input'
//
// class Mouse extends Vector2 {
//     down: boolean = false
// }
//
// export function setupKeyBindings(canvas: HTMLCanvasElement, scene: Scene) {
//     const mouse = new Mouse(0, 0)
//     const pmouse = new Mouse(0, 0)
//     const input: Input = new Input(canvas)
//     scene.input = input
//
//     const blockStart = new Block()
//     let currentBlock = new Block()
//
//
//     function mouseDown() {
//         mouse.down = true;
//         //Check sun
//         let width = scene.sun.size;
//         if (mouse.x < scene.sun.x+width && mouse.x > scene.sun.x-width && mouse.y < scene.sun.y+width && mouse.y > scene.sun.y-width) {
//             scene.sun.velocity.set(0,0);
//             scene.sun.free = true;
//             scene.sun.dragged = true;
//         }
//         else {
//             blockStart.set(mouse.x, mouse.y);
//             currentBlock = new Block();
//             currentBlock.origin.set(blockStart.x, blockStart.y);
//             scene.addBlock(currentBlock);
//         }
//     }
//     canvas.addEventListener("mousedown", mouseDown, false);
//
//     function mouseMove(event: any) {
//         const rect = canvas.getBoundingClientRect();
//         pmouse.x = mouse.x;
//         pmouse.y = mouse.y;
//         mouse.x = event.pageX - rect.x;
//         mouse.y = event.pageY - rect.y;
//         if (mouse.down) {
//             if (scene.sun.dragged) {
//                 scene.sun.set(mouse.x, mouse.y);
//             }
//             else if (currentBlock.flipped) {
//                 currentBlock.origin.set(mouse.x, mouse.y);
//                 currentBlock.vector = blockStart.subtract(currentBlock.origin);
//             }
//             else {
//                 currentBlock.vector = mouse.subtract(currentBlock.origin);
//             }
//         }
//     }
//     canvas.addEventListener("mousemove", mouseMove, false);
//
//     function mouseUp(event: any) {
//         mouse.down = false;
//         if (scene.sun.dragged) {
//             var diff = mouse.subtract(pmouse);
//             if (diff.len() > 3)
//                 scene.sun.velocity.set(diff.x, diff.y);
//             scene.sun.dragged = false;
//         }
//     }
//     canvas.addEventListener("mouseup", mouseUp, false);
//
//     function keyDown(event: any) {
//         scene.sun.free = false;
//         if (event.keyCode == 38) //Up
//             input.vertical = VerticalInput.UP
//         else if (event.keyCode == 40) //Down
//             input.vertical = VerticalInput.DOWN
//         else if (event.keyCode == 37) //Left
//             input.horizontal = HorizontalInput.LEFT
//         else if (event.keyCode == 39) //Right
//             input.horizontal = HorizontalInput.RIGHT
//         else if (event.keyCode == 32) //Space bar
//             scene.resolveBlocks = !scene.resolveBlocks;
//         else if (event.keyCode == 67) //c
//             scene.blocks = [];
//         else if (event.keyCode == 85) { //u
//             scene.blocks.sort(function(blockA, blockB) {
//                 return blockA.index - blockB.index;
//             });
//             scene.blocks.pop();
//         }
//     }
//     window.addEventListener("keydown", keyDown, false);
//
//     function keyUp(event: any) {
//         if (event.keyCode === 38 || event.keyCode === 40) { // Up or Down
//             input.vertical = VerticalInput.NONE
//         }
//         else if (event.keyCode === 37 || event.keyCode === 39) { // Left or Right
//             input.horizontal = HorizontalInput.NONE
//         }
//     }
//     window.addEventListener("keyup", keyUp, false);
//
// }