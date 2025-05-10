export class Node {
    constructor() {
        this.parent = undefined;
        this.hCost = 0;
        this.gCost = 0;
        this.fCost = 0;
        this.solid = false;
        this.open = false;
        this.checked = false;
        this.starting = false;
        this.goal = false;
        this.pos = { x: 0, y: 0 };
    }
    setGCost(cost) {
        this.gCost = cost;
    }
    setHCost(cost) {
        this.hCost = cost;
    }
    setFCost(cost) {
        this.fCost = cost;
    }
    setStarting(bool) {
        this.starting = bool;
    }
    setGoal(bool) {
        this.goal = bool;
    }
    setSolid(bool) {
        this.solid = bool;
    }
    setOpen(bool) {
        this.open = bool;
    }
    setChecked(bool) {
        this.checked = bool;
    }
    setPos(pos) {
        this.pos = pos;
    }
    setParent(node) {
        this.parent = node;
    }
    getGCost() {
        return this.gCost;
    }
    getHCost() {
        return this.hCost;
    }
    getFCost() {
        return this.fCost;
    }
    isStarting() {
        return this.starting;
    }
    isGoal() {
        return this.goal;
    }
    isSolid() {
        return this.solid;
    }
    isOpen() {
        return this.open;
    }
    isChecked() {
        return this.checked;
    }
    getPos() {
        return this.pos;
    }
    getParent() {
        return this.parent;
    }
}
