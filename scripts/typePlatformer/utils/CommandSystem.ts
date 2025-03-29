export class CommandSystem {

    private commands: Map<string, (args: string[]) => void>;
    constructor() {
        this.commands = new Map<string, (args: string[]) => void>();
    }

    addCommand(cmd: string, func: (args: string[]) => void) {
        this.commands.set(cmd, func);
    }

    runCommand(cmd: string): string | undefined {
        cmd = cmd.trim();
        cmd = cmd.replace('/', "");

        let cmdPieces: string[] = cmd.split(" ");
        if(cmdPieces[0]) {
            if(this.commands.has(cmdPieces[0])) {
                console.log(cmdPieces.slice(1));
                this.commands.get(cmdPieces[0])!(cmdPieces.slice(1));
                return;
            }
        }

        return "Unknown Command";

    }
}