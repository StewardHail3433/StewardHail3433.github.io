export function isInside(pt, box) {
    return pt.x > box.x && pt.x < box.x + box.width
        && pt.y > box.y && pt.y < box.y + box.height;
}
