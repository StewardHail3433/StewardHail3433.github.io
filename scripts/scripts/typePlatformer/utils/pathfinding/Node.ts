export class Node {
    private parent: Node | undefined = undefined;
    private hCost = 0;
    private gCost = 0;
    private fCost = 0;
    private solid: boolean = false;
    private open: boolean = false;
    private checked: boolean = false;
    private starting: boolean = false;
    private goal: boolean = false;
    private pos: {x:number, y:number} = {x: 0, y: 0};

    constructor(){}

    public setGCost(cost: number) {
        this.gCost = cost;
    }

    public setHCost(cost: number) {
        this.hCost = cost;
    }

    public setFCost(cost: number) {
        this.fCost = cost;
    }

    public setStarting(bool: boolean) {
        this.starting = bool;
    }

    public setGoal(bool: boolean) {
        this.goal = bool;
    }

    public setSolid(bool: boolean) {
        this.solid = bool;
    }

    public setOpen(bool: boolean) {
        this.open = bool;
    }

    public setChecked(bool: boolean) {
        this.checked = bool;
    }

    public setPos(pos: {x:number, y:number}){
        this.pos = pos;
    }

    public setParent(node: Node | undefined){
        this.parent = node;
    }

    public getGCost(): number {
        return this.gCost;
    }

    public getHCost(): number {
        return this.hCost;
    }

    public getFCost(): number {
        return this.fCost;
    }

    public isStarting(): boolean {
        return this.starting;
    }

    public isGoal(): boolean {
        return this.goal;
    }

    public isSolid(): boolean {
        return this.solid;
    }

    public isOpen(): boolean {
        return this.open;
    }

    public isChecked(): boolean {
        return this.checked;
    }

    public getPos(): {x:number, y:number} {
        return this.pos;
    }

    public getParent(): Node | undefined {
        return this.parent;
    }
}