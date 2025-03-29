export function isInside(pt: {x: number, y: number}, box: {x: number; y: number; width: number; height: number}) {

    return pt.x > box.x && pt.x < box.x + box.width
    && pt.y > box.y && pt.y < box.y + box.height;

}