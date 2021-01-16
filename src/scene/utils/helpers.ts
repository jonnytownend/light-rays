import Ray from "../objects/ray";
import Block from "../objects/block";
import Vector2 from "./vector2";

export function random(a: number, b: number): number {
    return (b-a)*Math.random() + a;
}

export function checkLineIntersection(ray: Ray, block: Block) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point

    let line1StartX = ray.origin.x;
    let line1StartY = ray.origin.y;
    let line1EndX = ray.origin.x + ray.vector.x;
    let line1EndY = ray.origin.y + ray.vector.y;

    let line2StartX = block.origin.x;
    let line2StartY = block.origin.y;
    let line2EndX = line2StartX + block.vector.x;
    let line2EndY = line2StartY + block.vector.y;

    let denominator, a, b, numerator1, numerator2;
    let x = 0;
    let y = 0;
    let onLine1 = false;
    let onLine2 = false;

    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    /*
    if (denominator == 0) {
        return false; //The lines are parallel
    }
    */
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        onLine2 = true;
    }

    if (onLine1 == true && onLine2 == true) {
        // if we cast these lines infinitely in both directions, they intersect here:
        x = line1StartX + (a * (line1EndX - line1StartX));
        y = line1StartY + (a * (line1EndY - line1StartY));
        return new Vector2(x, y);
    }

    /*
	else
		return false;
        */
}