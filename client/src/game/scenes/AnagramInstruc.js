import { EventBus } from "../EventBus";
import { Scene } from "phaser";

import { AudioManager } from "../AudioManager";

export class AnagramInstruc extends Scene {
    background;
    audioManager;
    muteButton;
    titleBG;
    titleText;
    instrucText;
    warningText;
    helpText;
    pressBtnText;
    helpIcon;
    pressBtn2Text;
    rewardInfo;
    keyIcon;
    rewardInfo2;
    startShadow;
    startBG;
    startZone;
    startText;
    popupShadow;
    popupBg;
    popupText;
    popupRewardText;
    popupkeyIcon;
    confirmShadow;
    confirmBg;
    confirmZone;
    confirmText;

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
            .image(this.scale.width / 2, this.scale.height * 0.7, "help")
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

        //----------------------------------------------------------

        const startWidth = Math.min(this.scale.width * 0.25, 200);
        const startHeight = Math.min(this.scale.height * 0.1, 40);

        this.startShadow = this.add.graphics();
        this.startShadow
            .fillStyle(0x000000, 0.3)
            .fillRoundedRect(
                this.scale.width / 2 - 100 + 4,
                this.scale.height * 0.87 + 4,
                startWidth,
                startHeight,
                5
            )
            .setDepth(98);

        this.startBG = this.add.graphics();
        const drawStartBg = (color = 0x4a63e4, offsetX = 0, offsetY = 0) => {
            this.startBG.clear();
            this.startBG
                .fillStyle(color, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 100 + offsetX,
                    this.scale.height * 0.87 + offsetY,
                    startWidth,
                    startHeight,
                    5
                )
                .setDepth(99);
        };

        drawStartBg();

        this.startZone = this.add
            .zone(
                this.scale.width / 2 - 100,
                this.scale.height * 0.87,
                startWidth,
                startHeight
            )
            .setOrigin(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        this.startText = this.add
            .text(this.scale.width / 2, this.scale.height * 0.9, "Start", {
                fontFamily: "CustomFont",
                fontSize: Math.min(this.scale.width * 0.05, 40),
                color: "#ffffff",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        this.startZone
            .on("pointerover", () => {
                drawStartBg(0x1d329f); // Hover color
            })
            .on("pointerout", () => {
                drawStartBg(0x4a63e4); // Default color
                this.startText.setY(this.scale.height * 0.9);
            })
            .on("pointerdown", () => {
                drawStartBg(0x16296c, 4, 4); // Pressed color + offset
                this.startText.setY(this.scale.height * 0.9 + 2);
                this.showPopup();
            })
            .on("pointerup", () => {
                drawStartBg(0x4a63e4); // Reset to hover color
                this.startText.setY(this.scale.height * 0.9);
            });

        this.startText
            .on("pointerover", () => {
                drawStartBg(0x1d329f); // Hover color
            })
            .on("pointerout", () => {
                drawStartBg(0x4a63e4); // Default color
                this.startText.setY(this.scale.height * 0.9);
            })
            .on("pointerdown", () => {
                drawStartBg(0x16296c, 4, 4); // Pressed color + offset
                this.startText.setY(this.scale.height * 0.9 + 2);
                this.showPopup();
            })
            .on("pointerup", () => {
                drawStartBg(0x4a63e4); // Reset to hover color
                this.startText.setY(this.scale.height * 0.9);
            });

        //----------------------------------------------------------

        this.popupShadow = this.add.graphics();
        this.popupShadow
            .fillStyle(0x000000, 0.3) // black with opacity
            .fillRoundedRect(
                this.scale.width / 2 - 170 + 5, // slight x offset
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
                this.scale.width / 2 - 170,
                this.scale.height / 2 + 100,
                this.scale.width * 0.4,
                this.scale.height * 0.3,
                10
            )
            .strokeRoundedRect(
                this.scale.width / 2 - 170,
                this.scale.height / 2 + 100,
                this.scale.width * 0.4,
                this.scale.height * 0.3,
                10
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

        const confirmWidth = Math.min(this.scale.width * 0.25, 200);
        const confirmHeight = Math.min(this.scale.height * 0.1, 40);

        this.confirmShadow = this.add.graphics();
        this.confirmShadow
            .fillStyle(0x000000, 0.3)
            .fillRoundedRect(
                this.scale.width / 2 - 100 + 4, // slight x offset
                this.scale.height / 2 + 230 + 4, // slight y offset
                confirmWidth,
                confirmHeight,
                5
            )
            .setDepth(204) // behind the main popup
            .setVisible(false);

        this.confirmBg = this.add.graphics();
        const drawConfirmBg = (color = 0x4a63e4, offsetX = 0, offsetY = 0) => {
            this.confirmBg.clear();
            this.confirmBg
                .fillStyle(color, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 100 + offsetX,
                    this.scale.height / 2 + 230 + offsetY,
                    confirmWidth,
                    confirmHeight,
                    5
                )
                .setDepth(205);
        };

        drawConfirmBg();
        this.confirmBg.setVisible(false); // Only hide once here

        this.confirmZone = this.add
            .zone(
                this.scale.width / 2 - 100,
                this.scale.height / 2 + 230,
                confirmWidth,
                confirmHeight
            )
            .setOrigin(0)
            .setDepth(206)
            .setVisible(false)
            .setInteractive({ useHandCursor: true });

        this.confirmText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2 + 250,
                "Confirm",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 35),
                    color: "#ffffff",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(207)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        // Add press down effect
        this.confirmZone
            .on("pointerover", () => {
                drawConfirmBg(0x16296c);
            })
            .on("pointerdown", () => {
                drawConfirmBg(0x16296c, 4, 4); // darker press color
                this.confirmText.setY(this.scale.height / 2 + 252);
                this.changeScene();
            })
            .on("pointerup", () => {
                drawConfirmBg(0x4a63e4); // back to original
                this.confirmText.setY(this.scale.height / 2 + 250);
            })
            .on("pointerout", () => {
                drawConfirmBg(0x4a63e4); // reset color if mouse leaves
                this.confirmText.setY(this.scale.height / 2 + 250);
            });

        // Optional: same for text click too
        this.confirmText
            .on("pointerover", () => {
                drawConfirmBg(0x16296c);
            })
            .on("pointerdown", () => {
                drawConfirmBg(0x16296c, 4, 4);
                this.confirmText.setY(this.scale.height / 2 + 252);
                this.changeScene();
            })
            .on("pointerup", () => {
                drawConfirmBg(0x4a63e4);
                this.confirmText.setY(this.scale.height / 2 + 250);
            })
            .on("pointerout", () => {
                drawConfirmBg(0x4a63e4);
                this.confirmText.setY(this.scale.height / 2 + 250);
            });

        //----------------------------------------------------------

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

        // Clean up listeners on scene shutdown
        this.events.once("shutdown", this.cleanup, this);
    }

    // Show popup function
    showPopup() {
        this.popupShadow.setVisible(true);
        this.popupBg.setVisible(true);
        this.popupText.setVisible(true);
        this.popupRewardText.setVisible(true);
        this.popupkeyIcon.setVisible(true);
        this.confirmShadow.setVisible(true);
        this.confirmBg.setVisible(true);
        this.confirmZone.setVisible(true);
        this.confirmText.setVisible(true);
    }

    toggleMute() {
        this.audioManager.toggleMute();
        if (this.audioManager.isMuted) {
            this.muteButton.setAlpha(0.5); // Dim the button if muted
            this.registry.set("isMuted", true); // Save mute state to registry
        } else {
            this.muteButton.setAlpha(1); // Brighten the button if not muted
            this.registry.set("isMuted", false); // Save unmute state to registry
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
        // Save the mute state to the registry before changing the scene
        const isMuted = this.audioManager.isMuted; // Get the current mute state
        this.registry.set("isMuted", isMuted); // Store it in the registry

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
            if (!this.instrucText || !this.startText || !this.startZone) {
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

            //----------------------------------------------------------

            const startWidth = Math.min(width * 0.25, 200);
            const startHeight = Math.min(height * 0.1, 40);

            this.startShadow.clear();
            this.startShadow
                .fillStyle(0x000000, 0.3)
                .fillRoundedRect(
                    this.scale.width / 2 - 100 + 4,
                    this.scale.height * 0.87 + 4,
                    startWidth,
                    startHeight,
                    5
                );

            this.startBG.clear();
            this.startBG
                .fillStyle(0x4a63e4, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 100,
                    this.scale.height * 0.87,
                    startWidth,
                    startHeight,
                    5
                );

            this.startZone
                .setPosition(width / 2 - 100, height * 0.87)
                .setSize(startWidth, startHeight);

            this.startText
                .setPosition(width / 2, height * 0.9)
                .setFontSize(Math.min(width * 0.05, 40));

            //----------------------------------------------------------

            this.popupShadow.clear();
            this.popupShadow
                .fillStyle(0x000000, 0.3)
                .fillRoundedRect(
                    width / 2 - 170 + 5,
                    height / 2 + 100 + 5,
                    width * 0.4,
                    height * 0.3,
                    10
                );

            this.popupBg.clear();
            this.popupBg
                .fillStyle(0xffffff, 1)
                .fillRoundedRect(
                    width / 2 - 170,
                    height / 2 + 100,
                    width * 0.4,
                    height * 0.3,
                    10
                )
                .lineStyle(2, 0x000000, 1)
                .strokeRoundedRect(
                    width / 2 - 170,
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

            //----------------------------------------------------------

            const confirmWidth = Math.min(this.scale.width * 0.25, 200);
            const confirmHeight = Math.min(this.scale.height * 0.1, 40);

            this.confirmShadow.clear();
            this.confirmShadow
                .fillStyle(0x000000, 0.3)
                .fillRoundedRect(
                    this.scale.width / 2 - 100 + 4,
                    this.scale.height / 2 + 230 + 4,
                    confirmWidth,
                    confirmHeight,
                    5
                );

            this.confirmBg.clear();
            this.confirmBg
                .fillStyle(0x4a63e4, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 100,
                    this.scale.height / 2 + 230,
                    confirmWidth,
                    confirmHeight,
                    5
                );

            this.confirmZone
                .setPosition(width / 2 - 100, height / 2 + 230)
                .setSize(confirmWidth, confirmHeight);

            this.confirmText
                .setPosition(width / 2, height / 2 + 250)
                .setFontSize(Math.min(width * 0.05, 35));

            //----------------------------------------------------------

            this.muteButton.setPosition(width - 30, height - 30);

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize error:", e);
        }
    }

    cleanup() {
        // Remove pointer event listeners for 'pointerdown', 'pointerup', 'pointerover', and 'pointerout'
        this.input.off("pointerdown", this.handlePointerDown, this);
        this.input.off("pointerup", this.handlePointerUp, this);
        this.input.off("pointerover", this.handlePointerOver, this);
        this.input.off("pointerout", this.handlePointerOut, this);
    }
}

