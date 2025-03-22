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
                this.scale.height / 2, // Slightly above the center for better spacing
                "Unscramble the anagram within 30 seconds! Reach a high enough score, and you might unlock more pages.",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 20), // Responsive font size
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.warningIcon = this.add
            .image(
                this.scale.width / 2 - 240, // Position the icon to the left of the text
                this.scale.height / 2 + 70, // Position below the info text
                "warningIconTexture"
            )
            .setOrigin(0.5)
            .setScale(0.5); // Resize the icon if needed

        this.warningText = this.add
            .text(
                this.scale.width / 2, // Position the text to the right of the icon
                this.scale.height / 2 + 70, // Position below the info text
                "Note: Not all words formed will be vaild answers.",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 20), // Responsive font size
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        

        this.startGameBtnBackground = this.add
            .rectangle(
                this.scale.width / 2,
                this.scale.height * 0.75,
                Math.min(this.scale.width * 0.25, 200), // Width of the button
                Math.min(this.scale.height * 0.1, 40), // Height of the button
                0xadb5bd
            )
            .setOrigin(0.5)
            .setDepth(99) // Make sure the background is behind the text
            .setInteractive({ useHandCursor: true }); // Make the background interactive

        this.startGameBtn = this.add
            .text(this.scale.width / 2, this.scale.height * 0.75, "Start", {
                fontFamily: "Arial",
                fontSize: Math.min(this.scale.width * 0.05, 25), // Responsive font size
                color: "#000000",
                align: "center",
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.startGameBtn.on("pointerdown", () => {
            this.changeScene();
        });

        this.startGameBtnBackground.on("pointerdown", () => {
            this.changeScene();
        });

        // Helper function for hover effect and animation
        const buttonHoverEffect = (isHovering) => {
            const textColor = isHovering ? "#ffcc00" : "#000000"; // Text color change on hover
            const backgroundColor = isHovering ? 0xcccccc : 0xadb5bd; // Background color change on hover
            const scaleValue = isHovering ? 1.05 : 1; // Scale up on hover, scale back to original when not

            // Update text color
            this.startGameBtn.setStyle({
                color: textColor,
            });

            // Update background color
            this.startGameBtnBackground.setFillStyle(backgroundColor);

            // Apply scaling animation to both the button text and background
            this.tweens.add({
                targets: [this.startGameBtn, this.startGameBtnBackground],
                scaleX: scaleValue,
                scaleY: scaleValue,
                duration: 200,
                ease: "Power1", // Smooth easing
            });
        };

        // Apply hover effect on both the background and text on hover and out
        this.startGameBtnBackground.on("pointerover", () =>
            buttonHoverEffect(true)
        );
        this.startGameBtnBackground.on("pointerout", () =>
            buttonHoverEffect(false)
        );

        this.startGameBtn.on("pointerover", () => buttonHoverEffect(true));
        this.startGameBtn.on("pointerout", () => buttonHoverEffect(false));

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
            if (
                !this.infoText ||
                !this.startGameBtn ||
                !this.startGameBtnBackground
            ) {
                console.warn(
                    "Some objects are not initialized yet, resize skipped."
                );
                return;
            }

            // Resize the infoText position and font size
            this.infoText.setPosition(width / 2, height / 2 - 50);
            this.infoText.setFontSize(Math.min(width * 0.05, 20));

            // Update warning icon position
            this.warningIcon.setPosition(width / 2 - 240, height / 2 + 70);

            // Update warning text position
            this.warningText.setPosition(width / 2, height / 2 + 70);
            this.warningText.setFontSize(Math.min(width * 0.05, 20)); // Adjust font size based on width

            // Resize the startGameBtn position and font size
            this.startGameBtn.setPosition(width / 2, height * 0.75);
            this.startGameBtn.setFontSize(Math.min(width * 0.05, 25));

            this.startGameBtnBackground.setPosition(width / 2, height * 0.75);
            this.startGameBtnBackground.setSize(
                Math.min(width * 0.25, 200),
                Math.min(height * 0.1, 40)
            );

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize errot:", e);
        }
    }
}

