import { UIComponentLabel } from "../components/ui/UIComponentLabel.js";
import { UIComponentTextbox } from "../components/ui/UIComponetTextbox.js";
import { Constants } from "../utils/Constants.js";
export class UIChatHandler {
    constructor(canvas, chatComponent) {
        this.socket = null;
        this.canvas = canvas;
        this.chatComponent = chatComponent;
        Constants.COMMAND_SYSTEM.addCommand("print", (args) => {
            console.log(args.join(" "));
        });
        Constants.COMMAND_SYSTEM.addCommand("chatui", (args) => {
            if (args[0] === "set") {
                if (args[1] === "hitbox") {
                    this.chatComponent.setHitbox({ x: Number(args[2]), y: Number(args[3]), width: Number(args[4]), height: Number(args[5]) });
                }
                else if (args[1] === "color") {
                    if (args[5]) {
                        this.chatComponent.setColor({ red: Number(args[2]), green: Number(args[3]), blue: Number(args[4]), alpha: Number(args[5]) });
                    }
                    else {
                        this.chatComponent.setColor({ red: Number(args[2]), green: Number(args[3]), blue: Number(args[4]) });
                    }
                }
            }
            else if (args[0] === "changesize") {
                if (args[1] === "width") {
                    if (this.chatComponent.getHitbox().x + Number(args[2]) > Constants.CANVAS_WIDTH) {
                        if (Constants.CANVAS_WIDTH - Number(args[2]) < 0) {
                            return;
                        }
                        this.chatComponent.setHitbox(Object.assign(Object.assign({}, this.chatComponent.getHitbox()), { x: Constants.CANVAS_WIDTH - Number(args[2]), width: Number(args[2]) }));
                    }
                    else {
                        this.chatComponent.setHitbox(Object.assign(Object.assign({}, this.chatComponent.getHitbox()), { width: Number(args[2]) }));
                    }
                }
                else if (args[1] === "height") {
                    if (this.chatComponent.getHitbox().y + Number(args[2]) > Constants.CANVAS_HEIGHT) {
                        if (Constants.CANVAS_HEIGHT - Number(args[2]) < 0) {
                            return;
                        }
                        this.chatComponent.setHitbox(Object.assign(Object.assign({}, this.chatComponent.getHitbox()), { y: Constants.CANVAS_HEIGHT - Number(args[2]), height: Number(args[2]) }));
                    }
                    else {
                        this.chatComponent.setHitbox(Object.assign(Object.assign({}, this.chatComponent.getHitbox()), { height: Number(args[2]) }));
                    }
                }
            }
            this.chatbox.setHitbox({ x: 5, y: 5, width: this.chatComponent.getHitbox().width - 10, height: this.chatComponent.getHitbox().height * .8 - 15 });
            this.textbox.setHitbox({ x: 5, y: this.chatbox.getHitbox().y + this.chatbox.getHitbox().height + 5, width: this.chatComponent.getHitbox().width - 10, height: this.chatComponent.getHitbox().height * .2 - 15 });
        });
        this.chatbox = new UIComponentLabel({
            x: 5, y: 5, width: this.chatComponent.getHitbox().width - 10, height: this.chatComponent.getHitbox().height * .8 - 15
        }, { red: 0, green: 255, blue: 0 }, false, "", { red: 0, green: 0, blue: 255 }, 13, "left", true);
        Constants.COMMAND_SYSTEM.setOutputLabel(this.chatbox);
        this.textbox = new UIComponentTextbox(this.canvas, {
            x: 5, y: this.chatbox.getHitbox().y + this.chatbox.getHitbox().height + 5, width: this.chatComponent.getHitbox().width - 10, height: this.chatComponent.getHitbox().height * .2 - 15
        }, { red: 0, green: 255, blue: 0 }, false, "", { red: 0, green: 0, blue: 255 }, 9, "left", true, () => {
            if (this.textbox.getText().trim()[0] === '/') {
                let info = Constants.COMMAND_SYSTEM.runCommand(this.textbox.getText());
                if (info) {
                    this.chatbox.update(this.chatbox.getText() + "\n" + info);
                }
            }
            else {
                this.addMessage(this.textbox.getText());
            }
            this.textbox.update("");
        });
        this.chatbox.setParentComponent(this.chatComponent);
        this.textbox.setParentComponent(this.chatComponent);
    }
    render(ctx) {
        this.chatComponent.render(ctx);
        this.chatbox.render(ctx);
        this.textbox.render(ctx);
    }
    update() {
        this.chatbox.update();
        this.textbox.update();
    }
    setSocket(socket) {
        this.socket = socket;
        this.readMessage();
    }
    ;
    addMessage(text) {
        this.chatbox.update(this.chatbox.getText() + "\nYOU: " + text);
        this.sendMessage(text);
    }
    ;
    sendMessage(text) {
        if (this.socket) {
            this.socket.emit("sendChatMessage", this.serializeMessage(text, "NAME"));
        }
    }
    readMessage() {
        if (this.socket) {
            this.socket.on("readChatMesage", (data) => {
                this.chatbox.update(this.chatbox.getText() + "\n" + data.name + ": " + data.text);
            });
        }
    }
    // Convert to plain object for sending via WebSocket
    serializeMessage(text, name) {
        return {
            name: name,
            text: text
        };
    }
    hide() {
        this.chatComponent.hide();
        this.chatbox.hide();
        this.textbox.hide();
    }
    show() {
        this.chatComponent.show();
        this.chatbox.show();
        this.textbox.show();
    }
}
