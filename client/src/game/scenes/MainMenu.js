import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    logoTween;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.add.image(512, 384, "background");

        this.logo = this.add.image(512, 300, "logo").setDepth(100);

        // this.add.text(512, 460, 'Main Menu', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setDepth(100).setOrigin(0.5);

        // Create interactive "Start Game" button
        const startButton = this.add
            .text(512, 460, "Start Game", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true }); // Make text interactive and show hand cursor

        // Change scene on button click
        startButton.on("pointerdown", () => {
            this.changeScene();
        });

        // Visual feedback: hover effect
        startButton.on("pointerover", () => {
            startButton.setStyle({ color: "#ffcc00" }); // Change color on hover
        });
        startButton.on("pointerout", () => {
            startButton.setStyle({ color: "#ffffff" }); // Revert color on mouse out
        });

        EventBus.emit("current-scene-ready", this);
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

