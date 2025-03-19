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
        // Dynamically set background image size
        this.background = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "background"
            )
            .setOrigin(0.5);

        // Dynamically position logo at the center of the screen
        this.logo = this.add
            .image(
                this.cameras.main.width / 2,
                this.cameras.main.height * 0.4,
                "logo"
            )
            .setDepth(100);

        // this.add.text(512, 460, 'Main Menu', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setDepth(100).setOrigin(0.5);

        // Create interactive "Start Game" button
        this.startButton = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height * 0.75,
                "Start Game",
                {
                    fontFamily: "Arial Black",
                    fontSize: 38,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                }
            )
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
    }

    // Method to handle resizing
    resize(gameSize) {
        const { width, height } = gameSize;

        // Adjust background, logo, and button positions on resize
        if (this.background) {
            this.background.setPosition(width / 2, height / 2); // Keep background centered
        }

        if (this.logo) {
            this.logo.setPosition(width / 2, height * 0.4); // Center logo based on new window size
        }

        if (this.startButton) {
            this.startButton.setPosition(width / 2, height * 0.75); // Center the Start button
        }
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Game");

        // Notify React that the scene changed
        EventBus.emit("scene-changed", "Game");
    }

    moveLogo(reactCallback) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback) {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}

