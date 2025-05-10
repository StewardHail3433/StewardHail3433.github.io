import { Tiles } from "../../world/Tiles.js";
import { WorldTile } from "../../world/WorldTile.js";
import { Constants } from "../Constants.js";
import { Node } from "./Node.js";

export class PathFinder {

    /* A*
    G cost - distance from current to start
    H cost - distance from current to goal
    F cost - G + H

    go to less F then less G -- search method
    
    https://youtu.be/2JNEme00ZFA?si=Wg9_sVOyM5kfSTCl
    https://youtu.be/Hd0D68guFKg?si=VUkOZhqTqMhaDwd3

    */

    private static maxPathWidth: number = Constants.CHUNK_SIZE;
    private static maxPathHeight: number = Constants.CHUNK_SIZE;

    private static nodes: Node[][];
    private static path: Node[] = [];
    private static checked: Node[] = [];
    private static opened: Node[] = [];

    private static startNode: Node = new Node();
    private static goalNode: Node = new Node();
    private static currentNode: Node = new Node();

    private static foundPath = true;
    private static goalReached = false;

    private static worldMap: Map<string, WorldTile[][]>;


    static initNode(maxPathWidth: number = Constants.CHUNK_SIZE, maxPathHeight: number = Constants.CHUNK_SIZE) {
        this.maxPathWidth = maxPathWidth;
        this.maxPathHeight= maxPathHeight;
        this.nodes = []

        for(let i = 0; i < this.maxPathHeight; i++) {
            this.nodes.push([]);
            for(let j = 0; j < this.maxPathWidth; j++) {
                this.nodes[i].push(new Node());
            }
        }

        this.resetOthers();
    }

    private static resetOthers() {
        this.checked = [];
        this.opened =[];
        this.path = [];
        this.goalReached = false;
        this.foundPath = true;
    }

    private static resetNodes(maxPathWidth: number = Constants.CHUNK_SIZE, maxPathHeight: number = Constants.CHUNK_SIZE) {
        // if(maxPathWidth != Constants.CHUNK_SIZE || maxPathHeight != Constants.CHUNK_SIZE && !this.nodes) {
            this.initNode(maxPathWidth, maxPathHeight);
        // }

        for(let i = 0; i < this.maxPathHeight; i++) {
            for(let j = 0; j < this.maxPathWidth; j++) {
                const node = this.nodes[i][j]
                node.setGCost(0);
                node.setFCost(0);
                node.setHCost(0);
                node.setSolid(false);
                node.setGoal(false);
                node.setStarting(false);
                node.setParent(undefined);
                node.setChecked(false);
                node.setOpen(false);
            }
        }

        this.resetOthers();
        
    }

    public static setNodes(startX: number, startY: number, goalX: number, goalY: number, map: Map<string, WorldTile[][]>, maxPathWidth: number = Constants.CHUNK_SIZE, maxPathHeight: number = Constants.CHUNK_SIZE) {
        this.resetNodes(maxPathHeight, maxPathWidth);

        let xDist = (goalX - startX);
        let yDist = (goalY - startY);
        
        if (
            Math.abs(xDist) >= Math.floor(this.maxPathWidth / 2) ||
            Math.abs(yDist) >= Math.floor(this.maxPathHeight / 2)
        ) {
            this.foundPath = false;
            return;
        }
        
        this.worldMap = map;
        const midY = Math.floor(this.maxPathHeight / 2);
        const midX = Math.floor(this.maxPathWidth / 2);
        this.startNode = this.nodes[midY][midX];
        this.startNode.setStarting(true);
        this.currentNode = this.startNode;

        const goalIndexY = midY + (goalY - startY);
        const goalIndexX = midX + (goalX - startX);

        if (    
            goalIndexY < 0 || goalIndexY >= this.maxPathHeight ||
            goalIndexX < 0 || goalIndexX >= this.maxPathWidth
        ) {
            this.foundPath = false;
            return;
        }

        if(goalX == startX && goalY == startX) {
            this.goalReached = true;
            return;
        }

        this.goalNode = this.nodes[midY + (goalY - startY)][midX + (goalX - startX)];
        this.goalNode.setGoal(true);

        for(let i = 0; i < this.maxPathHeight; i++) {
            for(let j = 0; j < this.maxPathWidth; j++) {
                const node = this.nodes[i][j];
                const x = startX - Math.floor(this.maxPathWidth / 2) + j;
                const y = startY - Math.floor(this.maxPathHeight / 2) + i;
                const tileX = ((x % Constants.CHUNK_SIZE) + Constants.CHUNK_SIZE) % Constants.CHUNK_SIZE;;
                const tileY = ((y % Constants.CHUNK_SIZE) + Constants.CHUNK_SIZE) % Constants.CHUNK_SIZE;;
                const tile = map.get(Math.floor(x / Constants.CHUNK_SIZE) + ", " + Math.floor(y / Constants.CHUNK_SIZE))?.[tileY]?.[tileX];

                if(x == goalX && y == goalY && tile?.getLayers()[0].tile != Tiles.EMPTY) {
                    this.goalReached = true;
                    return;
                }
                node.setPos({x, y});
                if(tile?.getLayers()[0].tile != Tiles.EMPTY) {
                    node.setSolid(true);
                }
                this.getCost(node);
            }
        }
    }

    private static getCost(node: Node) {
        let xDist = Math.abs(node.getPos().x - this.startNode.getPos().x);
        let yDist = Math.abs(node.getPos().y - this.startNode.getPos().y);
        node.setGCost(xDist + yDist);

        xDist = Math.abs(node.getPos().x - this.goalNode.getPos().x);
        yDist = Math.abs(node.getPos().y - this.goalNode.getPos().y);
        node.setHCost(xDist + yDist);

        node.setFCost(node.getGCost() + node.getHCost());
    }

    public static search(): Node[] {
        while(this.foundPath && !this.goalReached) {
            let pos = this.currentNode.getPos();

            this.currentNode.setChecked(true);
            this.checked.push(this.currentNode);
            this.removeOpen(this.currentNode);

            const indexY = pos.y - this.startNode.getPos().y + Math.floor(this.maxPathWidth / 2);
            const indexX = pos.x - this.startNode.getPos().x + Math.floor(this.maxPathWidth / 2);
            if(indexX - 1 >= 0) {
                this.openNode(this.nodes[indexY][indexX - 1]);
            }
            if(indexX + 1 < this.maxPathWidth) {
                this.openNode(this.nodes[indexY][indexX + 1]);
            }
            if(indexY - 1 >= 0) {
                this.openNode(this.nodes[indexY - 1][indexX])
            }
            if(indexY + 1 < this.maxPathHeight) {
                this.openNode(this.nodes[indexY + 1][indexX])
            }

            if (this.opened.length === 0) {
                this.foundPath = false;
                break;
            }
        

            let bestNodeIndex = 0;
            let bestNodeFCost = 999;

            for(let i = 0; i < this.opened.length; i++) {
                const fCost = this.opened[i].getFCost()
                if(fCost < bestNodeFCost) {
                    bestNodeFCost = fCost;
                    bestNodeIndex = i;
                } else if(fCost == bestNodeFCost) {
                    if(this.opened[i].getGCost() < this.opened[bestNodeIndex].getGCost()) {
                        bestNodeIndex = i;
                    }
                } 
            }           
            this.currentNode = this.opened[bestNodeIndex];

            if(this.currentNode == this.goalNode) {
                this.goalReached = true;
                this.path = [];
                let current: Node | undefined = this.goalNode;
                while (current !== undefined) {
                    this.path.unshift(current); 
                    current = current.getParent();
                }

            }
        }
        return this.path;
    }

    private static removeOpen(node: Node) {
        for(let i = 0; i < this.opened.length; i++) {
            if(node == this.opened[i]) {
                this.opened.splice(i, 1);
                break;
            }
        }
    }

    private static openNode(node: Node) {
        if(!node.isOpen() && !node.isChecked() && !node.isSolid()) {
            const gCost = this.currentNode.getGCost() + 1; 
            node.setGCost(gCost);

            const xDist = Math.abs(node.getPos().x - this.goalNode.getPos().x);
            const yDist = Math.abs(node.getPos().y - this.goalNode.getPos().y);
            node.setHCost(xDist + yDist);

            node.setFCost(node.getGCost() + node.getHCost());

            node.setOpen(true);
            node.setParent(this.currentNode);
            this.opened.push(node);
        }
    }

    public static render(path: Node[], ctx: CanvasRenderingContext2D) {
        if (path.length === 0) return;
    
        ctx.fillStyle = "#ffff00aa"; // semi-transparent yellow
    
        for (const node of path) {
            const pos = node.getPos();
            ctx.fillRect(pos.x * Constants.TILE_SIZE, pos.y * Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE
            );
        }
    }    
    
    public static getGoal(){
        return this.goalNode;
    }
}