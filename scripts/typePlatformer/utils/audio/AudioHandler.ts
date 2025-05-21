import { Howl } from 'howler';
import { Constants } from '../Constants';

export enum SFX {
    PICKUP = 'pickup',
    BREAKING_0 = 'breaking0',
    FINISH_BREKAING_0 = 'finishbreaking0',
    PLACE = 'place',
}

export enum MUSIC {
    MUSIC0 = 'music0',
    LIVING = 'living',
}

export class AudioHandler {

    //https://dev.to/smpnjn/how-the-typescript-partial-type-works-2klj
    private static sounds: Partial<Record<SFX | MUSIC, Howl>> = {};
    private static soundUrls: Map<SFX | MUSIC, string> = new Map<SFX | MUSIC, string>()
        .set(MUSIC.MUSIC0, "resources/typePlatformer/music/bongSong.wav")
        .set(SFX.PICKUP, "resources/typePlatformer/sfx/pickUp.wav")
        .set(MUSIC.LIVING, "resources/typePlatformer/music/living.wav")
        .set(SFX.BREAKING_0, "resources/typePlatformer/sfx/breaking0.wav")
        .set(SFX.FINISH_BREKAING_0, "resources/typePlatformer/sfx/finishBreaking0.wav")
        .set(SFX.PLACE, "resources/typePlatformer/sfx/place.wav");

    public static init() {
        this.loadAllSounds();

    }

    public static async loadAllSounds(): Promise<void> {
        const promises: Promise<[SFX | MUSIC, Howl]>[] = [];

        for (const [key, url] of this.soundUrls.entries()) {
            promises.push(this.loadSound(url).then(x=>[key, x]));
        }

        const allSoundsRejectOrResolve = await Promise.all(promises);

        for(const [key, sound] of allSoundsRejectOrResolve) {
            this.sounds[key] = sound;
        }
        
        this.setVolume("music", 0.02)
        Constants.COMMAND_SYSTEM.addCommand("volume", (args: string[]) => {
            if(args[0] == "sfx" || args[0] == "music") {
                this.setVolume(args[0], Number(args[1]))
            }
        })

        Constants.COMMAND_SYSTEM.addCommand("play", (args: string[]) => {
            if(args[0] == "music") {
                this.stopAllMusic();
                if(Object.values(MUSIC).includes(args[1] as MUSIC)) {
                    this.sounds[args[1] as MUSIC]?.loop(true).play();
                }
            } else if(args[0] == "sfx") {
                if(Object.values(SFX).includes(args[1] as SFX)) {
                    this.sounds[args[1] as SFX]?.play();
                }
            }
        })
    }

    private static stopAllMusic() {
        for(const [key, sound] of Object.entries(this.sounds)) {
            sound.stop();
        }
    }


    private static loadSound(src: string): Promise<Howl> {
        return new Promise((resolve, reject) => {
            const sound = new Howl({
                src: [src],
                preload: true,
                onload: () => {console.log("Sound: Succesfully loaded -> " + src); resolve(sound)},
                onloaderror: () => reject(new Error("Failed to load sound: " + src)),
            });
        });
    }

    public static getSounds() {
        return this.sounds;
    }

    public static setVolume(type: "sfx" | "music", percent: number) {
        const keys = type === "sfx" ? Object.values(SFX) : Object.values(MUSIC);

        for (const key of keys) {
            const sound = this.sounds[key];
            if (sound) {
                sound.volume(percent);
            }
        }

    }
}