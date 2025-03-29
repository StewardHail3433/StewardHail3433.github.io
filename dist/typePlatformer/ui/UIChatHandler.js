import { UIComponentLabel } from "../components/ui/UIComponentLabel.js";
import { UIComponentTextbox } from "../components/ui/UIComponetTextbox.js";
export class UIChatHandler {
    constructor(canvas, chatComponent) {
        this.socket = null;
        this.canvas = canvas;
        this.chatComponent = chatComponent;
        this.chatbox = new UIComponentLabel({
            x: 5, y: 5, width: this.chatComponent.getHitbox().width - 10, height: this.chatComponent.getHitbox().height * .8 - 15
        }, { red: 0, green: 255, blue: 0 }, false, "", { red: 0, green: 0, blue: 255 }, 9, "left", true);
        this.textbox = new UIComponentTextbox(this.canvas, {
            x: 5, y: this.chatbox.getHitbox().y + this.chatbox.getHitbox().height + 5, width: this.chatComponent.getHitbox().width - 10, height: this.chatComponent.getHitbox().height * .2 - 15
        }, { red: 0, green: 255, blue: 0 }, false, "", { red: 0, green: 0, blue: 255 }, 9, "left", true, () => {
            this.addMessage(this.textbox.getText());
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
        console.log("kkkkkk");
        this.readMessage();
    }
    ;
    addMessage(text) {
        this.chatbox.update(this.chatbox.getText() + "\n" + text);
        this.sendMessage(text);
    }
    ;
    sendMessage(text) {
        if (this.socket) {
            console.log("sjdfnk");
            this.socket.emit("sendChatMessage", this.serializeMessage(text, "NAME"));
        }
    }
    readMessage() {
        if (this.socket) {
            this.socket.on("readChatMesage", (data) => {
                console.log(data);
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
}
