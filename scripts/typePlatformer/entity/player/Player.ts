import { it } from "node:test";
import { HealthComponent } from "../../components/HealthComponent.js";
import { HitboxComponent } from "../../components/HitboxComponent.js";
import { UIInventory } from "../../components/ui/inventory/UIInventory.js";
import { UIComponent } from "../../components/ui/UIComponent.js";
import { UIComponentButton } from "../../components/ui/UIComponentButton.js";
import { Inventory } from "../../inventory/Inventory.js";
import { Item } from "../../item/Item.js";
import { Items } from "../../item/Items.js";
import { Constants } from "../../utils/Constants.js";
import { ImageLoader } from "../../utils/ImageLoader.js";
import { Entity } from "../Entity.js";
import { Slot } from "../../inventory/Slot.js";

export class Player extends Entity {
    private name: string;
    private controls = {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        inventory: 'e',
        break: "MLeft",
        place: "MRight",
        drop: "q"
    };
    private touchMode = false;
    private frame = 0;
    private img: HTMLImageElement;
    private isBreaking: boolean = false;

    private inventory: Inventory =  new Inventory(14, "mainInventory");
    private hotbar: Inventory =  new Inventory(7, "hotbar");

    private movementButtons = [new UIComponentButton((document.getElementById(Constants.CANVAS_ID) as HTMLCanvasElement), {x:10, y:270, width: 40, height: 40}, {red: 255, green:255, blue: 255}, false, "<-", undefined, 15, "center", {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
        Constants.INPUT_HANDLER.getKeys()[this.controls.left] = false;
    }, () => {
        Constants.INPUT_HANDLER.getKeys()[this.controls.left] = true;
    }), new UIComponentButton((document.getElementById(Constants.CANVAS_ID) as HTMLCanvasElement), {x:55, y:270, width: 40, height: 40}, {red: 255, green:255, blue: 255}, false, "v", undefined, 15, "center", {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
        Constants.INPUT_HANDLER.getKeys()[this.controls.down] = false;
    }, () => {
        Constants.INPUT_HANDLER.getKeys()[this.controls.down] = true;
    }), new UIComponentButton((document.getElementById(Constants.CANVAS_ID) as HTMLCanvasElement), {x:100, y:270, width: 40, height: 40}, {red: 255, green:255, blue: 255}, false, "->", undefined, 15, "center", {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
        Constants.INPUT_HANDLER.getKeys()[this.controls.right] = false;
    },() => {
        Constants.INPUT_HANDLER.getKeys()[this.controls.right] = true;
    }), new UIComponentButton((document.getElementById(Constants.CANVAS_ID) as HTMLCanvasElement), {x:55, y:225, width: 40, height: 40}, {red: 255, green:255, blue: 255}, false, "^", undefined, 15, "center", {red:200,green:200, blue:200}, undefined, this.hitboxComponent.getColor(), undefined, () => {
        Constants.INPUT_HANDLER.getKeys()[this.controls.up] = false;
    }, () => {
        Constants.INPUT_HANDLER.getKeys()[this.controls.up] = true;
    })]

    private isArrows = false;

    constructor(name: string, healthComponent: HealthComponent, hitboxComponent: HitboxComponent) {
        super(healthComponent, hitboxComponent);
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



        Constants.COMMAND_SYSTEM.addCommand("tp", (args:string[]) => {
            this.hitboxComponent.setHitbox({...hitboxComponent.getHitbox(), x: parseFloat(args[0]), y: parseFloat(args[1])});
        });

        Constants.COMMAND_SYSTEM.addCommand("speed", (args:string[]) => {
            this.speed = parseFloat(args[0]);
        });

        Constants.COMMAND_SYSTEM.addCommand("give", (args:string[]) => {
            let slot = new Slot(Items.getItemById(args[1]), parseInt(args[2]));
            if(args[0] == "self") {
                slot = Inventory.transferItems(this.hotbar, slot);
            }
        });

        Constants.COMMAND_SYSTEM.addCommand("clear", (args:string[]) => {
            if(args[0] == "self") {
                this.inventory.clear();
                this.hotbar.clear();
            }
        });

        Constants.COMMAND_SYSTEM.addCommand("layer", (args:string[]) => {
            this.layer = parseInt(args[0]);    
        })

        Constants.COMMAND_SYSTEM.addCommand("setControl", (args:string[]) => {
            // https://stackoverflow.com/questions/58960077/how-to-check-if-a-strongly-typed-object-contains-a-given-key-in-typescript-witho
            if(args[0] in this.controls) {
                this.controls[args[0] as keyof typeof this.controls] = args[1];
            }
        })
    }

    public setControls(controls: {
        up: string,
        down: string,
        left: string,
        right: string,
        inventory: string,
        break: string,
        place: string,
        drop: string
    } = {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        inventory: 'e',
        break: "MLeft",
        place: "MRight",
        drop: "q"
    }) {
        this.controls = controls;
    }

    public update(): void {
        this.velocity = {x:0, y:0};
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

        if(Constants.INPUT_HANDLER.checkControl("1")) {
            this.hotbar.setSelecteSlot(0);
        } else if(Constants.INPUT_HANDLER.checkControl("2")) {
            this.hotbar.setSelecteSlot(1);
        } else if(Constants.INPUT_HANDLER.checkControl("3")) {
            this.hotbar.setSelecteSlot(2);
        } else if(Constants.INPUT_HANDLER.checkControl("4")) {
            this.hotbar.setSelecteSlot(3);
        } else if(Constants.INPUT_HANDLER.checkControl("5")) {
            this.hotbar.setSelecteSlot(4);
        } else if(Constants.INPUT_HANDLER.checkControl("6")) {
            this.hotbar.setSelecteSlot(5);
        } else if(Constants.INPUT_HANDLER.checkControl("7")) {
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

        if(this.touchMode) {
            for(var button of  this.movementButtons) {
                button.show();
            }
        } else {
            for(var button of  this.movementButtons) {
                button.hide();
            }
        }
        this.frame += 1;

        if(Constants.INPUT_HANDLER.checkControl("p")) {
            if(this.isArrows) {
                this.setControls();
                this.isArrows = false;
            } else {
                this.setControls({...this.controls, up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight"});
                this.isArrows = true;
            }
            Constants.INPUT_HANDLER.setKey("p", false);
        }

        super.update();
    }

    public getControls() {
        return {...this.controls};
    }
    
    public setName(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }
    public isMoving(): boolean {
        return this.velocity.x != 0 || this.velocity.y != 0;
    }

    public getMovementButton(canvas: HTMLCanvasElement): UIComponent[] {
        return this.movementButtons;
    }

    public setToKeyboard() {
        this.touchMode = false;
    }
    public setToTouch() {
        this.touchMode = true;
    }

    public getTouchMode(): boolean {
        return this.touchMode;
    }

    public render(ctx: CanvasRenderingContext2D) {
        if(this.velocity.x != 0 || this.velocity.y != 0) {
            ctx.imageSmoothingEnabled = false;
            if(this.direction === "up" || this.direction === "down") {
                if(this.frame % 40  < 10) {
                    if(this.direction === "down") {
                        ctx.drawImage(this.img, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 40  < 20) {
                    if(this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 40  < 30) {
                    if(this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*2, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*2, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 40  < 40) {
                    if(this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*3, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*3, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
            } else {
                if(this.frame % 80  < 10) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 20) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 30) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*2, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*2, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 40) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*4, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*4, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 50) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*3, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*3, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80 < 60) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*4, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*4, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 70) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*5, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*5, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 80) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
            }
        } else {
            if(this.direction === "up") {
                ctx.drawImage(this.img, 0, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            } else if(this.direction === "down") {
                ctx.drawImage(this.img, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            } else if(this.direction === "right") {
                ctx.drawImage(this.img, 0, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            } else if(this.direction === "left") {
                ctx.drawImage(this.img, Constants.TILE_SIZE*2, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, this.hitboxComponent.getHitbox().x + (this.hitboxComponent.getHitbox().width / 2) - (Constants.TILE_SIZE / 2), this.hitboxComponent.getHitbox().y + (this.hitboxComponent.getHitbox().height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            }
        }
        if(Constants.INPUT_HANDLER.getKeyToggled()["F3"] && Constants.INPUT_HANDLER.getKeyToggled()["b"]) {
            super.render(ctx);
        }
    }

    public setImage(img: HTMLImageElement) {
        this.img = img;
    }

    public getHotbarInventory(): Inventory {
        return this.hotbar;
    }

    public getMainInventory(): Inventory {
        return this.inventory
    }

    public getBreaking(): boolean {
        return this.isBreaking;
    }

    public setBreaking(bool: boolean) {
        this.isBreaking = bool;
    }
}