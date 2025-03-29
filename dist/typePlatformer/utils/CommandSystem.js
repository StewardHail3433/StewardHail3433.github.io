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
                console.log(cmdPieces.slice(1));
                this.commands.get(cmdPieces[0])(cmdPieces.slice(1));
                return;
            }
        }
        return "Unknown Command";
    }
}
