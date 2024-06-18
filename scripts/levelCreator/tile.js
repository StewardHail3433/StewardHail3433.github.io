export default class Tile {
    constructor(x, y, value=0, img=null) { 
        this.x = x;
        this.y = y;
        this.value = value;
        this.img = new Image();;
    }
}