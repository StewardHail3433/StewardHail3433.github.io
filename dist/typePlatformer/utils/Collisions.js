export function isInside(pt, box, scale) {
    if (scale)
        return pt.x > box.x * scale && pt.x < (box.x + box.width) * scale
            && pt.y > box.y * scale && pt.y < (box.y + box.height) * scale;
    return pt.x > box.x * 1 && pt.x < (box.x + box.width) * 1
        && pt.y > box.y * 1 && pt.y < (box.y + box.height) * 1;
}
export function containBox(box1, box2, scale) {
    if (scale)
        return box1.x * scale < (box2.x + box2.width) * scale && (box1.x + box1.width) * scale > box2.x * scale
            && box1.y * scale < (box2.y + box2.height) * scale && (box1.y + box1.height) * scale > box2.y * scale;
    return box1.x < box2.x + box2.width && box1.x + box1.width > box2.x
        && box1.y < box2.y + box2.height && box1.y + box1.height > box2.y;
}
