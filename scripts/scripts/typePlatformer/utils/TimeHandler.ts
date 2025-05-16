export class TimeHandler {
    private time = 0;
    private paused = false;

    public addTime(time: number) {
        if(!this.paused) {
            this.time += time
        }
    }

    public getTime(): number {
        return this.time;
    }

    public pause() {
        this.paused = true;
    }

    public unPause() {
        this.paused = false;
    }


}