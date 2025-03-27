import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    lastWidth = null;
    lastHeight = null;

    constructor() {
        super("GameOver");
    }

    preload() {
        console.log("GameOver scene preloading");
    }

    create() {
        // Retrieve the remaining time from the global registry
        const remainingTime = this.registry.get("remainingTime");

        const wordCount = this.registry.get("wordCount");

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

        // Set up your timer display here, using the `remainingTime` retrieved
        this.timerText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.25,
                this.formatTime(remainingTime),
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    color: "#ff0000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.timesUpText = this.add
            .text(this.scale.width / 2, this.scale.height * 0.4, "Time's up!", {
                fontFamily: "Arial Black",
                fontSize: Math.min(this.scale.width * 0.05, 25), // Responsive font size
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
                wordWrap: { width: this.scale.width * 0.8 },
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.wordCount = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.5,
                `You found ${wordCount} words!`,
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25), // Responsive font size
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

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

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsPart = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(
            secondsPart
        ).padStart(2, "0")}`;
    }

    changeScene() {
        this.scene.stop("GameOver");
        this.scene.start("MainMenu");
    }
    resize({ width, height }) {
        // Avoid redundant resize calls
        if (this.lastWidth === width && this.lastHeight === height) return;

        this.lastWidth = width;
        this.lastHeight = height;

        try {
            // Ensure objects are properly initialized before resizing
            if (!this.timerText || !this.timesUpText) {
                console.warn(
                    "Some objects are not initialized yet, resize skipped."
                );
                return;
            }

            this.anagramBG
                .setPosition(width / 2, 0)
                .setSize(width, Math.min(height * 0.15, 200));

            this.anagramText
                .setPosition(
                    width / 2,
                    Math.min(this.scale.height * 0.15, 200) / 2
                )
                .setFontSize(Math.min(width * 0.05, 35));

            this.timerText
                .setPosition(width / 2, height * 0.25)
                .setFontSize(Math.min(width * 0.05, 25));

            this.timesUpText
                .setPosition(width / 2, height * 0.4)
                .setFontSize(Math.min(width * 0.05, 25));

            this.wordCount
                .setPosition(width / 2, height * 0.5)
                .setFontSize(Math.min(width * 0.05, 25));

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize error: ", e);
        }
    }
}

