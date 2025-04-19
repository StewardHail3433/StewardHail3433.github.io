import { UIInventory } from "../../components/ui/inventory/UIInventory.js";
import { UIComponentButton } from "../../components/ui/UIComponentButton.js";
import { Inventory } from "../../inventory/Inventory.js";
import { Items } from "../../item/Items.js";
import { Constants } from "../../utils/Constants.js";
import { ImageLoader } from "../../utils/ImageLoader.js";
import { Entity } from "../Entity.js";
export class Player extends Entity {
    constructor(name, healthComponent, hitboxComponent) {
        super(healthComponent, hitboxComponent);
        this.keys = {};
        this.touchMode = false;
        this.frame = 0;
        this.inventory = new Inventory(14);
        this.hotbar = new Inventory(7);
        this.movementButtons = [new UIComponentButton(document.getElementById("gameCanvas"), { x: 10, y: 270, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "<-", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                this.keys[this.controls.left] = false;
            }, () => {
                this.keys[this.controls.left] = true;
            }), new UIComponentButton(document.getElementById("gameCanvas"), { x: 55, y: 270, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "v", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                this.keys[this.controls.down] = false;
            }, () => {
                this.keys[this.controls.down] = true;
            }), new UIComponentButton(document.getElementById("gameCanvas"), { x: 100, y: 270, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "->", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                this.keys[this.controls.right] = false;
            }, () => {
                this.keys[this.controls.right] = true;
            }), new UIComponentButton(document.getElementById("gameCanvas"), { x: 55, y: 225, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "^", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                this.keys[this.controls.up] = false;
            }, () => {
                this.keys[this.controls.up] = true;
            })];
        this.isArrows = false;
        this.name = name;
        this.speed = 60;
        this.setControls();
        // this.hotbar.getSlot(3).setItem(Items.STICK);
        // this.inventory.getSlot(0).setItem(Items.STICK);
        // this.inventory.getSlot(2).setItem(Items.STICK);
        // this.inventory.getSlot(4).setItem(Items.STICK);
        // this.inventory.getSlot(6).setItem(Items.STICK);
        // this.inventory.getSlot(8).setItem(Items.STICK);
        this.inventory.getSlot(10).setItem(Items.STICK, 1);
        // this.inventory.getSlot(12).setItem(Items.SWORD);
        this.hotbarUi = new UIInventory(document.getElementById("gameCanvas"), this.inventory, { x: 0, y: 0, row: 2, col: 7 }, undefined, false);
        this.inventory.setSelecteSlot(0);
        document.addEventListener("keydown", (event) => this.keys[event.key] = true);
        document.addEventListener("keyup", (event) => this.keys[event.key] = false);
        this.setToTouch();
        this.img = ImageLoader.getImages()[1];
        Constants.COMMAND_SYSTEM.addCommand("tp", (args) => {
            this.hitboxComponent.setHitbox(Object.assign(Object.assign({}, hitboxComponent.getHitbox()), { x: parseFloat(args[0]), y: parseFloat(args[1]) }));
        });
        Constants.COMMAND_SYSTEM.addCommand("speed", (args) => {
            this.speed = parseFloat(args[0]);
        });
        Constants.COMMAND_SYSTEM.addCommand("give", (args) => {
            if (args[0] == "self") {
                const item = Items.getItemById(args[1]);
                let amount = 0;
                let emptyIndex = -1;
                if (item.getId() != "empty") {
                    console.log(item.getId());
                    for (let i = 0; i < this.inventory.getSize(); i++) {
                        if (this.inventory.getSlot(i).isEmpty() && emptyIndex == -1)
                            emptyIndex = i;
                        if (this.inventory.getSlot(i).getItem().getId() == item.getId()) {
                            console.log("AWsd");
                            if (amount === 0) {
                                if (parseInt(args[2]) > 0) {
                                    amount = this.inventory.getSlot(i).addItems(parseInt(args[2]));
                                }
                                else {
                                    return;
                                }
                                if (amount === 0) {
                                    return;
                                }
                            }
                            else {
                                amount = this.inventory.getSlot(i).addItems(amount);
                                if (amount === 0) {
                                    return;
                                }
                            }
                        }
                    }
                    if (emptyIndex != -1) {
                        for (let i = emptyIndex; i < this.inventory.getSize(); i++) {
                            if (this.inventory.getSlot(i).isEmpty()) {
                                if (amount === 0) {
                                    if (parseInt(args[2]) > 0) {
                                        if (parseInt(args[2]) > item.getMaxStackAmount()) {
                                            this.inventory.getSlot(i).setItem(item, item.getMaxStackAmount());
                                            amount = parseInt(args[2]) - item.getMaxStackAmount();
                                        }
                                        else {
                                            this.inventory.getSlot(i).setItem(item, parseInt(args[2]));
                                            amount = 0;
                                        }
                                    }
                                    else {
                                        return;
                                    }
                                    if (amount === 0) {
                                        return;
                                    }
                                }
                                else {
                                    if (amount > item.getMaxStackAmount()) {
                                        this.inventory.getSlot(i).setItem(item, item.getMaxStackAmount());
                                        amount = amount - item.getMaxStackAmount();
                                    }
                                    else {
                                        this.inventory.getSlot(i).setItem(item, amount);
                                        amount = 0;
                                    }
                                    if (amount === 0) {
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        Constants.COMMAND_SYSTEM.addCommand("clear", (args) => {
            if (args[0] == "self") {
                this.inventory.clear();
            }
        });
    }
    setControls(controls = {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        jump: ' ',
        debug: 't',
    }) {
        this.controls = controls;
    }
    update(dt) {
        this.velocity = { x: 0, y: 0 };
        if (this.keys[this.controls.up]) {
            this.direction = "up";
            this.velocity.y = -this.speed;
        }
        if (this.keys[this.controls.down]) {
            this.direction = "down";
            this.velocity.y = this.speed;
        }
        if (this.keys[this.controls.left]) {
            this.direction = "left";
            this.velocity.x = -this.speed;
        }
        if (this.keys[this.controls.right]) {
            this.direction = "right";
            this.velocity.x = this.speed;
        }
        if (this.keys[this.controls.debug]) {
            this.hitboxComponent.setHitbox(Object.assign(Object.assign({}, this.hitboxComponent.getHitbox()), { x: 200 }));
        }
        if (this.keys["1"]) {
            this.hotbar.setSelecteSlot(0);
        }
        else if (this.keys["2"]) {
            this.hotbar.setSelecteSlot(1);
        }
        else if (this.keys["3"]) {
            this.hotbar.setSelecteSlot(2);
        }
        else if (this.keys["4"]) {
            this.hotbar.setSelecteSlot(3);
        }
        else if (this.keys["5"]) {
            this.hotbar.setSelecteSlot(4);
        }
        else if (this.keys["6"]) {
            this.hotbar.setSelecteSlot(5);
        }
        else if (this.keys["7"]) {
            this.hotbar.setSelecteSlot(6);
        }
        if (this.touchMode) {
            for (var button of this.movementButtons) {
                button.show();
            }
        }
        else {
            for (var button of this.movementButtons) {
                button.hide();
            }
        }
        this.frame += 1;
        if (this.keys["p"]) {
            if (this.isArrows) {
                this.setControls();
                this.isArrows = false;
            }
            else {
                this.setControls(Object.assign(Object.assign({}, this.controls), { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" }));
                this.isArrows = true;
            }
            this.keys["p"] = false;
        }
        super.update(dt);
    }
    getControls() {
        return Object.assign({}, this.controls);
    }
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    isMoving() {
        return this.velocity.x != 0 || this.velocity.y != 0;
    }
    getMovementButton(canvas) {
        return this.movementButtons;
    }
    setToKeyboard() {
        this.touchMode = false;
        document.addEventListener("keydown", (event) => this.keys[event.key] = true);
        document.addEventListener("keyup", (event) => this.keys[event.key] = false);
    }
    setToTouch() {
        document.removeEventListener("keydown", () => { });
        document.removeEventListener("keyup", () => { });
        this.touchMode = true;
    }
    getTouchMode() {
        return this.touchMode;
    }
    render(ctx) {
        // super.render(ctx);
        if (this.velocity.x != 0 || this.velocity.y != 0) {
            ctx.imageSmoothingEnabled = false;
            if (this.direction === "up" || this.direction === "down") {
                if (this.frame % 40 < 10) {
                    if (this.direction === "down") {
                        ctx.drawImage(this.img, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE * 1, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
                else if (this.frame % 40 < 20) {
                    if (this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, Constants.TILE_SIZE * 1, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
                else if (this.frame % 40 < 30) {
                    if (this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 2, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 2, Constants.TILE_SIZE * 1, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
                else if (this.frame % 40 < 40) {
                    if (this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 3, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 3, Constants.TILE_SIZE * 1, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
            }
            else {
                if (this.frame % 80 < 10) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
                else if (this.frame % 80 < 20) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
                else if (this.frame % 80 < 30) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 2, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 2, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
                else if (this.frame % 80 < 40) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 4, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 4, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
                else if (this.frame % 80 < 50) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 3, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 3, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
                else if (this.frame % 80 < 60) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 4, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 4, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
                else if (this.frame % 80 < 70) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 5, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 5, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
                else if (this.frame % 80 < 80) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
                    }
                }
            }
        }
        else {
            if (this.direction === "up") {
                ctx.drawImage(this.img, 0, Constants.TILE_SIZE * 1, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
            }
            else if (this.direction === "down") {
                ctx.drawImage(this.img, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
            }
            else if (this.direction === "right") {
                ctx.drawImage(this.img, 0, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
            }
            else if (this.direction === "left") {
                ctx.drawImage(this.img, Constants.TILE_SIZE * 2, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x, this.hitboxComponent.getHitbox().y, this.hitboxComponent.getHitbox().width, this.hitboxComponent.getHitbox().height);
            }
        }
    }
    getInventoryUI() {
        return this.hotbarUi;
    }
    setImage(img) {
        this.img = img;
    }
}
