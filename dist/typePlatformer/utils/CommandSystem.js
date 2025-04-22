export class CommandSystem {
    constructor() {
        this.commands = new Map();
    }
    addCommand(cmd, func) {
        this.commands.set(cmd, func);
    }
    runCommand(cmd) {
        cmd = cmd.trim();
        cmd = cmd.replace('/', "");
        let cmdPieces = cmd.split(" ");
        if (cmdPieces[0]) {
            if (this.commands.has(cmdPieces[0])) {
                this.commands.get(cmdPieces[0])(cmdPieces.slice(1));
                return;
            }
        }
        return "Unknown Command";
    }
    setOutputLabel(label) {
        this.label = label;
    }
    outputArgsError(cmd) {
        var _a, _b;
        (_a = this.label) === null || _a === void 0 ? void 0 : _a.update(((_b = this.label) === null || _b === void 0 ? void 0 : _b.getText()) + "\nThe command had the wrong amount of errors or not correct data type. Pleas make sure your command matches:\n" + cmd + "\n");
    }
    outputCustomError(cmd, message) {
        var _a, _b;
        (_a = this.label) === null || _a === void 0 ? void 0 : _a.update(((_b = this.label) === null || _b === void 0 ? void 0 : _b.getText()) + "\n" + message + " The command need is: " + "\n" + cmd + "\n");
    }
}
