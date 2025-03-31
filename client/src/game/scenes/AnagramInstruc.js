import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class AnagramInstruc extends Scene {
    background;
    titleBG;
    titleText;
    instrucText;
    warningIcon;
    warningText;
    helpText;
    pressBtnText;
    helpIcon;
    pressBtn2Text;
    startGameBtnBackground;
    startGameBtn;
    popupBg;
    popupText;
    yesButton;
    yesText;
    noButton;
    noText;

    lastWidth = null;
    lastHeight = null;

    constructor() {
        super("AnagramInstruc");
    }

    preload() {
        console.log("AnagramInstruc scene preloading");
    }

    create() {
        this.background = this.add
            .image(this.scale.width / 2, this.scale.height / 2, "background")
            .setOrigin(0.5)
            .setAlpha(0.75)
            .setDisplaySize(this.scale.width, this.scale.height);

        //----------------------------------------------------------

        this.titleBG = this.add
            .rectangle(
                this.scale.width / 2, // Center horizontally
                0, // Touch the top
                this.scale.width,
                Math.min(this.scale.height * 0.15, 100),
                0x4a63e4
            )
            .setAlpha(0.65)
            .setOrigin(0.5, 0) // Center horizontally, ancho at top
            .setDepth(99); // Make sure the background is behind the text

        this.titleText = this.add
            .text(
                this.scale.width / 2,
                Math.min(this.scale.height * 0.15, 100) / 2, // Vertically center text within rectangle
                "A n a g r a m s",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.08, 65),
                    color: "#FFFFFF",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.instrucText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.28,
                "Unscramble the anagram within 30 seconds! Reach a high enough score, and you might unlock more pages.",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.06, 20),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.6 },
                    lineSpacing: 5, // Adjust line spacing here
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.warningIcon = this.add
            .image(this.scale.width / 2 - 240, this.scale.height * 0.45, "star")
            .setOrigin(0.5)
            .setScale(0.5); // Resize the icon if needed

        this.warningText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.45,
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
                this.scale.height * 0.55,
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
                this.scale.width / 2 - 55,
                this.scale.height * 0.62,
                "Press the",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 20),
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.helpIcon = this.add
            .image(
                this.pressBtnText.width / 2 + 10,
                this.scale.height * 0.62,
                "star"
            )
            .setDepth(100)
            .setScale(0.5); // Resize the icon if needed

        this.pressBtn2Text = this.add
            .text(
                this.scale.width / 2 + 70,
                this.scale.height * 0.62,
                "for help!",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 20),
                    color: "#000000",
                    align: "center",
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
                0x4a63e4
            )
            .setOrigin(0.5)
            .setDepth(99) // Make sure the background is behind the text
            .setInteractive({ useHandCursor: true }); // Make the background interactive

        this.startGameBtn = this.add
            .text(this.scale.width / 2, this.scale.height * 0.85, "Start", {
                fontFamily: "Arial",
                fontSize: Math.min(this.scale.width * 0.05, 25),
                color: "#ffffff",
                align: "center",
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        //----------------------------------------------------------

        this.popupBg = this.add
            .rectangle(
                this.scale.width / 2,
                this.scale.height / 2,
                300,
                200,
                0xffffff
            )
            .setOrigin(0.5)
            .setDepth(200)
            .setVisible(false);

        this.popupText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2 - 40,
                "One key will be used. Continue?",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: 250 },
                    lineSpacing: 17,
                }
            )
            .setOrigin(0.5)
            .setDepth(201)
            .setVisible(false);

        this.yesButton = this.add
            .rectangle(
                this.scale.width / 2 - 60,
                this.scale.height / 2 + 40,
                80,
                40,
                0x00ff00
            )
            .setOrigin(0.5)
            .setDepth(201)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        this.yesText = this.add
            .text(
                this.scale.width / 2 - 60,
                this.scale.height / 2 + 40,
                "Yes",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    color: "#000000",
                }
            )
            .setOrigin(0.5)
            .setDepth(202)
            .setVisible(false);

        this.noButton = this.add
            .rectangle(
                this.scale.width / 2 + 60,
                this.scale.height / 2 + 40,
                80,
                40,
                0xff0000
            )
            .setOrigin(0.5)
            .setDepth(201)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        this.noText = this.add
            .text(this.scale.width / 2 + 60, this.scale.height / 2 + 40, "No", {
                fontFamily: "Arial",
                fontSize: Math.min(this.scale.width * 0.05, 25),
                color: "#000000",
            })
            .setOrigin(0.5)
            .setDepth(202)
            .setVisible(false);

        this.yesButton.on("pointerdown", () => {
            this.changeScene();
        });

        this.yesText.on("pointerdown", () => {
            this.changeScene();
        });

        this.noButton.on("pointerdown", () => {
            this.hidePopup();
        });

        this.noText.on("pointerdown", () => {
            this.hidePopup();
        });

        this.startGameBtn.on("pointerdown", () => {
            this.showPopup();
        });

        this.startGameBtnBackground.on("pointerdown", () => {
            this.showPopup();
        });

        //----------------------------------------------------------

        // Helper function for hover effect and animation
        const buttonHoverEffect = (isHovering) => {
            const textColor = isHovering ? "#000000" : "#ffffff"; // Text color change on hover
            const backgroundColor = isHovering ? 0xffffff : 0x4a63e4; // Background color change on hover
            const scaleValue = isHovering ? 1.05 : 1; // Scale up on hover, scale back to original when not

            // Update text color
            this.startGameBtn.setStyle({ color: textColor });

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

        //----------------------------------------------------------

        this.input.keyboard?.on("keydown-SPACE", () => this.showPopup());

        this.scale.on("resize", (size) => {
            if (
                this.lastWidth !== size.width ||
                this.lastHeight !== size.height
            ) {
                this.resize(size);
            }
        });

        // Resize once on creation to ensure proper positioning
        this.resize({ width: this.scale.width, height: this.scale.height });

        EventBus.emit("current-scene-ready", this);
    }

    // Show popup function
    showPopup() {
        this.popupBg.setVisible(true);
        this.popupText.setVisible(true);
        this.yesButton.setVisible(true);
        this.yesText.setVisible(true);
        this.noButton.setVisible(true);
        this.noText.setVisible(true);
    }

    // Hide popup function
    hidePopup() {
        this.popupBg.setVisible(false);
        this.popupText.setVisible(false);
        this.yesButton.setVisible(false);
        this.yesText.setVisible(false);
        this.noButton.setVisible(false);
        this.noText.setVisible(false);
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

            this.background
                .setPosition(width / 2, height / 2)
                .setDisplaySize(width, height);

            this.titleBG
                .setPosition(width / 2, 0)
                .setSize(width, Math.min(height * 0.15, 100));

            this.titleText
                .setPosition(
                    width / 2,
                    Math.min(this.scale.height * 0.15, 100) / 2
                )
                .setFontSize(Math.min(width * 0.08, 65));

            this.instrucText
                .setPosition(width / 2, height * 0.28)
                .setFontSize(Math.min(width * 0.06, 20));

            this.warningIcon.setPosition(width / 2 - 240, height * 0.45);

            this.warningText
                .setPosition(width / 2, height * 0.45)
                .setFontSize(Math.min(width * 0.05, 20));

            this.helpText
                .setPosition(width / 2, height * 0.55)
                .setFontSize(Math.min(width * 0.05, 20));

            this.pressBtnText
                .setPosition(width / 2 - 55, height * 0.62)
                .setFontSize(Math.min(width * 0.05, 20));

            this.helpIcon.setPosition(width / 2 + 10, height * 0.62);

            this.pressBtn2Text
                .setPosition(width / 2 + 70, height * 0.62)
                .setFontSize(Math.min(width * 0.05, 20));

            this.startGameBtn
                .setPosition(width / 2, height * 0.85)
                .setFontSize(Math.min(width * 0.05, 25));

            this.startGameBtnBackground
                .setPosition(width / 2, height * 0.85)
                .setSize(
                    Math.min(width * 0.25, 200),
                    Math.min(height * 0.1, 40)
                );

            this.popupBg.setPosition(width / 2, height / 2).setSize(300, 200);

            this.popupText
                .setPosition(width / 2, height / 2 - 40)
                .setFontSize(Math.min(width * 0.05, 25));

            this.yesButton
                .setPosition(width / 2 - 60, height / 2 + 40)
                .setSize(80, 40);

            this.yesText
                .setPosition(width / 2 - 60, height / 2 + 40)
                .setFontSize(Math.min(width * 0.05, 25));

            this.noButton
                .setPosition(width / 2 + 60, height / 2 + 40)
                .setSize(80, 40);

            this.noText
                .setPosition(width / 2 + 60, height / 2 + 40)
                .setFontSize(Math.min(width * 0.05, 25));

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize error:", e);
        }
    }
}

