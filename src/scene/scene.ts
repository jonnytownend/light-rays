import Sun from "./objects/sun";
import Block from "./objects/block";
import Ray from "./objects/ray";
import RendererInterface from "./renderer/renderer.interface";
import { random, checkLineIntersection } from './utils/helpers'
import Vector2 from "./utils/vector2";

class Scene {
    blocks: Block[]
    rays: Ray[]
    diffuseRays: Ray[]
    reflectedRays: Ray[]
    samples: number
    maxSamples: number
    reflectiveSplit: number
    resolveBlocks: boolean
    visibleBlocks: boolean
    shimmer: boolean
    secondaryBounces: number
    sun: Sun
    width: number
    height: number

    constructor(width: number, height: number) {
        this.blocks = []
        this.rays = []
        this.diffuseRays = []
        this.reflectedRays = []
        this.samples = 4500
        this.maxSamples = 1.5*this.samples
        this.reflectiveSplit = 0.8
        this.resolveBlocks = true
        this.visibleBlocks = false
        this.shimmer = false
        this.secondaryBounces = 1
        this.width = width
        this.height = height
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
            this.rays[i].color = this.sun.color;
            this.rays[i].vector.scale(this.width * 2);
            if (this.shimmer)
                this.rays[i].vector.rotate(random(0, 2*Math.PI));
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
        for (let i=0; i<rays.length; i++) {
            const ray = rays[i];
            for (let j=0; j<this.blocks.length; j++) {
                const block = this.blocks[j];
                const rand = Math.random();
                const intersect = checkLineIntersection(ray, block);
                if (!intersect) {
                    continue
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
            }
        }
    }

    getTotalRays() {
        return this.rays.length+this.reflectedRays.length+this.diffuseRays.length;
    }

    getObjects() {
        return [...this.rays, ...this.reflectedRays, ...this.diffuseRays, ...this.blocks, this.sun]
    }

    sortBlocks(sun: Sun) {
        this.blocks.sort(function(blockA, blockB) {
            const a = blockA.center().subtract(sun);
            const b = blockB.center().subtract(sun);
            return a.lenSq() - b.lenSq();
        });
    }

    sortBlocks2(ray: Ray) {
        this.blocks.sort(function(blockA, blockB) {
            const a = blockA.center().subtract(ray.origin);
            const b = blockB.center().subtract(ray.origin);
            return a.lenSq() - b.lenSq();
        });
    }

    update() {
        this.sun.getInput();
        this.sun.update();

        //Ensure blocks are in right order
        this.sortBlocks(this.sun);

        this.recastRays();
        this.calculateBounces(this.rays);
        for (let i=0; i<this.secondaryBounces; i++) {
            this.calculateBounces(this.reflectedRays, i === 0);
        }
    }

    // draw() {
    //     this.renderer.clear()
    //     for (let i=0; i<this.rays.length; i++) {
    //         this.renderer.draw(this.rays[i])
    //     }
    //     for (let i=0; i<this.diffuseRays.length; i++) {
    //         this.renderer.draw(this.diffuseRays[i])
    //     }
    //     for (let i=0; i<this.reflectedRays.length; i++) {
    //         this.renderer.draw(this.reflectedRays[i])
    //     }
    //     if (this.visibleBlocks) {
    //         for (let i=0; i<this.blocks.length; i++) {
    //             this.renderer.draw(this.blocks[i])
    //         }
    //     }
    //     if (this.sun.doDraw)
    //         this.renderer.draw(this.sun)
    // }
    draw() {
        
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
    }
}

export default Scene