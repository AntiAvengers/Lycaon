import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class AnagramInstruc extends Scene {
    lastWidth = null;
    lastHeight = null;

    constructor() {
        super("AnagramInstruc");
    }

    preload() {
        console.log("AnagramInstruc scene preloading");
    }

    create() {
        this.cameras.main.setBackgroundColor(0xf2f0ef);

        this.infoText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2,
                "Unscramble the anagram within 30 seconds! Reach a high enough score, and you might unlock more pages.",
                {
                    fontFamily: "Arial Black",
                    fontSize: Math.min(this.scale.width * 0.05, 38), // Responsive font size
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.startGameBtn = this.add
            .text(this.scale.width / 2, this.scale.height * 0.75, "Start", {
                fontFamily: "Arial Black",
                fontSize: Math.min(this.scale.width * 0.05, 38), // Responsive font size
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.startGameBtn.on("pointerdown", () => {
            this.changeScene();
        });

        // Visual feedback: hover effect
        this.startGameBtn.on("pointerover", () => {
            this.startGameBtn.setStyle({
                color: "#ffcc00", // Gold on hover
                stroke: "#ffa500", // Orange stroke
                strokeThickness: 10, // Thicker border
            });
        });

        this.startGameBtn.on("pointerout", () => {
            this.startGameBtn.setStyle({
                color: "#ffffff", // White when inactive
                stroke: "#000000",
                strokeThickness: 8,
            });
        });

        this.input.keyboard?.on("keydown-SPACE", () => this.changeScene());

        this.scale.on("resize", this.resize, this);

        // Resize once on creation to ensure proper positioning
        this.resize({ width: this.scale.width, height: this.scale.height });

        EventBus.emit("current-scene-ready", this);

        // Clean up listeners on scene shutdown
        this.events.once("shutdown", () => {
            this.scale.off("resize", this.resize, this);
        });
    }
    changeScene() {
        this.scene.stop("Game"); // Clean up current scene
        this.scene.start("GameOver");
    }

    resize({ width, height }) {
        // Avoid redundant resize
        if (this.lastWidth === width && this.lastHeight === height) return;

        this.lastWidth = width;
        this.lastHeight = height;

        try {
            // Ensure objects exist before updating their positions
            if (!this.infoText || !this.startGameBtn) {
                console.warn(
                    "Some objects are not initialized yet, resize skipped."
                );
                return;
            }

            // Resize the infoText position and font size
            this.infoText.setPosition(width / 2, height / 2);
            this.infoText.setFontSize(Math.min(width * 0.05, 38));

            // Resize the startGameBtn position and font size
            this.startGameBtn.setPosition(width / 2, height * 0.75);
            this.startGameBtn.setFontSize(Math.min(width * 0.05, 38));

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize errot:", e);
        }
    }
}

