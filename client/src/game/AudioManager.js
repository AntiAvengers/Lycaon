export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.bgMusic = null;
        this.isMuted = false;
        this.bgMusicPosition = 0;

        // Store the AudioManager on the scene so it persists between scene transitions
        if (!scene.sys.game.audioManager) {
            scene.sys.game.audioManager = this; // Store the instance in the global game object
        }
    }

    create() {
        if (!this.scene) {
            console.error("Scene is undefined in AudioManager.create.");
            return;
        }

        // If the music is not already created, create it
        if (!this.bgMusic) {
            this.bgMusic = this.scene.sound.add("gameMusic");
            this.bgMusic.play({ loop: true });
        }

        // Set the initial mute state
        if (this.isMuted) {
            this.bgMusic.stop();
        } else {
            this.bgMusic.play({ loop: true, seek: this.bgMusicPosition });
        }
    }

    toggleMute() {
        if (this.isMuted) {
            this.bgMusic.play({ loop: true, seek: this.bgMusicPosition });
            this.isMuted = false;
        } else {
            this.bgMusicPosition = this.bgMusic.seek || 0;
            this.bgMusic.stop();
            this.isMuted = true;
        }
    }

    update() {
        if (!this.isMuted) {
            this.bgMusicPosition = this.bgMusic.seek || 0;
        }
    }
}

