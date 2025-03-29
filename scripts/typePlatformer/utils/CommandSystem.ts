import { UIComponentLabel } from "../components/ui/UIComponentLabel";

export class CommandSystem {

    private commands: Map<string, (args: string[]) => void>;
    private label?: UIComponentLabel;
    public constructor() {
        this.commands = new Map<string, (args: string[]) => void>();
    }

    public addCommand(cmd: string, func: (args: string[]) => void) {
        this.commands.set(cmd, func);
    }

    public runCommand(cmd: string): string | undefined {
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

    public setOutputLabel(label: UIComponentLabel) {
        this.label = label
    }

    public outputArgsError(cmd: string) {
        this.label?.update(this.label?.getText() + "\nThe command had the wrong amount of errors or not correct data type. Pleas make sure your command matches:\n"+cmd+"\n");
    }

}