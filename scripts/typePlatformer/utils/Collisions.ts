export function isInside(pt: {x: number, y: number}, box: {x: number; y: number; width: number; height: number}) {
    return pt.x > box.x * 1 && pt.x < (box.x + box.width) * 1
    && pt.y > box.y * 1 && pt.y < (box.y + box.height) * 1; 
}

export function containBox(box1: {x: number; y: number; width: number; height: number}, box2: {x: number; y: number; width: number; height: number}) {

    return box1.x < box2.x + box2.width && box1.x + box1.width > box2.x 
    && box1.y < box2.y + box2.height && box1.y + box1.height > box2.y;
}

export function rectCorners(box1: {x: number; y: number; width: number; height: number}) {
    return [[box1.x, box1.y],[box1.x + box1.width, box1.y], [box1.x + box1.width, box1.y + + box1.height],[box1.x, box1.y + + box1.height]];
}

//https://web.archive.org/web/20060911055655/http://local.wasp.uwa.edu.au/%7Epbourke/geometry/lineline2d/
export function containEdge(pts1: number[][], pts2: number[][]) {
    for(let i = 0; i < pts1.length; i++) {
        for(let j = 0; j < pts2.length; j++) {
            if(isIntersecting([pts1[i], pts1[(i+1) % pts1.length]], [pts2[j], pts2[(j+1) % pts2.length]])) {
                return true;
            }
        }
    }
    return false;
}

export function isIntersecting(line1: number[][], line2: number[][]) {
    const denominator = (line2[1][1] - line2[0][1]) * (line1[1][0] - line1[0][0]) - (line2[1][0] - line2[0][0]) * (line1[1][1] - line1[0][1])
    const numeratorA = (line2[1][0] - line2[0][0]) * (line1[0][1] - line2[0][1]) - (line2[1][1] - line2[0][1]) * (line1[0][0] - line2[0][0])
    const numeratorB = (line1[1][0] - line1[0][0]) * (line1[0][1] - line2[0][1]) - (line1[1][1] - line1[0][1]) * (line1[0][0] - line2[0][0])
    if(denominator == 0) {
        if(numeratorA == 0 && numeratorB == 0) {
            return true;
        }
        return false;
    }

    const ua = numeratorA / denominator;
    const ub = numeratorB / denominator;

    return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1);


}
