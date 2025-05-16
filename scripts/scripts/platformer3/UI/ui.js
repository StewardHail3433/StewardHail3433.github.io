import { CONSTANTS } from "../utils/gameConst.js";

export default class UI {

    constructor(/** @type {CanvasRenderingContext2D} */ ctxMain, player, camera, enemies, state, sound) {
        this.canvasUI = document.createElement('canvas');
        this.canvasUI.width = ctxMain.canvas.width;
        this.canvasUI.height = ctxMain.canvas.height;
        /** @type {CanvasRenderingContext2D} */ this.ctxUI = this.canvasUI.getContext('2d');

        this.toggles = {
            showUI: true, // all ui

            showDevUI: false, // dev
        }
        this.enemies = enemies;
        this.devValues = {
            speed: {
                name: "speed",
                getter: () => player.speed/CONSTANTS.movementScale,
                setter: (x) => player.speed = x*CONSTANTS.movementScale,
                editable:true,
                focus: false
            },
            gravity: {
                name: "gravity",
                getter: () => player.gravity/CONSTANTS.movementScale,
                setter: (x) => player.gravity = x*CONSTANTS.movementScale,
                increment: 0.05,
                editable:true,
                focus: false
            },
            liquidGravity: {
                name: "liquidGravity",
                getter: () => player.liquidGravity/CONSTANTS.movementScale,
                setter: (x) => player.liquidGravity = x*CONSTANTS.movementScale,
                increment: 0.2,
                editable:true,
                focus: false
            },
            jumpSpeed: {
                name: "jumpSpeed",
                getter: () => player.jumpSpeed/CONSTANTS.movementScale,
                setter: (x) => player.jumpSpeed = x*CONSTANTS.movementScale,
                editable:true,
                focus: false
            },
            width: {
                name: "width",
                getter: () => player.width,
                setter: (x) => player.width = x,
                editable: false,
                focus: false
            },
            height: {
                name: "height",
                getter: () => player.height,
                setter: (x) => player.height = x,
                editable: false,
                focus: false
            },
            x: {
                name: "x",
                getter: () => player.pos.x,
                setter: (x) => player.pos.x = x,
                editable: false,
                focus: false
            },
            y: {
                name: "y",
                getter: () => player.pos.y,
                setter: (x) => player.pos.y = x,
                editable: true,
                focus: false,
                increment: 100,
            },
            alive: {
                name: "alive",
                getter: () => player.alive,
                setter: (x) => player.alive = x,
                editable: true,
                focus: false,
                boolean: true,
            },
            noDeathMode: {
                name: "noDeathMode",
                getter: () => player.noDeathMode,
                setter: (x) => player.noDeathMode = x,
                editable: true,
                focus: false,
                boolean: true,
            },
            noEnemyDeath: {
                name: "noEnemyDeath",
                getter: () => this.enemies.length > 0 && this.enemies[0].noEnemyDeath,
                setter: (x) => {for(const enemy of this.enemies ){enemy.noEnemyDeath = x}},
                editable: true,
                focus: false,
                boolean: true,
            }
        };

        this.devRect = {
            width: ctxMain.canvas.width * (1/8),
            height: ctxMain.canvas.height,
            x: ctxMain.canvas.width - ctxMain.canvas.width * (1/8),
            y: 0,
            ySpacing: ctxMain.canvas.width * (1/8)/12.8*2,
            fontSize: ctxMain.canvas.width * (1/8)/12.8
        }
        this.pauseRect = {
                width: this.ctxUI.canvas.width*(8/10),
                height: this.ctxUI.canvas.height*(8/10),
                x: this.ctxUI.canvas.width*(1/10),
                y: this.ctxUI.canvas.height*(1/10),
                ySpacing: ctxMain.canvas.width * (8/10)/20.48,
                fontSize: ctxMain.canvas.height * (8/10)/21.04,
                buttons: {
                    width: this.ctxUI.canvas.width*(8/10)*(3/10),
                    height: this.ctxUI.canvas.height*(8/10)*(1/20),
                }
        }
        this.sound = sound;
        this.pauseMenuButtons = {
            return:{
                name:"Return Back"
            },
            sound:{
                name:"Sounds",
                slider: {
                    music: {
                        name: "Music",
                        getter: () => this.sound.getVolume("music"),
                        setter: (x) => {
                            this.sound.setVolume("music", x)
                        }
                    },
                    sfx: {
                        name: "SFX",
                        getter: () => this.sound.getVolume("sfx"),
                        setter: (x) => {
                            this.sound.setVolume("sfx", x)
                        }
                    },
                }
            }
        }
        
        this.ctxMain = ctxMain;
        this.player = player;
        this.camera = camera;
        this.state = state;
        this.pauseState = "none";
    }

    update(state) {
        this.state = state;
        if(state === "pause" && this.pauseState === "none") {
            this.pauseState = "main";
        }
        if (this.toggles.showDevUI) {
            this.updateDEV();
        }
    }

    updateDEV() {
        for(var key in this.devValues) {
            if (this.devValues.hasOwnProperty(key)) {
                this.devValues[key].value = this.devValues[key].getter();
            }
        }
    }
    
    render() {
        if (this.toggles.showUI) {
            this.ctxUI.clearRect(0, 0, this.canvasUI.width, this.canvasUI.height);
            this.ctxUI.fillStyle = "rgba(255, 0, 255, 1)";
            this.ctxUI.fillRect(0,0,16,16);
            if(this.state === "pause") {
                this.renderPause();
            }
            if (this.toggles.showDevUI) {
                this.renderDEV();
            }
            if(!this.player.alive) {
                this.renderDeath();
            }
            this.ctxMain.drawImage(this.canvasUI, 0, 0, this.ctxMain.canvas.width, this.ctxMain.canvas.height);
        }
    }
    renderPause() {
        this.ctxUI.fillStyle = "rgba(0, 0, 158, 0.5)";
        this.ctxUI.font = this.pauseRect.fontSize + 'px sans-serif';
        this.ctxUI.fillRect(this.pauseRect.x, this.pauseRect.y, this.pauseRect.width, this.pauseRect.height);

        let y = this.pauseRect.y;
        this.ctxUI.fillStyle = "rgba(0, 255, 0, 1)";
        if(this.pauseState === "main") {
            for(var key in this.pauseMenuButtons) {
                if (this.pauseMenuButtons.hasOwnProperty(key)) {
                    y += this.pauseRect.ySpacing;
                    
                    this.ctxUI.font = this.pauseRect.fontSize + 'px sans-serif';
    
                    var textString = this.pauseMenuButtons[key].name;
                    var textWidth = this.ctxUI.measureText(textString).width;
    
                    let x = this.ctxUI.canvas.width*(1/10) + (this.ctxUI.canvas.width*(8/10)/2) - (textWidth / 2);
                    let boxX = this.ctxUI.canvas.width/2 - this.pauseRect.buttons.width/2;
                    this.ctxUI.fillStyle = "rgba(189, 195, 199, 0.5)";
                    this.ctxUI.fillRect(boxX, y-this.pauseRect.fontSize, this.pauseRect.buttons.width, this.pauseRect.buttons.height);
                    this.ctxUI.fillStyle = "rgba(200, 235, 239, 0.5)";
                    this.ctxUI.fillText(textString, x, y);
                }
            }
        }
        if(this.pauseState === this.pauseMenuButtons.sound.name) {
            for(var key in this.pauseMenuButtons.sound) {
                if (this.pauseMenuButtons.sound.hasOwnProperty(key)) {
                    if(this.pauseMenuButtons.sound.name != this.pauseMenuButtons.sound[key]) {
                        if(this.pauseMenuButtons.sound.slider != undefined) {
                            for(var key in this.pauseMenuButtons.sound.slider) {
                                y += this.pauseRect.ySpacing;
                                this.ctxUI.font = this.pauseRect.fontSize + 'px sans-serif';
        
                                var textString = this.pauseMenuButtons.sound.slider[key].name + ": " + this.pauseMenuButtons.sound.slider[key].getter();
                                var textWidth = this.ctxUI.measureText(textString).width;
                
                                let x = this.ctxUI.canvas.width*(1/10) + (this.ctxUI.canvas.width*(8/10)/2) - (textWidth / 2);
                                let boxX = this.ctxUI.canvas.width/2 - this.pauseRect.buttons.width/2;

                                this.ctxUI.fillStyle = "rgba(189, 195, 199, 0.5)";
                                this.ctxUI.fillRect(boxX, y-this.pauseRect.fontSize, this.pauseRect.buttons.width, this.pauseRect.buttons.height);

                                this.ctxUI.fillStyle = "rgba(255, 255, 255, 0.5)";
                                let OldRange = (2 - 0)  
                                let NewRange = ((boxX +this.pauseRect.buttons.width) - boxX)  
                                let sliderX = (((this.pauseMenuButtons.sound.slider[key].getter() - 0) * NewRange) / OldRange) + boxX
                                this.ctxUI.fillRect(sliderX, y-this.pauseRect.fontSize, this.pauseRect.buttons.width/20, this.pauseRect.buttons.height*1);

                                this.ctxUI.fillStyle = "rgba(0, 0, 0, 0.5)";
                                this.ctxUI.fillText(textString, x, y);
                            }
                        }
                    }
                }
            }
        }

    }

    renderDeath() {
        this.ctxUI.fillStyle = "rgba(255, 255, 255, 1)";

        this.ctxUI.font = 20 + 'px sans-serif';

        let y = this.ctxMain.canvas.height/2 - 10
        var textString = "YOU DIED";
        var textWidth = this.ctxUI.measureText(textString).width;

        let x = (this.ctxMain.canvas.width/2) - (textWidth / 2);
        this.ctxUI.fillText(textString, x, y);
    }

    renderDEV() {
        this.camera.render();
        for(let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].renderDev();
        }

        this.ctxUI.fillStyle = "rgba(0, 0, 0, 0.25)";
        this.ctxUI.fillRect(this.devRect.x, this.devRect.y, this.devRect.width, this.devRect.height);
    
        let y = 0;
        for(var key in this.devValues) {
            if (this.devValues.hasOwnProperty(key)) {
                y += this.devRect.ySpacing;
                if(this.devValues[key].editable){
                    this.ctxUI.fillStyle = "rgba(255, 0, 0, 1)";
                    if(this.devValues[key].focus) {
                        this.ctxUI.fillStyle = "rgba(0, 0, 255, 1)";
                    }
                } else {
                    this.ctxUI.fillStyle = "rgba(255, 255, 255, 1)";
                    
                }
                this.ctxUI.font = this.devRect.fontSize + 'px sans-serif';

                var textString = this.devValues[key].name + ": " + this.devValues[key].value;
                var textWidth = this.ctxUI.measureText(textString).width;

                let x = this.devRect.x + (this.devRect.width/2) - (textWidth / 2);
                this.ctxUI.fillText(textString, x, y);
                this.ctxUI.fillStyle = "rgba(0, 255, 0, 1)";
                this.ctxUI.strokeRect(x, y-this.devRect.fontSize, textWidth, this.devRect.fontSize);
            }
        }
    
    }

    keyDownInput(/** @type {KeyboardEvent} */ key) {
        if (key === "F1") {
            if(this.toggles.showUI) {
                this.toggles.showUI = false;
                return;
            }
            if(!this.toggles.showUI) {
                this.toggles.showUI = true;
                return;
            }
        }
        if (key === "F3") {
            if(this.toggles.showDevUI) {
                this.toggles.showDevUI = false;
                return;
            }
            if(!this.toggles.showDevUI) {
                this.toggles.showDevUI = true;
                return;
            }
        } 
        if (this.toggles.showDevUI) {
            this.keyDownInputDEV(key);
        }
    }

    keyDownInputDEV(key) {
        for(var pkey in this.devValues) {
            if(this.devValues[pkey].focus) {
                if(this.devValues[pkey].increment != undefined){
                    if (key === "ArrowRight") {
                        this.devValues[pkey].setter(this.devValues[pkey].getter() + this.devValues[pkey].increment);
                    } 
                    if (key === "ArrowLeft") {
                        this.devValues[pkey].setter(this.devValues[pkey].getter() - this.devValues[pkey].increment);
                    } 
                } else {
                    if(this.devValues[pkey].boolean) {
                        if (key === "ArrowRight") {
                            this.devValues[pkey].setter(!this.devValues[pkey].getter())
                        }
                        if (key === "ArrowLeft") {
                            this.devValues[pkey].setter(!this.devValues[pkey].getter())
                        } 
                    } else {
                        if (key === "ArrowRight") {
                            this.devValues[pkey].setter(this.devValues[pkey].getter() + 1);
                        } 
                        if (key === "ArrowLeft") {
                            this.devValues[pkey].setter(this.devValues[pkey].getter() - 1);
                        } 
                    }
                }
            }
        }
    }

    onClickInput(e) {
        this.onClickInputMenu(e)
        if (this.toggles.showDevUI) {
            this.onClickInputDEV(e);
        }
    }

    onClickInputDEV(e) {
        var r = this.ctxMain.canvas.getBoundingClientRect();
        var p = {
            x: e.clientX - r.left,
            y: e.clientY - r.top
        };

        if(this.state == "play") {
            let y = 0;
            for(var key in this.devValues) {
                if (this.devValues.hasOwnProperty(key)) {
                    y += this.devRect.ySpacing;

                    this.ctxUI.font = this.devRect.fontSize + 'px sans-serif';

                    var textString = this.devValues[key].name + ": " + this.devValues[key].value;
                    var textWidth = this.ctxUI.measureText(textString).width;

                    let x = this.devRect.x + (this.devRect.width/2) - (textWidth / 2);
                    if (p.x >= x && p.x <= x + textWidth &&
                        p.y >= y-this.devRect.fontSize && p.y <= y&& 
                        this.devValues[key].editable) {
                            this.devValues[key].focus = true;
                    } else {
                        this.devValues[key].focus = false;
                    }
                }
            }
        }
    }    

    onMouseUp(e) {
        this.dragging = false;
    }


    onClickInputMenu(e) {
        var r = this.ctxMain.canvas.getBoundingClientRect();
        var p = {
            x: e.clientX - r.left,
            y: e.clientY - r.top
        };

        if(this.state == "pause") {
            let y = this.pauseRect.y;
            if(this.pauseState == "main") {
                for(var key in this.pauseMenuButtons) {
                    if (this.pauseMenuButtons.hasOwnProperty(key)) {
                        y += this.pauseRect.ySpacing;

                        let boxX = this.ctxUI.canvas.width/2 - this.pauseRect.buttons.width/2;
                        if (p.x >= boxX && p.x <= boxX + this.pauseRect.buttons.width &&
                            p.y >= y-this.pauseRect.fontSize && p.y <= y) {
                                this.pauseState = this.pauseMenuButtons[key].name;
                                if(this.pauseState == this.pauseMenuButtons.return.name) {
                                    this.pauseState = "change to play";
                                }
                        }
                    }
                }
            }
            if(this.pauseState == this.pauseMenuButtons.sound.name) {
                for(var key in this.pauseMenuButtons.sound.slider) {
                    if (this.pauseMenuButtons.sound.slider.hasOwnProperty(key)) {
                        y += this.pauseRect.ySpacing;

                        let boxX = this.ctxUI.canvas.width/2 - this.pauseRect.buttons.width/2;
                        
                        if (p.x >= boxX && p.x <= boxX + this.pauseRect.buttons.width &&
                            p.y >= y-this.pauseRect.buttons.height && p.y <= y) {
                                
                                let NewRange = (2 - 0)  
                                let OldRange = ((boxX +this.pauseRect.buttons.width) - boxX)  
                                this.pauseMenuButtons.sound.slider[key].setter(Math.round(((((p.x - boxX) * NewRange) / OldRange) + 0  + Number.EPSILON) * 100) / 100)
                        }
                    }
                }
            }
        }
    }
}