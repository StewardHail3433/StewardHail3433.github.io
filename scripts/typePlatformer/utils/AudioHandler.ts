import { Howl } from 'howler';


export class AudioHandler {

    private static sound: Howl;

    public static init() {
        this.sound = new Howl({
            src: ['resources/typePlatformer/music/bongSong.wav'],
            loop: true
        });
        this.sound.play();

        document.addEventListener("keydown", (event) => {
            if (event.key === ".") {
                this.sound.pause();
            }
            if (event.key === ",") {
                this.sound.play();
            }
        });

    }


    public static addSFX(path: string) {

    }

    public static addMusic(path: string) {

    }

    // public static copySound()
}