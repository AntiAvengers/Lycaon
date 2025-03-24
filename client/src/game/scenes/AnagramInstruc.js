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

        this.titleBG = this.add
            .rectangle(
                this.scale.width / 2, // Center horizontally
                0, // Touch the top
                this.scale.width,
                Math.min(this.scale.height * 0.15, 200), // Height of the button
                0xadb5bd
            )
            .setOrigin(0.5, 0) // Center horizontally, ancho at top
            .setDepth(99); // Make sure the background is behind the text

        this.titleText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height + Math.min(this.scale.height * 0.15, 200) / 2, // Vertically center text within rectangle
                "Anagrams",
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

        this.instrucText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.25,
                "Unscramble the anagram within 30 seconds! Reach a high enough score, and you might unlock more pages.",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 20),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.6 },
                    lineSpacing: 5, // Adjust line spacing here
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.warningIcon = this.add
            .image(
                this.scale.width / 2 - 240,
                this.scale.height * 0.4,
                "warningIconTexture"
            )
            .setOrigin(0.5)
            .setScale(0.5); // Resize the icon if needed

        this.warningText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.4,
                "Note: Not all words formed will be vaild answers.",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 20),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.helpText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.5,
                "Do you want help?",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 20),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.pressBtnText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.55,
                "Press these buttons!",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 20),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.helpIcon = this.add
            .image(
                this.scale.width / 2 - 20,
                this.scale.height * 0.63,
                "helpIcon"
            )
            .setOrigin(0.5)
            .setScale(0.5); // Resize the icon if needed

        this.helpIconText = this.add
            .text(this.scale.width / 2 + 20, this.scale.height * 0.63, "Help", {
                fontFamily: "Arial",
                fontSize: Math.min(this.scale.width * 0.05, 20),
                color: "#000000",
                align: "center",
                wordWrap: { width: this.scale.width * 0.8 },
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.hintsIcon = this.add
            .image(
                this.scale.width / 2 - 20,
                this.scale.height * 0.72,
                "hintsIcon"
            )
            .setOrigin(0.5)
            .setScale(0.5);

        this.hintsIconText = this.add
            .text(
                this.scale.width / 2 + 20,
                this.scale.height * 0.72,
                "Hints",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 20),
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
                this.scale.height * 0.85,
                Math.min(this.scale.width * 0.25, 200), // Width of the button
                Math.min(this.scale.height * 0.1, 40), // Height of the button
                0xadb5bd
            )
            .setOrigin(0.5)
            .setDepth(99) // Make sure the background is behind the text
            .setInteractive({ useHandCursor: true }); // Make the background interactive

        this.startGameBtn = this.add
            .text(this.scale.width / 2, this.scale.height * 0.85, "Start", {
                fontFamily: "Arial",
                fontSize: Math.min(this.scale.width * 0.05, 25),
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
    }
    changeScene() {
        this.scene.stop("AnagramInstruc"); // Clean up current scene
        this.scene.start("AnagramGame");
    }

    resize({ width, height }) {
        // Avoid redundant resize
        if (this.lastWidth === width && this.lastHeight === height) return;

        this.lastWidth = width;
        this.lastHeight = height;

        try {
            // Ensure objects exist before updating their positions
            if (
                !this.instrucText ||
                !this.startGameBtn ||
                !this.startGameBtnBackground
            ) {
                console.warn(
                    "Some objects are not initialized yet, resize skipped."
                );
                return;
            }

            this.titleBG.setPosition(width / 2, 0);
            this.titleBG.setSize(width, Math.min(height * 0.15, 200));

            this.titleText.setPosition(
                width / 2,
                Math.min(this.scale.height * 0.15, 200) / 2
            );
            this.titleText.setFontSize(Math.min(width * 0.05, 35));

            this.instrucText.setPosition(width / 2, height * 0.25);
            this.instrucText.setFontSize(Math.min(width * 0.05, 20));

            this.warningIcon.setPosition(width / 2 - 240, height * 0.4);

            this.warningText.setPosition(width / 2, height * 0.4);
            this.warningText.setFontSize(Math.min(width * 0.05, 20));

            this.helpText.setPosition(width / 2, height * 0.5);
            this.helpText.setFontSize(Math.min(width * 0.05, 20));

            this.pressBtnText.setPosition(width / 2, height * 0.55);
            this.pressBtnText.setFontSize(Math.min(width * 0.05, 20));

            this.helpIcon.setPosition(width / 2 - 20, height * 0.63);

            this.helpIconText.setPosition(width / 2 + 20, height * 0.63);
            this.helpIconText.setFontSize(Math.min(width * 0.05, 20));

            this.hintsIcon.setPosition(width / 2 - 20, height * 0.72);

            this.hintsIconText.setPosition(width / 2 + 20, height * 0.72);
            this.hintsIconText.setFontSize(Math.min(width * 0.05, 20));

            this.startGameBtn.setPosition(width / 2, height * 0.85);
            this.startGameBtn.setFontSize(Math.min(width * 0.05, 25));

            this.startGameBtnBackground.setPosition(width / 2, height * 0.85);
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

