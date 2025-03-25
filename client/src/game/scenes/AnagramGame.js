import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class AnagramGame extends Scene {
    lastWidth = null;
    lastHeight = null;

    constructor() {
        super("AnagramGame");
        this.timerText = null;
        this.remainingTime = 30;
    }

    preload() {
        console.log("AnagramGame scene preloading");
    }

    create() {
        this.cameras.main.setBackgroundColor(0xf2f0ef);

        //----------------------------------------------------------

        this.anagramBG = this.add
            .rectangle(
                this.scale.width / 2, // Center horizontally
                0, // Touch the top
                this.scale.width,
                Math.min(this.scale.height * 0.15, 200), // Height of the button
                0xadb5bd
            )
            .setOrigin(0.5, 0) // Center horizontally, ancho at top
            .setDepth(99); // Make sure the background is behind the text

        this.anagramText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height + Math.min(this.scale.height * 0.15, 200) / 2, // Vertically center text within rectangle
                "E  I  T  S  P  E  R",
                {
                    fontFamily: "Arial Black",
                    fontSize: Math.min(this.scale.width * 0.05, 35),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.timerText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.28,
                this.formatTime(this.remainingTime),
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        //----------------------------------------------------------

        this.startTimer();

        //----------------------------------------------------------

        // Listen for screen resizing
        this.scale.on("resize", this.resize, this);

        // Resize once on creation to ensure proper positioning
        this.resize({ width: this.scale.width, height: this.scale.height });

        EventBus.emit("current-scene-ready", this);

        // Trigger scene change on click or keypress
        this.input.on("pointerdown", () => this.changeScene());
        this.input.keyboard?.on("keydown-SPACE", () => this.changeScene());
    }

    startTimer() {
        this.time.addEvent({
            delay: 1000, // 1 second (1000 ms)
            callback: this.updateTimer,
            callbackScope: this,
            loop: true, // Repeat the event
        });
    }

    updateTimer() {
        this.remainingTime--;

        // Update the timer display in MM:SS format
        this.timerText.setText(this.formatTime(this.remainingTime));

        if (this.remainingTime <= 0) {
            this.timeIsUp();
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsPart = seconds % 60;

        // Pad with leading zeros if needed
        return `${String(minutes).padStart(2, "0")}:${String(
            secondsPart
        ).padStart(2, "0")}`;
    }

    timeIsUp() {
        console.log("Time's up!");
        this.scene.start("GameOver"); // Change scene when time runs out
    }

    changeScene() {
        this.scene.stop("AnagramGame"); // Ensure Game scene is stopped
        this.scene.start("GameOver");
    }

    resize({ width, height }) {
        // Avoid redundant resize calls
        if (this.lastWidth === width && this.lastHeight === height) return;

        this.lastWidth = width;
        this.lastHeight = height;

        // // Ensure canvas does not overflow the viewport
        // const newWidth = Math.min(width, window.innerWidth);
        // const newHeight = Math.min(height, window.innerHeight);

        try {
            if (!this.anagramText || !this.anagramBG) {
                console.warn(
                    "Some objects are not initialized yet, resize skipped."
                );
                return;
            }

            this.anagramBG.setPosition(width / 2, 0);
            this.anagramBG.setSize(width, Math.min(height * 0.15, 200));

            this.anagramText.setPosition(
                width / 2,
                Math.min(this.scale.height * 0.15, 200) / 2
            );
            this.anagramText.setFontSize(Math.min(width * 0.05, 35));

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize error: ", e);
        }
    }
}

