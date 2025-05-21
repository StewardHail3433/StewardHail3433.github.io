import { UIComponent } from "../components/ui/UIComponent";
import { UIComponentButton } from "../components/ui/UIComponentButton";
import { UIComponentLabel } from "../components/ui/UIComponentLabel";
import { UIComponentSlider } from "../components/ui/UIComponentSlider";
import { AudioHandler } from "../utils/audio/AudioHandler";
import { Constants } from "../utils/Constants";

export class UIPauseHandler {

    private pauseComponent: UIComponent;
    private pauseMenuComponents: UIComponent[] = [];
    private settingsMenuComponents: UIComponent[] = [];
    private soundsMenuComponents: UIComponent[] = [];

    private screen: "none" | "pause" | "settings" | "sounds" = "none";

    constructor(canvas: HTMLCanvasElement, pauseComponent: UIComponent) {
        this.pauseComponent = pauseComponent;

        this.initPauseMenu(canvas);
        this.initSettingsMenu(canvas);
        this.initSoundMenu(canvas);


        Constants.COMMAND_SYSTEM.addCommand("pause", (args: string[]) => {
            if(args[0] == "none" || "pause" || "settings" || "sounds") {
                this.screen = args[0] as "none" | "pause" | "settings" | "sounds";
            }
        })

    }

    private initPauseMenu(canvas: HTMLCanvasElement) {
        const buttonWidth = 120;
        const buttonHeight = 40;
        const col = 1;
        const row = 3;
        const spacingX = (this.pauseComponent.getHitbox().width - buttonWidth*col) / (col + 1);
        const spacingY = (this.pauseComponent.getHitbox().height - buttonHeight*row) / (row + 1);
        const startX = spacingX;
        const startY = spacingY;

        const color = { red: 150, green: 150, blue: 150, alpha: 1 };
        const hoverColor = { red: 100, green: 100, blue: 100, alpha: 1 };
        const clickColor = { red: 200, green: 200, blue: 200, alpha: 1 };

        const buttonInfo = 
        [
            ["Return to Game", () => {
                this.screen = "none";
            }],
            ["Settings", () => {
                this.screen = "settings";
            }],
            ["Quit", () => {
                console.log("Why you quit");
            }]
        ];

        const fun = (i: number) => {
                        if(i >= buttonInfo.length) {
                            return "unknown";
                        }
                        return buttonInfo[i][0] as string;
                    }
        
        const fun2 = (i: number) => {
                        if(i >= buttonInfo.length) {
                            return  () => {
                                console.log("unknown");
                            };
                        }
                        return buttonInfo[i][1] as (() => void);
                    }


        for (let i = 0; i < row*col; i++) {
            const currentCol = i % col;
            const currentRow = Math.floor(i / col);

            const x = startX + currentCol * (buttonWidth + spacingX);
            const y = startY + currentRow * (buttonHeight + spacingY);

            this.pauseMenuComponents.push(
                new UIComponentButton(
                    canvas,
                    { x, y, width: buttonWidth, height: buttonHeight},
                    color,
                    true, 
                    fun(i),
                    { red: 255, green: 255, blue: 255, alpha: 1 },
                    16,
                    "center",
                    hoverColor,
                    { red: 255, green: 255, blue: 255, alpha: 1 },
                    clickColor,
                    undefined,
                    fun2(i),
                    undefined,
                    undefined,
                    false
                )
            )
            this.pauseMenuComponents[this.pauseMenuComponents.length - 1].setParentComponent(this.pauseComponent);
        }
    }

    private initSettingsMenu(canvas: HTMLCanvasElement) {
        const buttonWidth = 120;
        const buttonHeight = 40;
        const col = 3;
        const row = 1;
        const spacingX = (this.pauseComponent.getHitbox().width - buttonWidth*col) / (col + 1);
        const spacingY = (this.pauseComponent.getHitbox().height - buttonHeight*row) / (row + 1);
        const startX = spacingX;
        const startY = spacingY;

        const color = { red: 150, green: 150, blue: 150, alpha: 1 };
        const hoverColor = { red: 100, green: 100, blue: 100, alpha: 1 };
        const clickColor = { red: 200, green: 200, blue: 200, alpha: 1 };

        const buttonInfo = 
        [
            ["Controls", () => {
                console.log("Controls Screen");
            }],
            ["Sounds", () => {
                this.screen = "sounds";
            }],
            ["Back", () => {
                this.screen = "pause";
            }]
        ];

        const fun = (i: number) => {
                        if(i >= buttonInfo.length) {
                            return "unknown";
                        }
                        return buttonInfo[i][0] as string;
                    }
        
        const fun2 = (i: number) => {
                        if(i >= buttonInfo.length) {
                            return  () => {
                                console.log("unknown");
                            };
                        }
                        return buttonInfo[i][1] as (() => void);
                    }


        for (let i = 0; i < row*col; i++) {
            const currentCol = i % col;
            const currentRow = Math.floor(i / col);

            const x = startX + currentCol * (buttonWidth + spacingX);
            const y = startY + currentRow * (buttonHeight + spacingY);

            this.settingsMenuComponents.push(
                new UIComponentButton(
                    canvas,
                    { x, y, width: buttonWidth, height: buttonHeight},
                    color,
                    true, 
                    fun(i),
                    { red: 255, green: 255, blue: 255, alpha: 1 },
                    16,
                    "center",
                    hoverColor,
                    { red: 255, green: 255, blue: 255, alpha: 1 },
                    clickColor,
                    undefined,
                    fun2(i),
                    undefined,
                    undefined,
                    false
                )
            )
            this.settingsMenuComponents[this.settingsMenuComponents.length - 1].setParentComponent(this.pauseComponent);
        }
    }

    private initSoundMenu(canvas: HTMLCanvasElement) {
        const buttonWidth = 120;
        const buttonHeight = 40;
        const sliderWidth = 160;
        const sliderHeight = 15;
        const col = 1;
        const row = 3;
        const spacingX = (this.pauseComponent.getHitbox().width - buttonWidth*col) / (col + 1);
        const spacingY = (this.pauseComponent.getHitbox().height - buttonHeight*row) / (row + 1);
        const startX = spacingX;
        const startY = spacingY;

        const color = { red: 150, green: 150, blue: 150, alpha: 1 };
        const hoverColor = { red: 100, green: 100, blue: 100, alpha: 1 };
        const clickColor = { red: 200, green: 200, blue: 200, alpha: 1 };

        // this.soundsMenuComponents.push(new UIComponentSlider({x:50, y:50, width: 160, height: 15}, color, true, hoverColor, 0.5, (value: number) => {
        //     console.log(value);
        //     AudioHandler.setVolume("music", value);
        // }))
        const componentInfo = 
        [
            ["Slider", "Music Volume", (value: number) => {
                console.log(value)
                AudioHandler.setVolume("music", value);
            }],
            ["Slider", "SFX Volume", (value: number) => {
                AudioHandler.setVolume("sfx", value);
            }],
            ["Button", "Back", () => {
                    this.screen = "pause";
            }]
        ];



        const fun = (i: number) => {
                        if(i >= componentInfo.length) {
                            return "unknown";
                        }
                        return componentInfo[i][1] as string;
                    }
        
        const fun2 = (i: number) => {
                        if(i >= componentInfo.length) {
                            return  () => {
                                console.log("unknown");
                            };
                        }
                        return componentInfo[i][2] as (() => void);
                    }

        const fun3 = (i: number) => {
                        if(i >= componentInfo.length) {
                            return "None";
                        }
                        return componentInfo[i][0] as string;
                    }


        for (let i = 0; i < row*col; i++) {
            const currentCol = i % col;
            const currentRow = Math.floor(i / col);

            const x = startX + currentCol * (buttonWidth + spacingX);
            const y = startY + currentRow * (buttonHeight + spacingY);

            if(fun3(i) == "Button") {
                this.soundsMenuComponents.push(
                    new UIComponentButton(
                        canvas,
                        { x, y, width: buttonWidth, height: buttonHeight},
                        color,
                        true, 
                        fun(i),
                        { red: 255, green: 255, blue: 255, alpha: 1 },
                        16,
                        "center",
                        hoverColor,
                        { red: 255, green: 255, blue: 255, alpha: 1 },
                        clickColor,
                        undefined,
                        fun2(i),
                        undefined,
                        undefined,
                        false
                    )
                )
                this.soundsMenuComponents[this.soundsMenuComponents.length - 1].setParentComponent(this.pauseComponent);
            } else if(fun3(i) == "Slider"){
                this.soundsMenuComponents.push( 
                    new UIComponentLabel(
                        { x:x+ buttonWidth/2 - sliderWidth/2, y: y - 8, width: sliderWidth, height: 8 },
                        { red: 255, green: 255, blue: 255, alpha: 0.001},
                        true,
                        fun(i),
                        { red: 255, green: 255, blue: 255, alpha: 1 },
                        8,
                        "center"
                    ),
                     new UIComponentSlider({x:x+ buttonWidth/2 - sliderWidth/2, y, width: sliderWidth, height: sliderHeight}, color, true, hoverColor, 1.0, fun2(i)));
                this.soundsMenuComponents[this.soundsMenuComponents.length - 1].setParentComponent(this.pauseComponent);
                this.soundsMenuComponents[this.soundsMenuComponents.length - 2].setParentComponent(this.pauseComponent);
            }
        }
    }


    render(ctx: CanvasRenderingContext2D) {
        if(this.screen == "none") {
            return;
        }
        this.pauseComponent.render(ctx);
        if(this.screen == "pause") {
            for(let i = 0; i < this.pauseMenuComponents.length; i++) {
                this.pauseMenuComponents[i].render(ctx);
            }
        } else if(this.screen == "settings") {
            for(let i = 0; i < this.settingsMenuComponents.length; i++) {
                this.settingsMenuComponents[i].render(ctx);
            }
        } else if(this.screen == "sounds") {
            for(let i = 0; i < this.soundsMenuComponents.length; i++) {
                this.soundsMenuComponents[i].render(ctx);
            }
        }
    } 
    
    update() {
        if(Constants.INPUT_HANDLER.checkControl("Escape") && this.screen == "none") {
            this.screen = "pause";
        }
        this.hideAll()
        if(this.screen == "pause") {
            for(let i = 0; i < this.pauseMenuComponents.length; i++) {
                this.pauseMenuComponents[i].show()
                this.pauseMenuComponents[i].update();
            }
        } else if(this.screen == "settings") {
            for(let i = 0; i < this.settingsMenuComponents.length; i++) {
                this.settingsMenuComponents[i].show()
                this.settingsMenuComponents[i].update();
            }
        } else if(this.screen == "sounds") {
            for(let i = 0; i < this.soundsMenuComponents.length; i++) {
                this.soundsMenuComponents[i].show()
                this.soundsMenuComponents[i].update();
            }
        }
        
    }

    private hideAll() {
        for(let i = 0; i < this.pauseMenuComponents.length; i++) {
            this.pauseMenuComponents[i].hide();
        }
        for(let i = 0; i < this.settingsMenuComponents.length; i++) {
            this.settingsMenuComponents[i].hide();
        }
        for(let i = 0; i < this.soundsMenuComponents.length; i++) {
            this.soundsMenuComponents[i].hide();
        }
    }

    setPauseScreen(screen: "none" | "pause" | "settings") {
        this.screen = screen;
    }
}