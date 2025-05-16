export default class Sound {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = { music: {}, sfx: {} };
        this.currentMusicSource = null;
        this.currentMusicIndex = null;

        this.musicGainNode = this.audioContext.createGain();
        this.sfxGainNode = this.audioContext.createGain();
        this.musicGainNode.connect(this.audioContext.destination);
        this.sfxGainNode.connect(this.audioContext.destination);

        this.soundURL = {
            music: [
                "./resources/plat3/music/bongSong.wav"
            ],
            sfx: [
                "./resources/plat3/sfx/enemyDeath.wav",
                "./resources/plat3/sfx/projectile/projectile.wav",
                "./resources/plat3/sfx/projectile/canon.wav"
            ]
        };

        // Load all sounds
        this.loadAllSounds();
    }

    async loadAllSounds() {
        const loadPromises = [];
        for (const [type, urls] of Object.entries(this.soundURL)) {
            urls.forEach((url, index) => {
                loadPromises.push(this.loadSound(url, type, index));
            });
        }
        await Promise.all(loadPromises);
    }

    async loadSound(url, type, index) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.buffers[type][index] = audioBuffer;
        } catch (error) {
            console.error(`Error loading sound: ${url}`, error);
        }
    }

    playSound(buffer, gainNode, loop = false) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;
        source.connect(gainNode);
        source.start(0);
        return source;
    }

    play(type, i) {
        const buffer = this.buffers[type][i];
        if (buffer) {
            if (type === 'music') {
                if (this.currentMusicSource) {
                    this.currentMusicSource.stop();
                }
                this.currentMusicSource = this.playSound(buffer, this.musicGainNode, true);
                this.currentMusicIndex = i;
            } else if (type === 'sfx') {
                this.playSound(buffer, this.sfxGainNode, false);
            }
        }
    }

    stop(type) {
        if (type === 'music' && this.currentMusicSource) {
            this.currentMusicSource.stop();
            this.currentMusicSource = null;
            this.currentMusicIndex = null;
        }
    }

    setVolume(type, volume) {
        if (type === 'music') {
            this.musicGainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        } else if (type === 'sfx') {
            this.sfxGainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
    }

    getVolume(type) {
        if (type === 'music') {
            return this.musicGainNode.gain.value;
        } else if (type === 'sfx') {
            return this.sfxGainNode.gain.value;
        }
    }


    getCurrentMusic() {
        return this.currentMusicIndex;
    }
}
