import Sun from "./objects/sun";
import Block from "./objects/block";
import Ray from "./objects/ray";
import { random, checkLineIntersection } from './utils/helpers'
import Vector2 from "./utils/vector2";
import { Input } from './utils/input'

class Scene {
    blocks: Block[] = []
    rays: Ray[] = []
    diffuseRays: Ray[] = []
    reflectedRays: Ray[] = []
    samples: number = 4500
    reflectiveSplit: number = 0.8
    resolveBlocks: boolean = true
    visibleBlocks: boolean = false
    shimmer: boolean = false
    secondaryBounces: number = 1
    input?: Input
    newBlock: Block | null = null
    isAddingNewBlock: boolean = false

    maxSamples: number
    sun: Sun
    width: number
    height: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.maxSamples = 1.5*this.samples
        this.sun = new Sun(width/2, height/2)
        this.sun.parent = this
    }

    setSamples(samples: number) {
        this.samples = samples
        this.maxSamples = 1.5 * samples
    }

    addBlock(block: Block) {
        block.parent = this
        block.index = this.blocks.length
        this.blocks.push(block)
    }

    addRay(ray: Ray) {
        ray.parent = this
        this.rays.push(ray)
    }

    castRays() {
        const angle = 2*Math.PI/this.samples;
        for (let i=0; i<this.samples; i++) {
            const ray = new Ray();
            this.addRay(ray)
            ray.setRaySize(this.width*2)
            ray.origin = this.sun;
            ray.color = this.sun.color;
            if (this.shimmer) {
                ray.vector.rotate(random(0, 2 * Math.PI));
            } else {
                ray.vector.rotate(i * angle);
            }
        }
    }

    recastRays() {
        this.diffuseRays = [];
        this.reflectedRays = [];
        for (let i=0; i<this.rays.length; i++) {
            this.rays[i].vector.scale(this.width * 2);
            if (this.shimmer) {
                this.rays[i].vector.rotate(random(0, 2*Math.PI));
            }
        }
    }

    createNewDiffuseRay(ray: Ray, block: Block, intersect: Vector2) {
        const newRay = ray.copy();
        newRay.diffuse = true;
        newRay.origin.set(intersect.x, intersect.y);
        newRay.vector.rotate(random(0,2*Math.PI));
        newRay.vector.scale(this.width * 0.5);
        this.diffuseRays.push(newRay);
    }

    createNewReflectedRay(ray: Ray, block: Block, intersect: Vector2) {
        const newRay = ray.copy();
        newRay.origin.set(intersect.x, intersect.y);

        //Rotate block if necessary
        if (this.resolveBlocks && block.checkFlipped(newRay)) {
            block.flip();
        }

        const norm = block.vector.normal();
        norm.scale(1);
        const angle = 2*newRay.vector.angleBetween(block.vector);

        newRay.origin = newRay.origin.subtract(norm);
        newRay.vector.rotate(angle);
        newRay.vector.scale(this.width*2);
        this.reflectedRays.push(newRay);
    }

    calculateBounces(rays: Ray[], isFirstPass: boolean = true) {
        rays.forEach(ray => {
            this.blocks.forEach(block => {
                const rand = Math.random();
                const intersect = checkLineIntersection(ray, block);
                if (!intersect) {
                    return
                }
                ray.vector = intersect.subtract(ray.origin);
                if (rand > this.reflectiveSplit && this.getTotalRays() < this.maxSamples) {
                    this.createNewDiffuseRay(ray, block, intersect);
                }
                else if (this.getTotalRays() < this.maxSamples) {
                    this.createNewReflectedRay(ray, block, intersect);
                }

                // Calculate stops
                if (isFirstPass) {
                    ray.vector = intersect.subtract(ray.origin);
                }
            })
        })
    }

    getTotalRays() {
        return this.rays.length+this.reflectedRays.length+this.diffuseRays.length;
    }

    getObjects() {
        return [...this.rays, ...this.reflectedRays, ...this.diffuseRays, ...this.blocks, this.sun]
    }

    sortBlocks() {
        this.blocks.sort((blockA, blockB) => {
            const a = blockA.center().subtract(this.sun);
            const b = blockB.center().subtract(this.sun);
            return a.lenSq() - b.lenSq();
        });
    }

    handleInput() {
        if (!this.input) { return }

        this.sun.handleInput()
        if (this.sun.dragged || !this.input.isMouseDown) {
            this.isAddingNewBlock = false
            if (this.newBlock !== null) {
                this.newBlock = null
            }
            return
        }

        const mouse = this.input.mouse
        if (!this.isAddingNewBlock) {
            this.newBlock = new Block()
            this.newBlock.origin.set(mouse.x, mouse.y)
            this.isAddingNewBlock = true
            this.addBlock(this.newBlock)
        } else if (this.newBlock) {
            if (this.newBlock.flipped) {
                // Flip it back whilst drawing
                this.newBlock.flip()
            }
            this.newBlock.vector.set(
                mouse.x - this.newBlock.origin.x,
                mouse.y - this.newBlock.origin.y,
            )
        }
    }

    update() {
        this.handleInput()
        this.sun.update();

        //Ensure blocks are in right order
        this.sortBlocks();

        this.recastRays();
        this.calculateBounces(this.rays);
        for (let i=0; i<this.secondaryBounces; i++) {
            this.calculateBounces(this.reflectedRays, i === 0);
        }
    }

    start() {
        // Setup key bindings
        this.input?.observeKeyPress((e: any) => {
            if (e.keyCode === 117) { //u
                this.blocks.sort((blockA, blockB) => {
                    return blockA.index - blockB.index;
                })
                this.blocks.pop()
            } else if (e.keyCode === 99) {
                this.blocks = []
            }
        })

        this.castRays()
    }

    save() {
        let nums = '';
        let tmp;
        for (let i=0; i<this.blocks.length; i++) {
            const block = this.blocks[i];
            const blockVals = [
                block.origin.x,
                block.origin.y,
                block.vector.x,
                block.vector.y
            ];
            blockVals.forEach((_, index) => {
                if (index != 0) nums += ':'
                nums += blockVals[index];
            })
            nums += ',';
        }
        return nums;
    }

    loadFile(filepath: string) {
        const client = new XMLHttpRequest();
        const self = this;
        client.open('GET', filepath);
        client.onreadystatechange = function() {
            self.loadString(client.responseText);
        }
        client.send();
    }

    loadString(saveString: string) {
        this.blocks = [];
        const newBlocks = saveString.split(',');
        for (let i=0; i<newBlocks.length; i++) {
            const vals = newBlocks[i].split(':');
            const newBlock = new Block();
            newBlock.origin.x = parseInt(vals[0]);
            newBlock.origin.y = parseInt(vals[1]);
            newBlock.vector.x = parseInt(vals[2]);
            newBlock.vector.y = parseInt(vals[3]);
            this.blocks.push(newBlock);
        }

        // Center all blocks
    }
}

export default Scene