import { EventBus } from "../EventBus";
import { Scene } from "phaser";

import { AudioManager } from "../AudioManager";

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

        // Ensure AudioManager is instantiated and persistent
        if (!this.sys.game.audioManager) {
            this.sys.game.audioManager = new AudioManager(this); // Create AudioManager only once
        }

        this.audioManager = this.sys.game.audioManager;
        this.audioManager.create(); // Initialize audio

        // Create the mute button in the scene
        if (!this.muteButton) {
            this.muteButton = this.add
                .image(this.scale.width - 30, this.scale.height - 30, "star")
                .setOrigin(0.5)
                .setScale(0.5)
                .setInteractive()
                .setDepth(200);

            this.muteButton.on("pointerdown", () => this.toggleMute());
        }

        //----------------------------------------------------------

        this.titleBG = this.add
            .rectangle(
                this.scale.width / 2, // Center horizontally
                0, // Touch the top
                this.scale.width,
                Math.min(this.scale.height * 0.12, 100),
                0x4a63e4
            )
            .setAlpha(0.85)
            .setOrigin(0.5, 0) // Center horizontally, ancho at top
            .setDepth(99); // Make sure the background is behind the text

        this.titleText = this.add
            .text(
                this.scale.width / 2,
                Math.min(this.scale.height * 0.12, 100) / 2, // Vertically center text within rectangle
                "A N A G R A M S",
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
                this.scale.height * 0.26,
                "Unscramble the anagram within 30 seconds! Reach a high enough score, and you might unlock more pages.",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.06, 35),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.7 },
                    lineSpacing: 10,
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.warningText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.48,
                "⚠ Note: Not all words formed are valid answers. If you leave mid-game after using a key, you'll lose it and must start over.",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.06, 35),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                    lineSpacing: 10,
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.helpText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.62,
                "Do you want help?",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 35),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.pressBtnText = this.add
            .text(
                this.scale.width / 2 - 75,
                this.scale.height * 0.7,
                "Press the",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 35),
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.helpIcon = this.add
            .image(this.pressBtnText.width / 2, this.scale.height * 0.7, "help")
            .setDepth(100)
            .setScale(1); // Resize the icon if needed

        this.pressBtn2Text = this.add
            .text(
                this.scale.width / 2 + 70,
                this.scale.height * 0.7,
                "for help!",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 35),
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.rewardInfo = this.add
            .text(this.scale.width / 2 - 80, this.scale.height * 0.79, "1  x", {
                fontFamily: "CustomFont",
                fontSize: Math.min(this.scale.width * 0.05, 35),
                color: "#000000",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.keyIcon = this.add
            .image(this.scale.width / 2 - 25, this.scale.height * 0.79, "key")
            .setDepth(100)
            .setScale(2);

        this.rewardInfo2 = this.add
            .text(
                this.scale.width / 2 + 60,
                this.scale.height * 0.79,
                "required",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 35),
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        const btnWidth = Math.min(this.scale.width * 0.25, 200);
        const btnHeight = Math.min(this.scale.height * 0.1, 40);
        const radius = 5;
        const x = this.scale.width / 2;
        const y = this.scale.height * 0.9;

        // Shadow using Graphics with rounded corners
        this.shadow = this.add.graphics();
        this.shadow.fillStyle(0x000000, 0.3); // semi-transparent black
        this.shadow
            .fillRoundedRect(
                x - btnWidth / 2 + 4,
                y - btnHeight / 2 + 4,
                btnWidth,
                btnHeight,
                radius
            )
            .setDepth(98);

        // Button background
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x4a63e4, 1); // Default color
        this.graphics
            .fillRoundedRect(
                x - btnWidth / 2,
                y - btnHeight / 2,
                btnWidth,
                btnHeight,
                radius
            )
            .setDepth(99);

        // Invisible hit area for interaction
        this.startGameBtnBackground = this.add
            .rectangle(x, y, btnWidth, btnHeight) // Setting color of the button
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(100);

        this.startGameBtn = this.add
            .text(x, y, "Start", {
                fontFamily: "CustomFont",
                fontSize: Math.min(this.scale.width * 0.05, 40),
                color: "#ffffff",
                align: "center",
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        //----------------------------------------------------------
        // Shadow layer
        this.popupShadow = this.add.graphics();
        this.popupShadow
            .fillStyle(0x000000, 0.3) // black with opacity
            .fillRoundedRect(
                this.scale.width / 2 - 175 + 5, // slight x offset
                this.scale.height / 2 + 100 + 5, // slight y offset
                this.scale.width * 0.4,
                this.scale.height * 0.3,
                10
            )
            .setDepth(199) // behind the main popup
            .setVisible(false);

        this.popupBg = this.add.graphics();
        this.popupBg
            .lineStyle(2, 0x000000, 1)
            .fillStyle(0xffffff, 1)
            .fillRoundedRect(
                this.scale.width / 2 - 175,
                this.scale.height / 2 + 100,
                this.scale.width * 0.4,
                this.scale.height * 0.3,
                10
            )
            .strokeRoundedRect(
                this.scale.width / 2 - 175,
                this.scale.height / 2 + 100,
                this.scale.width * 0.4,
                this.scale.height * 0.3,
                20
            )
            .setDepth(200)
            .setVisible(false);

        this.popupText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2 + 140,
                "Use 1 key to start the game?",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 30),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(201)
            .setVisible(false);

        this.popupRewardText = this.add
            .text(
                this.scale.width / 2 - 40,
                this.scale.height / 2 + 190,
                "1  x",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.06, 45),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(202)
            .setVisible(false);

        this.popupkeyIcon = this.add
            .image(
                this.scale.width / 2 + 30,
                this.scale.height / 2 + 190,
                "key"
            )
            .setDepth(203)
            .setScale(2.5)
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
            .setDepth(204)
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
            .setDepth(205)
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
            .setDepth(206)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        this.noText = this.add
            .text(this.scale.width / 2 + 60, this.scale.height / 2 + 40, "No", {
                fontFamily: "Arial",
                fontSize: Math.min(this.scale.width * 0.05, 25),
                color: "#000000",
            })
            .setOrigin(0.5)
            .setDepth(207)
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

        const drawButton = (color = 0x4a63e4, offsetY = 0) => {
            this.graphics.clear();
            this.graphics.fillStyle(color, 1);
            this.graphics.fillRoundedRect(
                x - btnWidth / 2,
                y - btnHeight / 2 + offsetY,
                btnWidth,
                btnHeight,
                radius
            );

            // Move the text accordingly
            this.startGameBtn.setPosition(x, y + offsetY); // Keep the text centered with the button
        };

        // Initial draw
        drawButton();

        // Hover effect (for both button and text)
        const onHover = () => {
            drawButton(0x1d329f); // Hover color
        };

        const offHover = () => {
            drawButton(0x4a63e4); // Default color
            this.shadow.setVisible(true);
        };

        // Apply hover effect to both the background and the text
        this.startGameBtnBackground.on("pointerover", onHover);
        this.startGameBtn.on("pointerover", onHover);

        // Hover out effect
        this.startGameBtnBackground.on("pointerout", offHover);
        this.startGameBtn.on("pointerout", offHover);

        // Press down effect
        this.startGameBtnBackground.on("pointerdown", () => {
            drawButton(0x1d329f, 2); // Pressed color + offset
            this.shadow.setVisible(false);
        });

        this.startGameBtn.on("pointerdown", () => {
            drawButton(0x1d329f, 2); // Pressed color + offset
            this.shadow.setVisible(false);
        });

        // Release effect
        this.startGameBtnBackground.on("pointerup", () => {
            drawButton(0x1d329f); // Reset to hover color
            this.shadow.setVisible(true);
        });

        this.startGameBtn.on("pointerup", () => {
            drawButton(0x1d329f); // Reset to hover color
            this.shadow.setVisible(true);
        });

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
        this.popupShadow.setVisible(true);
        this.popupBg.setVisible(true);
        this.popupText.setVisible(true);
        this.popupRewardText.setVisible(true);
        this.popupkeyIcon.setVisible(true);
        this.yesButton.setVisible(true);
        this.yesText.setVisible(true);
        this.noButton.setVisible(true);
        this.noText.setVisible(true);
    }

    // Hide popup function
    hidePopup() {
        this.popupShadow.setVisible(false);
        this.popupBg.setVisible(false);
        this.popupText.setVisible(false);
        this.popupRewardText.setVisible(false);
        this.popupkeyIcon.setVisible(false);
        this.yesButton.setVisible(false);
        this.yesText.setVisible(false);
        this.noButton.setVisible(false);
        this.noText.setVisible(false);
    }

    toggleMute() {
        this.audioManager.toggleMute();
        if (this.audioManager.isMuted) {
            this.muteButton.setAlpha(0.5); // Dim the button if muted
        } else {
            this.muteButton.setAlpha(1); // Brighten the button if not muted
        }
    }

    update() {
        // Only update button position if the size has changed
        if (
            this.lastWidth !== this.scale.width ||
            this.lastHeight !== this.scale.height
        ) {
            this.resize({ width: this.scale.width, height: this.scale.height });
        }

        this.audioManager.update(); // Update the audio state (e.g., background music position)
    }

    changeScene() {
        if (this.scene.isActive("AnagramInstruc")) {
            this.scene.stop("AnagramInstruc");
            this.scene.start("AnagramGame");
            EventBus.emit("scene-changed", "AnagramGame");
        }
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
                .setSize(width, Math.min(height * 0.12, 100));

            this.titleText
                .setPosition(
                    width / 2,
                    Math.min(this.scale.height * 0.12, 100) / 2
                )
                .setFontSize(Math.min(width * 0.08, 65));

            this.instrucText
                .setPosition(width / 2, height * 0.26)
                .setFontSize(Math.min(width * 0.06, 35));

            this.warningText
                .setPosition(width / 2, height * 0.48)
                .setFontSize(Math.min(width * 0.05, 35));

            this.helpText
                .setPosition(width / 2, height * 0.62)
                .setFontSize(Math.min(width * 0.05, 35));

            this.pressBtnText
                .setPosition(width / 2 - 75, height * 0.7)
                .setFontSize(Math.min(width * 0.05, 35));

            this.helpIcon.setPosition(width / 2, height * 0.7);

            this.pressBtn2Text
                .setPosition(width / 2 + 70, height * 0.7)
                .setFontSize(Math.min(width * 0.05, 35));

            this.rewardInfo
                .setPosition(width / 2 - 80, height * 0.79)
                .setFontSize(Math.min(width * 0.05, 35));

            this.keyIcon.setPosition(width / 2 - 25, height * 0.79);

            this.rewardInfo2
                .setPosition(width / 2 + 60, height * 0.79)
                .setFontSize(Math.min(width * 0.05, 35));

            // Dynamically adjust button's position based on the screen size
            const btnWidth = Math.min(width * 0.25, 200);
            const btnHeight = Math.min(height * 0.1, 40);
            const x = width / 2;
            const y = height * 0.9;

            // Invisible hit area for interaction
            this.startGameBtnBackground
                .setPosition(x, y)
                .setSize(btnWidth, btnHeight);

            // Update button's text position accordingly
            this.startGameBtn
                .setPosition(x, y)
                .setFontSize(Math.min(width * 0.05, 40));

            this.popupShadow.clear();
            this.popupShadow.fillStyle(0x000000, 0.3);
            this.popupShadow.fillRoundedRect(
                width / 2 - 175 + 5,
                height / 2 + 100 + 5,
                width * 0.4,
                height * 0.3,
                10
            );

            this.popupBg.clear();
            this.popupBg.fillStyle(0xffffff, 1);
            this.popupBg.fillRoundedRect(
                width / 2 - 175,
                height / 2 + 100,
                width * 0.4,
                height * 0.3,
                10
            );
            this.popupBg.lineStyle(2, 0x000000, 1);
            this.popupBg.strokeRoundedRect(
                width / 2 - 175,
                height / 2 + 100,
                width * 0.4,
                height * 0.3,
                10
            );

            this.popupText
                .setPosition(width / 2, height / 2 + 140)
                .setFontSize(Math.min(width * 0.05, 30));

            this.popupRewardText
                .setPosition(width / 2 - 40, height / 2 + 190)
                .setFontSize(Math.min(width * 0.06, 45));

            this.popupkeyIcon.setPosition(width / 2 + 30, height / 2 + 190);

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

            this.muteButton.setPosition(width - 30, height - 30);

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize error:", e);
        }
    }
}

