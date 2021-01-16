import Scene from "./scene";
import Block from "./objects/block";
import Vector2 from "./utils/vector2";

class Mouse extends Vector2 {
    down: boolean = false
}

export function setupKeyBindings(canvas: HTMLCanvasElement, scene: Scene) {
    const mouse = new Mouse(0, 0)
    const pmouse = new Mouse(0, 0)
    const inpt = {x:0, y:0};

    const blockStart = new Block()
    let currentBlock = new Block()

    function mouseDown() {
        mouse.down = true;
        //Check sun
        let width = scene.sun.size;
        if (mouse.x < scene.sun.x+width && mouse.x > scene.sun.x-width && mouse.y < scene.sun.y+width && mouse.y > scene.sun.y-width) {
            scene.sun.velocity.set(0,0);
            scene.sun.free = true;
            scene.sun.dragged = true;
        }
        else {
            blockStart.set(mouse.x, mouse.y);
            currentBlock = new Block();
            currentBlock.origin.set(blockStart.x, blockStart.y);
            scene.addBlock(currentBlock);
        }
    }
    canvas.addEventListener("mousedown", mouseDown, false);

    function mouseMove(event: any) {
        const rect = canvas.getBoundingClientRect();
        pmouse.x = mouse.x;
        pmouse.y = mouse.y;
        mouse.x = event.pageX - rect.x;
        mouse.y = event.pageY - rect.y;
        if (mouse.down) {
            if (scene.sun.dragged) {
                scene.sun.set(mouse.x, mouse.y);
            }
            else if (currentBlock.flipped) {
                currentBlock.origin.set(mouse.x, mouse.y);
                currentBlock.vector = blockStart.subtract(currentBlock.origin);
            }
            else {
                currentBlock.vector = mouse.subtract(currentBlock.origin);
            }
        }
    }
    canvas.addEventListener("mousemove", mouseMove, false);

    function mouseUp(event: any) {
        mouse.down = false;
        if (scene.sun.dragged) {
            var diff = mouse.subtract(pmouse);
            if (diff.len() > 3)
                scene.sun.velocity.set(diff.x, diff.y);
            scene.sun.dragged = false;
        }
    }
    canvas.addEventListener("mouseup", mouseUp, false);

    function keyDown(event: any) {
        scene.sun.free = false;
        if (event.keyCode == 38) //Up
            inpt.y = -1;
        else if (event.keyCode == 40) //Down
            inpt.y = 1;
        else if (event.keyCode == 37) //Left
            inpt.x = -1;
        else if (event.keyCode == 39) //Right
            inpt.x = 1;
        else if (event.keyCode == 32) //Space bar
            scene.resolveBlocks = !scene.resolveBlocks;
        else if (event.keyCode == 67) //c
            scene.blocks = [];
        else if (event.keyCode == 85) { //u
            scene.blocks.sort(function(blockA, blockB) {
                return blockA.index - blockB.index;
            });
            scene.blocks.pop();
        }
    }
    window.addEventListener("keydown", keyDown, false);

    function keyUp(event: any) {
        if (event.keyCode == 38) //Up
            inpt.y = 0;
        else if (event.keyCode == 40) //Down
            inpt.y = 0;
        else if (event.keyCode == 37) //Left
            inpt.x = 0;
        else if (event.keyCode == 39) //Right
            inpt.x = 0;
    }
    window.addEventListener("keyup", keyUp, false);

}