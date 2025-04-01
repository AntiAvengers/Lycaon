export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.bgMusic = null;
        // this.isMuted = false;
        // this.bgMusicPosition = 0;
    }

    create() {
        // If the music is not already created, create it
        if (!this.bgMusic) {
            this.bgMusic = this.scene.sound.add("gameMusic");
            this.bgMusic.play({ loop: true });
        }

        // // Create the mute button
        // this.muteButton = this.scene.add
        //     .image(20, this.scene.scale.height - 20, "star")
        //     .setOrigin(0.5)
        //     .setScale(0.5)
        //     .setInteractive();

        // this.muteButton.on("pointerdown", () => this.toggleMute());

        // // Set the initial mute state
        // if (this.isMuted) {
        //     this.bgMusic.stop();
        // } else {
        //     this.bgMusic.play({ loop: true, seek: this.bgMusicPosition });
        // }

        // // Attach the resize event listener
        // this.scene.scale.on("resize", this.updateMuteButtonPosition, this);
    }

    toggleMute() {
        // if (this.isMuted) {
        //     this.bgMusic.play({ loop: true, seek: this.bgMusicPosition });
        //     this.isMuted = false;
        // } else {
        //     this.bgMusicPosition = this.bgMusic.seek || 0;
        //     this.bgMusic.stop();
        //     this.isMuted = true;
        // }

        // This function is called to mute/unmute sound from React
        if (this.bgMusic) {
            this.bgMusic.mute = !this.bgMusic.mute;
        }
    }

    setVolume(volume) {
        // This function is called to change volume from React
        if (this.bgMusic) {
            this.bgMusic.setVolume(volume);
        }
    }

    // update() {
    //     if (!this.isMuted) {
    //         this.bgMusicPosition = this.bgMusic.seek || 0;
    //     }
    // }

    // updateMuteButtonPosition() {
    //     // Reposition the mute button whenever the scene is resized
    //     this.muteButton.setPosition(20, this.scene.scale.height - 20);
    // }
}

