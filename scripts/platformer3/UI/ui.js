export default class UI {

    constructor(/** @type {CanvasRenderingContext2D} */ ctxMain, player) {
        this.canvasUI = document.createElement('canvas');
        this.canvasUI.width = ctxMain.canvas.width;
        this.canvasUI.height = ctxMain.canvas.height;
        /** @type {CanvasRenderingContext2D} */ this.ctxUI = this.canvasUI.getContext('2d');

        this.toggles = {
            showUI: true, // all ui

            showDevUI: false, // dev
        }
        this.devValues = {
            speed: {
                name: "speed",
                getter: () => player.speed,
                setter: (x) => player.speed = x,
                editable:true,
                focus: false
            },
            gravity: {
                name: "gravity",
                getter: () => player.gravity,
                setter: (x) => player.gravity = x,
                increment: 0.05,
                editable:true,
                focus: false
            },
            jumpMultiplier: {
                name: "jumpMultiplier",
                getter: () => player.jumpMultiplier,
                setter: (x) => player.jumpMultiplier = x,
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
                editable: false,
                focus: false
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
        
        this.ctxMain = ctxMain;
        this.player = player;
    }
    update() {
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
            if (this.toggles.showDevUI) {
                this.renderDEV();
            }
            this.ctxMain.drawImage(this.canvasUI, 0, 0, this.ctxMain.canvas.width, this.ctxMain.canvas.height);
        }
    }

    renderDEV() {
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

    onClickInput(e) {
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
        console.log(p.x + ", " + p.y);

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
                        console.log("focus")
                } else {
                    this.devValues[key].focus = false;
                }
            }
        }
    }
}