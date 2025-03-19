import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    logoTween;
    background;
    logo;
    startButton;

    constructor() {
        super("MainMenu");
    }

    create() {
        const { width, height } = this.scale;

        // Dynamically set background image size
        this.background = this.add
            .image(width / 2, height / 2, "background")
            .setOrigin(0.5)
            .setDisplaySize(width, height);

        // Dynamically position logo at the center
        this.logo = this.add
            .image(width / 2, height * 0.4, "logo")
            .setDepth(100);

        // Responsive font size based on screen width
        const fontSize = Math.min(width * 0.08, 48); // Max font size of 48px

        // Create interactive "Start Game" button
        this.startButton = this.add
            .text(width / 2, height * 0.75, "Start Game", {
                fontFamily: "Arial Black",
                fontSize: `${fontSize}px`,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true }); // Make text interactive and show hand cursor

        // Change scene on button click
        this.startButton.on("pointerdown", () => {
            this.changeScene();
        });

        // Visual feedback: hover effect
        this.startButton.on("pointerover", () => {
            this.startButton.setStyle({ color: "#ffcc00" }); // Change color on hover
        });
        this.startButton.on("pointerout", () => {
            this.startButton.setStyle({ color: "#ffffff" }); // Revert color on mouse out
        });

        // Event to notify scene readiness
        EventBus.emit("current-scene-ready", this);

        // Listen for window resize events to update UI elements
        this.scale.on("resize", this.resize, this);

        // Clean up listeners on scene shutdown
        this.events.once("shutdown", this.cleanup, this);
    }

    // Method to handle resizing
    resize(gameSize) {
        if (!this.scene.isActive() || !gameSize) return;

        const { width, height } = gameSize;

        // Resize and reposition elements
        this.background
            ?.setPosition(width / 2, height / 2)
            .setDisplaySize(width, height);
        this.logo?.setPosition(width / 2, height * 0.4);
        this.startButton?.setPosition(width / 2, height * 0.75);

        // Adjust font size responsively
        const fontSize = Math.min(width * 0.08, 48);
        this.startButton.setStyle({ fontSize: `${fontSize}px` });
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        if (this.scene.isActive("MainMenu")) {
            this.scene.start("Game");
            // Notify React that the scene changed
            EventBus.emit("scene-changed", "Game");
        }
    }

    // Clean up listeners and references
    cleanup() {
        this.scale.off("resize", this.resize, this);
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }
    }
}

