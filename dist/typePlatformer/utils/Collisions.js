export function isInside(pt, box) {
    return pt.x > box.x * 1 && pt.x < (box.x + box.width) * 1
        && pt.y > box.y * 1 && pt.y < (box.y + box.height) * 1;
}
export function containBox(box1, box2) {
    return box1.x < box2.x + box2.width && box1.x + box1.width > box2.x
        && box1.y < box2.y + box2.height && box1.y + box1.height > box2.y;
}
