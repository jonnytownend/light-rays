import Sun from "./objects/sun";
import Block from "./objects/block";
import Ray from "./objects/ray";
import { random } from './utils/helpers'

class Scene {
    blocks: Block[]
    rays: Ray[]
    diffuseRays: Ray[]
    reflectedRays: Ray[]
    samples: number
    maxSamples: number
    reflectiveSplit: number
    resolveBlocks: boolean
    shimmer: boolean
    secondaryBounces: number
    sun: Sun

    constructor() {
        this.blocks = []
        this.rays = []
        this.diffuseRays = []
        this.reflectedRays = []
        this.samples = 4500
        this.maxSamples = 1.5*this.samples
        this.reflectiveSplit = 0.8
        this.resolveBlocks = true
        this.shimmer = true
        this.secondaryBounces = 1
        this.sun = new Sun(0, 0)
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
        var angle = 2*Math.PI/this.samples;
        for (var i=0; i<this.samples; i++) {
            var ray = new Ray();
            ray.origin = this.sun;
            ray.color = this.sun.color;
            if (this.shimmer)
                ray.vector.rotate(random(0, 2*Math.PI));
            else
                ray.vector.rotate(i*angle);
            this.addRay(ray);
        }
    }

    recastRays() {
        this.diffuseRays = [];
        this.reflectedRays = [];
        for (var i=0; i<this.rays.length; i++) {
            this.rays[i].color = this.sun.color;
            this.rays[i].vector.scale(canvas.width*2);
            if (this.shimmer)
                this.rays[i].vector.rotate(random(0, 2*Math.PI));
        }
    }

    createNewDiffuseRay(ray, block, intersect) {
        var newRay = ray.copy();
        newRay.diffuse = true;
        newRay.origin.set(intersect.x, intersect.y);
        newRay.vector.rotate(random(0,2*Math.PI));
        newRay.vector.scale(canvas.width*2);
        this.diffuseRays.push(newRay);
    }

    createNewReflectedRay(ray, block, intersect) {
        var newRay = ray.copy();
        newRay.origin.set(intersect.x, intersect.y);

        //Rotate block if necessary
        if (this.resolveBlocks && block.checkFlipped(newRay)) {
            block.flip();
        }

        var norm = block.vector.normal();
        norm.scale(1);
        var angle = 2*newRay.vector.angleBetween(block.vector);

        newRay.origin = newRay.origin.subtract(norm);
        newRay.vector.rotate(angle);
        newRay.vector.scale(canvas.width*2);
        this.reflectedRays.push(newRay);
    }

    calculateBounces(rays) {
        for (var i=0; i<rays.length; i++) {
            var ray = rays[i];
            for (var j=0; j<this.blocks.length; j++) {
                var block = this.blocks[j];
                var rand = Math.random();
                var intersect = checkLineIntersection(ray, block);
                if (intersect) {
                    ray.vector = intersect.subtract(ray.origin);
                    if (rand > this.reflectiveSplit && this.getTotalRays() < this.maxSamples) {
                        this.createNewDiffuseRay(ray, block, intersect);
                    }
                    else if (this.getTotalRays() < this.maxSamples) {
                        this.createNewReflectedRay(ray, block, intersect);
                    }
                }
            }
        }
    }

    calculateStops(rays) {
        for (var i=0; i<rays.length; i++) {
            var ray = rays[i];
            for (var j=0; j<this.blocks.length; j++) {
                var block = this.blocks[j];
                var intersect = checkLineIntersection(ray, block);
                if (intersect)
                    ray.vector = intersect.subtract(ray.origin);
            }
        }
    }

    getTotalRays() {
        return this.rays.length+this.reflectedRays.length+this.diffuseRays.length;
    }

    sortBlocks(obj) {
        this.blocks.sort(function(blockA, blockB) {
            var a = blockA.center().subtract(scene.sun);
            var b = blockB.center().subtract(scene.sun);
            return a.len() - b.len();
        });
    }

    sortBlocks2(ray) {
        this.blocks.sort(function(blockA, blockB) {
            var a = blockA.center().subtract(ray.origin);
            var b = blockB.center().subtract(ray.origin);
            return a.len() - b.len();
        });
    }

    update() {
        this.sun.getInput();
        this.sun.update();

        //Ensure blocks are in right order
        this.sortBlocks(this.sun);

        this.recastRays();
        this.calculateBounces(this.rays);
        for (var i=0; i<this.secondaryBounces; i++)
            this.calculateBounces(this.reflectedRays);
        this.calculateStops(this.reflectedRays);
    }

    draw() {
        for (var i=0; i<this.rays.length; i++) {
            this.rays[i].draw();
        }
        for (var i=0; i<this.diffuseRays.length; i++) {
            this.diffuseRays[i].draw();
        }
        for (var i=0; i<this.reflectedRays.length; i++) {
            this.reflectedRays[i].draw();
        }
        if (this.visibleBlocks) {
            for (var i=0; i<this.blocks.length; i++) {
                this.blocks[i].draw();
            }
        }
        if (this.sun.doDraw)
            this.sun.draw();
    }

    save() {
        var nums = '';
        var tmp;
        for (var i=0; i<this.blocks.length; i++) {
            var block = this.blocks[i];
            var blockVals = [
                block.origin.x,
                block.origin.y,
                block.vector.x,
                block.vector.y
            ];
            for (var j in blockVals) {
                if (j!=0)
                    nums += ':';
                nums += blockVals[j];
            }
            nums += ',';
        }
        return nums;
    }

    loadFile(filepath: string) {
        var client = new XMLHttpRequest();
        var self = this;
        client.open('GET', filepath);
        client.onreadystatechange = function() {
            self.loadString(client.responseText);
        }
        client.send();
    }

    loadString(saveString: string) {
        this.blocks = [];
        var newBlocks = saveString.split(',');
        for (var i=0; i<newBlocks.length; i++) {
            var vals = newBlocks[i].split(':');
            var newBlock = new Block();
            newBlock.origin.x = parseInt(vals[0]);
            newBlock.origin.y = parseInt(vals[1]);
            newBlock.vector.x = parseInt(vals[2]);
            newBlock.vector.y = parseInt(vals[3]);
            this.blocks.push(newBlock);
        }
    }
}

export default Scene