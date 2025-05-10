import { Tiles } from "../../world/Tiles.js";
import { Constants } from "../Constants.js";
import { Node } from "./Node.js";
export class PathFinder {
    static initNode(maxPathWidth = Constants.CHUNK_SIZE, maxPathHeight = Constants.CHUNK_SIZE) {
        this.maxPathWidth = maxPathWidth;
        this.maxPathHeight = maxPathHeight;
        this.nodes = [];
        for (let i = 0; i < this.maxPathHeight; i++) {
            this.nodes.push([]);
            for (let j = 0; j < this.maxPathWidth; j++) {
                this.nodes[i].push(new Node());
            }
        }
        this.resetOthers();
    }
    static resetOthers() {
        this.checked = [];
        this.opened = [];
        this.path = [];
        this.goalReached = false;
        this.foundPath = true;
    }
    static resetNodes(maxPathWidth = Constants.CHUNK_SIZE, maxPathHeight = Constants.CHUNK_SIZE) {
        // if(maxPathWidth != Constants.CHUNK_SIZE || maxPathHeight != Constants.CHUNK_SIZE && !this.nodes) {
        this.initNode(maxPathWidth, maxPathHeight);
        // }
        for (let i = 0; i < this.maxPathHeight; i++) {
            for (let j = 0; j < this.maxPathWidth; j++) {
                const node = this.nodes[i][j];
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
    static setNodes(startX, startY, goalX, goalY, map, maxPathWidth = Constants.CHUNK_SIZE, maxPathHeight = Constants.CHUNK_SIZE) {
        var _a, _b;
        this.resetNodes(maxPathHeight, maxPathWidth);
        let xDist = (goalX - startX);
        let yDist = (goalY - startY);
        if (Math.abs(xDist) >= Math.floor(this.maxPathWidth / 2) ||
            Math.abs(yDist) >= Math.floor(this.maxPathHeight / 2)) {
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
        if (goalIndexY < 0 || goalIndexY >= this.maxPathHeight ||
            goalIndexX < 0 || goalIndexX >= this.maxPathWidth) {
            this.foundPath = false;
            return;
        }
        if (goalX == startX && goalY == startX) {
            this.goalReached = true;
            return;
        }
        this.goalNode = this.nodes[midY + (goalY - startY)][midX + (goalX - startX)];
        this.goalNode.setGoal(true);
        for (let i = 0; i < this.maxPathHeight; i++) {
            for (let j = 0; j < this.maxPathWidth; j++) {
                const node = this.nodes[i][j];
                const x = startX - Math.floor(this.maxPathWidth / 2) + j;
                const y = startY - Math.floor(this.maxPathHeight / 2) + i;
                const tileX = ((x % Constants.CHUNK_SIZE) + Constants.CHUNK_SIZE) % Constants.CHUNK_SIZE;
                ;
                const tileY = ((y % Constants.CHUNK_SIZE) + Constants.CHUNK_SIZE) % Constants.CHUNK_SIZE;
                ;
                const tile = (_b = (_a = map.get(Math.floor(x / Constants.CHUNK_SIZE) + ", " + Math.floor(y / Constants.CHUNK_SIZE))) === null || _a === void 0 ? void 0 : _a[tileY]) === null || _b === void 0 ? void 0 : _b[tileX];
                if (x == goalX && y == goalY && (tile === null || tile === void 0 ? void 0 : tile.getLayers()[0].tile) != Tiles.EMPTY) {
                    this.goalReached = true;
                    return;
                }
                node.setPos({ x, y });
                if ((tile === null || tile === void 0 ? void 0 : tile.getLayers()[0].tile) != Tiles.EMPTY) {
                    node.setSolid(true);
                }
                this.getCost(node);
            }
        }
    }
    static getCost(node) {
        let xDist = Math.abs(node.getPos().x - this.startNode.getPos().x);
        let yDist = Math.abs(node.getPos().y - this.startNode.getPos().y);
        node.setGCost(xDist + yDist);
        xDist = Math.abs(node.getPos().x - this.goalNode.getPos().x);
        yDist = Math.abs(node.getPos().y - this.goalNode.getPos().y);
        node.setHCost(xDist + yDist);
        node.setFCost(node.getGCost() + node.getHCost());
    }
    static search() {
        while (this.foundPath && !this.goalReached) {
            let pos = this.currentNode.getPos();
            this.currentNode.setChecked(true);
            this.checked.push(this.currentNode);
            this.removeOpen(this.currentNode);
            const indexY = pos.y - this.startNode.getPos().y + Math.floor(this.maxPathWidth / 2);
            const indexX = pos.x - this.startNode.getPos().x + Math.floor(this.maxPathWidth / 2);
            if (indexX - 1 >= 0) {
                this.openNode(this.nodes[indexY][indexX - 1]);
            }
            if (indexX + 1 < this.maxPathWidth) {
                this.openNode(this.nodes[indexY][indexX + 1]);
            }
            if (indexY - 1 >= 0) {
                this.openNode(this.nodes[indexY - 1][indexX]);
            }
            if (indexY + 1 < this.maxPathHeight) {
                this.openNode(this.nodes[indexY + 1][indexX]);
            }
            if (this.opened.length === 0) {
                this.foundPath = false;
                break;
            }
            let bestNodeIndex = 0;
            let bestNodeFCost = 999;
            for (let i = 0; i < this.opened.length; i++) {
                const fCost = this.opened[i].getFCost();
                if (fCost < bestNodeFCost) {
                    bestNodeFCost = fCost;
                    bestNodeIndex = i;
                }
                else if (fCost == bestNodeFCost) {
                    if (this.opened[i].getGCost() < this.opened[bestNodeIndex].getGCost()) {
                        bestNodeIndex = i;
                    }
                }
            }
            this.currentNode = this.opened[bestNodeIndex];
            if (this.currentNode == this.goalNode) {
                this.goalReached = true;
                this.path = [];
                let current = this.goalNode;
                while (current !== undefined) {
                    this.path.unshift(current);
                    current = current.getParent();
                }
            }
        }
        return this.path;
    }
    static removeOpen(node) {
        for (let i = 0; i < this.opened.length; i++) {
            if (node == this.opened[i]) {
                this.opened.splice(i, 1);
                break;
            }
        }
    }
    static openNode(node) {
        if (!node.isOpen() && !node.isChecked() && !node.isSolid()) {
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
    static render(path, ctx) {
        if (path.length === 0)
            return;
        ctx.fillStyle = "#ffff00aa"; // semi-transparent yellow
        for (const node of path) {
            const pos = node.getPos();
            ctx.fillRect(pos.x * Constants.TILE_SIZE, pos.y * Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
        }
    }
    static getGoal() {
        return this.goalNode;
    }
}
/* A*
G cost - distance from current to start
H cost - distance from current to goal
F cost - G + H

go to less F then less G -- search method

https://youtu.be/2JNEme00ZFA?si=Wg9_sVOyM5kfSTCl
https://youtu.be/Hd0D68guFKg?si=VUkOZhqTqMhaDwd3

*/
PathFinder.maxPathWidth = Constants.CHUNK_SIZE;
PathFinder.maxPathHeight = Constants.CHUNK_SIZE;
PathFinder.path = [];
PathFinder.checked = [];
PathFinder.opened = [];
PathFinder.startNode = new Node();
PathFinder.goalNode = new Node();
PathFinder.currentNode = new Node();
PathFinder.foundPath = true;
PathFinder.goalReached = false;
