export class TimeHandler {
    private time = 0;
    private dt = 0;
    private paused = false;

    public addTime(dt: number) {
        if(!this.paused) {
            this.dt = dt;
            this.time += dt;
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

    public getDeltaTime() {
        return this.dt;
    }
}