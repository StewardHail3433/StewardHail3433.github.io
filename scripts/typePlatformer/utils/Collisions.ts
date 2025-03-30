export function isInside(pt: {x: number, y: number}, box: {x: number; y: number; width: number; height: number}, scale?: number) {

    if(scale)
    return pt.x > box.x * scale && pt.x < (box.x + box.width) * scale
    && pt.y > box.y * scale && pt.y < (box.y + box.height) * scale; 

    return pt.x > box.x * 1 && pt.x < (box.x + box.width) * 1
    && pt.y > box.y * 1 && pt.y < (box.y + box.height) * 1; 


}