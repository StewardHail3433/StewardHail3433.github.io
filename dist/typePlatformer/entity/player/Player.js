import { UIComponentButton } from "../../components/ui/UIComponentButton.js";
import { Inventory } from "../../inventory/Inventory.js";
import { Items } from "../../item/Items.js";
import { Constants } from "../../utils/Constants.js";
import { ImageLoader } from "../../utils/ImageLoader.js";
import { Entity } from "../Entity.js";
import { Slot } from "../../inventory/Slot.js";
export class Player extends Entity {
    constructor(name, healthComponent, hitboxComponent) {
        super(healthComponent, hitboxComponent);
        this.controls = {
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',
            inventory: 'e',
            break: "MLeft",
            place: "MRight",
            drop: "q",
            selectSlot0: "1",
            selectSlot1: "2",
            selectSlot2: "3",
            selectSlot3: "4",
            selectSlot4: "5",
            selectSlot5: "6",
            selectSlot6: "7",
        };
        this.touchMode = false;
        this.frame = 0;
        this.isBreaking = false;
        this.inventory = new Inventory(14, "mainInventory");
        this.hotbar = new Inventory(7, "hotbar");
        this.movementButtons = [new UIComponentButton(document.getElementById(Constants.CANVAS_ID), { x: 10, y: 270, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "<-", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                Constants.INPUT_HANDLER.getKeys()[this.controls.left] = false;
            }, () => {
                Constants.INPUT_HANDLER.getKeys()[this.controls.left] = true;
            }), new UIComponentButton(document.getElementById(Constants.CANVAS_ID), { x: 55, y: 270, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "v", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                Constants.INPUT_HANDLER.getKeys()[this.controls.down] = false;
            }, () => {
                Constants.INPUT_HANDLER.getKeys()[this.controls.down] = true;
            }), new UIComponentButton(document.getElementById(Constants.CANVAS_ID), { x: 100, y: 270, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "->", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                Constants.INPUT_HANDLER.getKeys()[this.controls.right] = false;
            }, () => {
                Constants.INPUT_HANDLER.getKeys()[this.controls.right] = true;
            }), new UIComponentButton(document.getElementById(Constants.CANVAS_ID), { x: 55, y: 225, width: 40, height: 40 }, { red: 255, green: 255, blue: 255 }, false, "^", undefined, 15, "center", { red: 200, green: 200, blue: 200 }, undefined, this.hitboxComponent.getColor(), undefined, () => {
                Constants.INPUT_HANDLER.getKeys()[this.controls.up] = false;
            }, () => {
                Constants.INPUT_HANDLER.getKeys()[this.controls.up] = true;
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
        this.inventory.getSlot(12).setItem(Items.SWORD, 1);
        this.hotbar.setSelecteSlot(0);
        this.setToTouch();
        this.img = ImageLoader.getImages()[4];
        Constants.COMMAND_SYSTEM.addCommand("tp", (args) => {
            this.hitboxComponent.setHitbox(Object.assign(Object.assign({}, hitboxComponent.getHitbox()), { x: parseFloat(args[0]), y: parseFloat(args[1]) }));
        });
        Constants.COMMAND_SYSTEM.addCommand("speed", (args) => {
            this.speed = parseFloat(args[0]);
        });
        Constants.COMMAND_SYSTEM.addCommand("give", (args) => {
            let slot = new Slot(Items.getItemById(args[1]), parseInt(args[2]));
            if (args[0] == "self") {
                slot = Inventory.transferItems(this.hotbar, slot);
            }
        });
        Constants.COMMAND_SYSTEM.addCommand("clear", (args) => {
            if (args[0] == "self") {
                this.inventory.clear();
                this.hotbar.clear();
            }
        });
        Constants.COMMAND_SYSTEM.addCommand("layer", (args) => {
            this.layer = parseInt(args[0]);
        });
        Constants.COMMAND_SYSTEM.addCommand("setControl", (args) => {
            // https://stackoverflow.com/questions/58960077/how-to-check-if-a-strongly-typed-object-contains-a-given-key-in-typescript-witho
            if (args[0] in this.controls) {
                this.controls[args[0]] = args[1];
            }
        });
    }
    setControls(controls = {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        inventory: 'e',
        break: "MLeft",
        place: "MRight",
        drop: "q",
        selectSlot0: "1",
        selectSlot1: "2",
        selectSlot2: "3",
        selectSlot3: "4",
        selectSlot4: "5",
        selectSlot5: "6",
        selectSlot6: "7",
    }) {
        this.controls = controls;
    }
    update() {
        this.velocity = { x: 0, y: 0 };
        if (Constants.INPUT_HANDLER.checkControl(this.controls.up)) {
            this.direction = "up";
            this.velocity.y = -this.speed;
        }
        if (Constants.INPUT_HANDLER.checkControl(this.controls.down)) {
            this.direction = "down";
            this.velocity.y = this.speed;
        }
        if (Constants.INPUT_HANDLER.checkControl(this.controls.left)) {
            this.direction = "left";
            this.velocity.x = -this.speed;
        }
        if (Constants.INPUT_HANDLER.checkControl(this.controls.right)) {
            this.direction = "right";
            this.velocity.x = this.speed;
        }
        if (Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot0)) {
            this.hotbar.setSelecteSlot(0);
        }
        else if (Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot1)) {
            this.hotbar.setSelecteSlot(1);
        }
        else if (Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot2)) {
            this.hotbar.setSelecteSlot(2);
        }
        else if (Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot3)) {
            this.hotbar.setSelecteSlot(3);
        }
        else if (Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot4)) {
            this.hotbar.setSelecteSlot(4);
        }
        else if (Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot5)) {
            this.hotbar.setSelecteSlot(5);
        }
        else if (Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot6)) {
            this.hotbar.setSelecteSlot(6);
        }
        // if(Constants.INPUT_HANDLER.checkControl("e")) {
        //     if(this.invUi.ishidden()) {
        //         this.invUi.show();
        //     } else {
        //         this.invUi.hide();
        //     }
        //     Constants.INPUT_HANDLER.checkControl("e"] = false;
        // }
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
        if (Constants.INPUT_HANDLER.checkControl("p")) {
            if (this.isArrows) {
                this.setControls();
                this.isArrows = false;
            }
            else {
                this.setControls(Object.assign(Object.assign({}, this.controls), { up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight" }));
                this.isArrows = true;
            }
            Constants.INPUT_HANDLER.setKey("p", false);
        }
        super.update();
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
    }
    setToTouch() {
        this.touchMode = true;
    }
    getTouchMode() {
        return this.touchMode;
    }
    render(ctx) {
        const hitbox = this.hitboxComponent.getHitbox();
        if (this.velocity.x != 0 || this.velocity.y != 0) {
            ctx.imageSmoothingEnabled = false;
            if (this.direction === "up" || this.direction === "down") {
                if (this.frame % 40 < 10) {
                    if (this.direction === "down") {
                        ctx.drawImage(this.img, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE * 1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
                else if (this.frame % 40 < 20) {
                    if (this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, Constants.TILE_SIZE * 1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
                else if (this.frame % 40 < 30) {
                    if (this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 2, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 2, Constants.TILE_SIZE * 1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
                else if (this.frame % 40 < 40) {
                    if (this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 3, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 3, Constants.TILE_SIZE * 1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
            }
            else {
                if (this.frame % 80 < 10) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
                else if (this.frame % 80 < 20) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
                else if (this.frame % 80 < 30) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 2, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 2, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
                else if (this.frame % 80 < 40) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 4, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 4, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
                else if (this.frame % 80 < 50) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 3, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 3, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
                else if (this.frame % 80 < 60) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 4, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 4, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
                else if (this.frame % 80 < 70) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 5, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 5, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
                else if (this.frame % 80 < 80) {
                    if (this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                    else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE * 1, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
            }
        }
        else {
            if (this.direction === "up") {
                ctx.drawImage(this.img, 0, Constants.TILE_SIZE * 1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            }
            else if (this.direction === "down") {
                ctx.drawImage(this.img, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            }
            else if (this.direction === "right") {
                ctx.drawImage(this.img, 0, Constants.TILE_SIZE * 3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            }
            else if (this.direction === "left") {
                ctx.drawImage(this.img, Constants.TILE_SIZE * 2, Constants.TILE_SIZE * 2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            }
        }
        if (Constants.INPUT_HANDLER.getKeyToggled()["F3"] && Constants.INPUT_HANDLER.getKeyToggled()["b"]) {
            super.render(ctx);
        }
    }
    setImage(img) {
        this.img = img;
    }
    getHotbarInventory() {
        return this.hotbar;
    }
    getMainInventory() {
        return this.inventory;
    }
    getBreaking() {
        return this.isBreaking;
    }
    setBreaking(bool) {
        this.isBreaking = bool;
    }
}
