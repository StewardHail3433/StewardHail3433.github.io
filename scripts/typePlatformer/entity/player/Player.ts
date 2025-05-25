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
import { ToolItem } from "../../item/tools/ToolItem.js";
import { rectCorners } from "../../utils/Collisions.js";
import { drawRoatatedImage } from "../../utils/ImageManipulation.js";

export class Player extends Entity {
    private name: string;
    private controls = {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        inventory: 'e',
        break: "MLeft",
        useTool: "MLeft",
        place: "MRight",
        drop: "q",
        selectSlot0: "1",
        selectSlot1: "2",
        selectSlot2: "3",
        selectSlot3: "4",
        selectSlot4: "5",
        selectSlot5: "6",
        selectSlot6: "7",
        useItem: "MRight"
    };
    private touchMode = false;
    private frame = 0;
    private img: HTMLImageElement;
    private isBreaking: boolean = false;
    private usingTool: boolean = true;
    private toolHitbox: {pts: number[][], angle: number} = {pts: [], angle: -90};
    private directionChanged = false;

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
        useTool: string,
        place: string,
        drop: string
        selectSlot0: string,
        selectSlot1: string,
        selectSlot2: string,
        selectSlot3: string,
        selectSlot4: string,
        selectSlot5: string,
        selectSlot6: string
        useItem: string
    } = {
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        inventory: 'e',
        break: "MLeft",
        useTool: "MLeft",
        place: "MRight",
        drop: "q",
        selectSlot0: "1",
        selectSlot1: "2",
        selectSlot2: "3",
        selectSlot3: "4",
        selectSlot4: "5",
        selectSlot5: "6",
        selectSlot6: "7",
        useItem: "MRight"
    }) {
        this.controls = controls;
    }

    public update(): void {
        this.velocity = {x:0, y:0};
        if (Constants.INPUT_HANDLER.checkControl(this.controls.up)) {
            if(!this.directionChanged && this.direction != "up") {
                this.directionChanged = true;
            } else {
                this.directionChanged = false;
            }
            this.direction = "up";
            this.velocity.y = -this.speed;
        } 
        if (Constants.INPUT_HANDLER.checkControl(this.controls.down)) {
            if(!this.directionChanged && this.direction != "down") {
                this.directionChanged = true;
            } else {
                this.directionChanged = false;
            }
            this.direction = "down";
            this.velocity.y = this.speed;
        }
        if (Constants.INPUT_HANDLER.checkControl(this.controls.left)) {
            if(!this.directionChanged && this.direction != "left") {
                this.directionChanged = true;
            } else {
                this.directionChanged = false;
            }
            this.direction = "left";
            this.velocity.x = -this.speed;
        }
        if (Constants.INPUT_HANDLER.checkControl(this.controls.right)) {
            if(!this.directionChanged && this.direction != "right") {
                this.directionChanged = true;
            } else {
                this.directionChanged = false;
            }
            this.direction = "right";
            this.velocity.x = this.speed;
        }

        if(Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot0)) {
            this.hotbar.setSelecteSlot(0);
        } else if(Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot1)) {
            this.hotbar.setSelecteSlot(1);
        } else if(Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot2)) {
            this.hotbar.setSelecteSlot(2);
        } else if(Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot3)) {
            this.hotbar.setSelecteSlot(3);
        } else if(Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot4)) {
            this.hotbar.setSelecteSlot(4);
        } else if(Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot5)) {
            this.hotbar.setSelecteSlot(5);
        } else if(Constants.INPUT_HANDLER.checkControl(this.controls.selectSlot6)) {
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

        if(Constants.INPUT_HANDLER.checkControl(this.controls.useTool)) {
            this.usingTool = true;
        } else {
            this.usingTool = false;
        }

        super.update();
        this.updateToolItem();
    }

    private updateToolItem() {

        if(this.hotbar.getSelecteSlot().getItem() instanceof ToolItem) {
            const tool = this.hotbar.getSelecteSlot().getItem() as ToolItem;
            const playerHitbox = this.hitboxComponent.getHitbox()
            const playerCenterX = playerHitbox.x + playerHitbox.width/2;
            const playerCenterY = playerHitbox.y + playerHitbox.height/2;

            this.toolHitbox.pts = rectCorners({...tool.getHitbox(), x: playerCenterX - tool.getHitbox().width/2, y: playerCenterY - tool.getHitbox().height});

            const startAngle = this.getDirectionAsAngle() - tool.getSwingAngleSettings().totalRotationAmount / 2;
            const endAngle = this.getDirectionAsAngle() + tool.getSwingAngleSettings().totalRotationAmount / 2;

            if (this.directionChanged) {
                this.toolHitbox.angle = startAngle;
            }

            this.toolHitbox.angle += tool.getSwingAngleSettings().step;

            if (this.toolHitbox.angle > endAngle) {
                this.toolHitbox.angle = startAngle;
            }

            // https://stackoverflow.com/questions/2259476/rotating-a-point-about-another-point-2d
            for(let i = 0; i < this.toolHitbox.pts.length; i++) {
                const originalX = this.toolHitbox.pts[i][0];
                const originalY = this.toolHitbox.pts[i][1];
                this.toolHitbox.pts[i] = [Math.cos(this.toolHitbox.angle*(Math.PI/180)) * (originalX-playerCenterX) - Math.sin(this.toolHitbox.angle*(Math.PI/180)) * (originalY-playerCenterY) + playerCenterX,
                                Math.sin(this.toolHitbox.angle*(Math.PI/180)) * (originalX-playerCenterX) + Math.cos(this.toolHitbox.angle*(Math.PI/180)) * (originalY-playerCenterY) + playerCenterY]
            }
        }
    }

    private getDirectionAsAngle() {
        return (this.direction == "right" ? 90 : (this.direction == "down" ? 180 : (this.direction == "left" ? 270 : 0)));
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
        const hitbox = this.hitboxComponent.getHitbox();
        if(this.velocity.x != 0 || this.velocity.y != 0) {
            ctx.imageSmoothingEnabled = false;
            if(this.direction === "up" || this.direction === "down") {
                if(this.frame % 40  < 10) {
                    if(this.direction === "down") {
                        ctx.drawImage(this.img, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 40  < 20) {
                    if(this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 40  < 30) {
                    if(this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*2, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*2, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 40  < 40) {
                    if(this.direction === "down") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*3, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*3, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
            } else {
                if(this.frame % 80  < 10) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, 0, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 20) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 30) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*2, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*2, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 40) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*4, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*4, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 50) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*3, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*3, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80 < 60) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*4, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*4, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 70) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*5, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*5, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                } else if(this.frame % 80  < 80) {
                    if(this.direction === "left") {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    } else {
                        ctx.drawImage(this.img, Constants.TILE_SIZE*1, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
                    }
                }
            }
        } else {
            if(this.direction === "up") {
                ctx.drawImage(this.img, 0, Constants.TILE_SIZE*1, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            } else if(this.direction === "down") {
                ctx.drawImage(this.img, 0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            } else if(this.direction === "right") {
                ctx.drawImage(this.img, 0, Constants.TILE_SIZE*3, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            } else if(this.direction === "left") {
                ctx.drawImage(this.img, Constants.TILE_SIZE*2, Constants.TILE_SIZE*2, Constants.TILE_SIZE, Constants.TILE_SIZE, hitbox.x + (hitbox.width / 2) - (Constants.TILE_SIZE / 2), hitbox.y + (hitbox.height) - Constants.TILE_SIZE, Constants.TILE_SIZE, Constants.TILE_SIZE);
            }
        }
        this.renderItem(ctx);
        if(Constants.INPUT_HANDLER.getKeyToggled()["F3"] && Constants.INPUT_HANDLER.getKeyToggled()["b"]) {
            super.render(ctx);
        }
    }

    public renderItem(ctx: CanvasRenderingContext2D) {

        if(this.usingTool && this.hotbar.getSelecteSlot().getItem() instanceof ToolItem) {

            ctx.strokeStyle = "red";
            ctx.lineWidth = 0.5;

            // ctx.moveTo(this.toolHitbox.pts[0][0], this.toolHitbox.pts[0][1]);
            // ctx.beginPath()
            // for(let i = 0; i < this.toolHitbox.pts.length; i++) {
            //     ctx.lineTo(this.toolHitbox.pts[i][0], this.toolHitbox.pts[i][1])
            // }
            
            // ctx.lineTo(this.toolHitbox.pts[0][0], this.toolHitbox.pts[0][1])
            // ctx.closePath()
            // ctx.stroke()

            drawRoatatedImage(ctx, this.hotbar.getSelecteSlot().getItem().getImage()!, {x: this.toolHitbox.pts[0][0], y: this.toolHitbox.pts[0][1]}, this.toolHitbox.angle * (Math.PI/180))
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

    public setToolUsing(bool: boolean) {
        this.usingTool = bool;
    }
}