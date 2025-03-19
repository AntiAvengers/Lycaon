import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    create() {
        // Set the background color
        this.cameras.main.setBackgroundColor(0x00ff00);

        // Add a semi-transparent background image
        this.background = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "background")
            .setAlpha(0.5);

        // Add centered text with stroke and depth for layering
        this.infoText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2,
                "Make something fun!\nand share it with us:\nsupport@phaser.io",
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

        // Listen for screen resizing
        this.scale.on("resize", this.resize, this);

        // Resize once on creation to ensure proper positioning
        this.resize({ width: this.scale.width, height: this.scale.height });

        EventBus.emit("current-scene-ready", this);

        // Trigger scene change on click or keypress
        this.input.on("pointerdown", () => this.changeScene());
        this.input.keyboard?.on("keydown-SPACE", () => this.changeScene());
    }

    changeScene() {
        this.scene.start("GameOver");
    }

    resize({ width, height }) {
        // Ensure canvas does not overflow the viewport
        const newWidth = Math.min(width, window.innerWidth);
        const newHeight = Math.min(height, window.innerHeight);

        // Resize the background and center it
        this.background.setPosition(newWidth / 2, newHeight / 2);
        this.background.setDisplaySize(newWidth, newHeight);

        // Update text position and responsiveness
        this.infoText.setPosition(newWidth / 2, newHeight / 2);
        this.infoText.setFontSize(Math.min(newWidth * 0.05, 38));
    }
}

