export class Tile {
    private index: number;

    constructor(index: number) {
        this.index = index;
    }

    public getIndex(): number {
        return this.index;
    }
}