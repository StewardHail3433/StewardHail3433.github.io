export function collision(obj1, obj2) {
    return obj1.pos.y + obj1.height >= obj2.pos.y && 
        obj1.pos.y <= obj2.pos.y + obj2.height &&
        obj1.pos.x <= obj2.pos.x + obj2.width &&
        obj1.pos.x + obj1.width >= obj2.pos.x;

}

