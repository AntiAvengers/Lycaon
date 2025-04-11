import { EventBus } from "../EventBus";
import { Scene } from "phaser";

import { AudioManager } from "../AudioManager";

export class AnagramGame extends Scene {
    background;
    audioManager;
    muteButton;
    anagramBG;
    anagramText;
    timerText;
    wordDisplay;
    wordCountText;
    errorMessage;
    inputBG;
    inputField;
    clearShadow;
    clearBg;
    clearZone;
    clearText;
    helpIcon;
    popupBg;
    popupText;
    closeBtn;
    closeText;
    timerEvent;
    errorMessageTween;

    lastWidth = null;
    lastHeight = null;

    constructor() {
        super("AnagramGame");
        this.timerText = null;
        this.remainingTime = 30;
        this.wordList = [];
        this.inputText = "";
    }

    preload() {
        console.log("AnagramGame scene preloading");
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
                .image(this.scale.width - 70, this.scale.height - 30, "star")
                .setOrigin(0.5)
                .setScale(0.5)
                .setInteractive()
                .setDepth(198);

            this.muteButton.on("pointerdown", () => this.toggleMute());
        }

        // Retrieve the mute state from the registry
        const isMuted = this.registry.get("isMuted");

        // Update the mute button's visual state
        if (isMuted) {
            this.muteButton.setAlpha(0.5); // Dim the button if muted
        } else {
            this.muteButton.setAlpha(1); // Brighten the button if not muted
        }

        //----------------------------------------------------------

        this.anagramBG = this.add
            .rectangle(
                this.scale.width / 2,
                0,
                this.scale.width,
                Math.min(this.scale.height * 0.12, 100),
                0x4a63e4
            )
            .setAlpha(0.85)
            .setOrigin(0.5, 0)
            .setDepth(99);

        this.anagramText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height + Math.min(this.scale.height * 0.12, 100) / 2, // Vertically center text within rectangle
                "E  I  T  S  P",
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

        this.timerText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.2,
                this.formatTime(this.remainingTime),
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.125, 90),
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.wordDisplay = this.add
            .text(this.scale.width / 2, this.scale.height * 0.38, " ", {
                fontFamily: "CustomFont",
                fontSize: Math.min(this.scale.width * 0.06, 45),
                color: "#000000",
                align: "center",
                wordWrap: { width: this.scale.width * 0.8 },
                lineSpacing: 10,
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.wordCountText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.55,
                "0 Words Found",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.06, 50),
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.errorMessage = this.add
            .text(this.scale.width / 2, this.scale.height * 0.63, "", {
                fontFamily: "CustomFont",
                fontSize: Math.min(this.scale.width * 0.06, 45),
                color: "#ff0000",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setAlpha(0); // Start hidden

        this.inputBG = this.add
            .rectangle(
                this.scale.width / 2,
                this.scale.height * 0.72,
                Math.min(this.scale.width * 0.5, 275),
                Math.min(this.scale.height * 0.1, 65),
                0xffffff
            )
            .setOrigin(0.5)
            .setDepth(99);

        // Create the bottom border if it doesn't exist
        if (!this.bottomBorder) {
            this.bottomBorder = this.add.graphics();
            this.bottomBorder
                .lineStyle(4, 0x000000, 1) // Black line, 2px thickness
                .setDepth(100); // Ensure it's above the rectangle
        }

        this.inputField = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.72,
                "Start Typing!",
                {
                    fontFamily: "CustomFont",
                    color: "#CFCFCF",
                    fontSize: Math.min(this.scale.width * 0.07, 60),
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        //----------------------------------------------------------

        const clearWidth = Math.min(this.scale.width * 0.25, 200);
        const clearHeight = Math.min(this.scale.height * 0.1, 40);

        this.clearShadow = this.add.graphics();
        this.clearShadow
            .fillStyle(0x000000, 0.3)
            .fillRoundedRect(
                this.scale.width / 2 - 215 + 4,
                this.scale.height * 0.82 + 4,
                clearWidth,
                clearHeight,
                5
            )
            .setDepth(98);

        this.clearBg = this.add.graphics();
        const drawClearBg = (color = 0xdadada, offsetX = 0, offsetY = 0) => {
            this.clearBg.clear();
            this.clearBg
                .fillStyle(color, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 215 + offsetX,
                    this.scale.height * 0.82 + offsetY,
                    clearWidth,
                    clearHeight,
                    5
                )
                .setDepth(99);
        };

        this.clearZone = this.add
            .zone(
                this.scale.width / 2 - 215,
                this.scale.height * 0.82,
                clearWidth,
                clearHeight
            )
            .setOrigin(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        this.clearText = this.add
            .text(
                this.scale.width / 2 - 115,
                this.scale.height * 0.85,
                "Clear",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 30),
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        drawClearBg();

        this.clearZone
            .on("pointerover", () => {
                drawClearBg(0xb0b0b0); // Hover color
            })
            .on("pointerout", () => {
                drawClearBg(0xdadada); // Default color
                this.clearText.setY(this.scale.height * 0.85);
            })
            .on("pointerdown", () => {
                drawClearBg(0xb0b0b0, 4, 4);
                this.clearText.setY(this.scale.height * 0.85 + 2);
                if (this.inputField) {
                    this.inputField.setText("");
                    this.inputText = "";
                }
            })
            .on("pointerup", () => {
                drawClearBg(0xdadada); // Reset to hover color
                this.clearText.setY(this.scale.height * 0.85);
            });

        this.clearText
            .on("pointerover", () => {
                drawClearBg(0xb0b0b0); // Hover color
            })
            .on("pointerout", () => {
                drawClearBg(0xdadada); // Default color
                this.clearText.setY(this.scale.height * 0.85);
            })
            .on("pointerdown", () => {
                drawClearBg(0xb0b0b0, 4, 4);
                this.clearText.setY(this.scale.height * 0.85 + 2);
                if (this.inputField) {
                    this.inputField.setText("");
                    this.inputText = "";
                }
            })
            .on("pointerup", () => {
                drawClearBg(0xdadada); // Reset to hover color
                this.clearText.setY(this.scale.height * 0.85);
            });

        //----------------------------------------------------------

        const submitWidth = Math.min(this.scale.width * 0.25, 200);
        const submitHeight = Math.min(this.scale.height * 0.1, 40);

        this.submitShadow = this.add.graphics();
        this.submitShadow
            .fillStyle(0x000000, 0.3)
            .fillRoundedRect(
                this.scale.width / 2 + 10 + 4,
                this.scale.height * 0.82 + 4,
                submitWidth,
                submitHeight,
                5
            )
            .setDepth(98);

        this.submitBg = this.add.graphics();
        const drawSubmitBg = (color = 0x4a63e4, offsetX = 0, offsetY = 0) => {
            this.submitBg.clear();
            this.submitBg
                .fillStyle(color, 1)
                .fillRoundedRect(
                    this.scale.width / 2 + 10 + offsetX,
                    this.scale.height * 0.82 + offsetY,
                    submitWidth,
                    submitHeight,
                    5
                )
                .setDepth(99);
        };

        this.submitZone = this.add
            .zone(
                this.scale.width / 2 + 10,
                this.scale.height * 0.82,
                submitWidth,
                submitHeight
            )
            .setOrigin(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        this.submitText = this.add
            .text(
                this.scale.width / 2 + 110,
                this.scale.height * 0.85,
                "Submit",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 30),
                    color: "#ffffff",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        drawSubmitBg();

        this.submitZone
            .on("pointerover", () => {
                drawSubmitBg(0x1d329f); // Hover color
            })
            .on("pointerout", () => {
                drawSubmitBg(0x4a63e4); // Default color
                this.submitText.setY(this.scale.height * 0.85);
            })
            .on("pointerdown", () => {
                drawSubmitBg(0x16296c, 4, 4); // Pressed color + offset
                this.submitText.setY(this.scale.height * 0.85 + 2);
                this.handleWordSubmit();
            })
            .on("pointerup", () => {
                drawSubmitBg(0x4a63e4); // Reset to hover color
                this.submitText.setY(this.scale.height * 0.85);
            });

        this.submitText
            .on("pointerover", () => {
                drawSubmitBg(0x1d329f); // Hover color
            })
            .on("pointerout", () => {
                drawSubmitBg(0x4a63e4); // Default color
                this.submitText.setY(this.scale.height * 0.85);
            })
            .on("pointerdown", () => {
                drawSubmitBg(0x16296c, 4, 4); // Pressed color + offset
                this.submitText.setY(this.scale.height * 0.85 + 2);
                this.handleWordSubmit();
            })
            .on("pointerup", () => {
                drawSubmitBg(0x4a63e4); // Reset to hover color
                this.submitText.setY(this.scale.height * 0.85);
            });

        //----------------------------------------------------------

        this.helpIcon = this.add
            .image(this.scale.width - 30, this.scale.height - 30, "help")
            .setOrigin(0.5)
            .setScale(1) // Resize the icon if needed
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        this.helpIcon.on("pointerover", () => {
            this.helpIcon.setScale(1.1); // Slightly increase size
        });

        this.helpIcon.on("pointerout", () => {
            this.helpIcon.setScale(1); // Reset size
        });

        // Click event
        this.helpIcon.on("pointerdown", () => {
            console.log("Button clicked!");
            // Animate the button being pressed down
            this.tweens.add({
                targets: this.helpIcon,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 100,
                yoyo: true, // Make it return to the original scale
                onComplete: () => {
                    this.showPopup(); // Show the popup after the press animation completes
                },
            });
        });

        //----------------------------------------------------------

        this.blurOverlay = this.add
            .rectangle(0, 0, this.scale.width, this.scale.height, 0xb0b0b0)
            .setOrigin(0)
            .setDepth(199)
            .setVisible(false);

        this.popupBg = this.add.graphics();
        this.popupBg
            .fillStyle(0xffffff, 1)
            .fillRoundedRect(
                this.scale.width / 2 - 250,
                this.scale.height / 2 - 160,
                this.scale.width * 0.6,
                this.scale.height * 0.55,
                10
            )
            .setDepth(200)
            .setVisible(false);

        this.popupText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2 - 70,
                "Unscramble the anagram within 30 seconds! Reach a high enough score, and you might unlock more pages.",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 30),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.5 },
                    lineSpacing: 7,
                }
            )
            .setOrigin(0.5)
            .setDepth(201)
            .setVisible(false);

        this.popupText2 = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2 + 30,
                "⚠ Note: Not all words formed are valid answers.",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 30),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.4 },
                    lineSpacing: 7,
                }
            )
            .setOrigin(0.5)
            .setDepth(202)
            .setVisible(false);

        const resumeWidth = Math.min(this.scale.width * 0.25, 200);
        const resumeHeight = Math.min(this.scale.height * 0.1, 40);

        this.resumeShadow = this.add.graphics();
        this.resumeShadow
            .fillStyle(0x000000, 0.3)
            .fillRoundedRect(
                this.scale.width / 2 - 100 + 4,
                this.scale.height / 2 + 90 + 4,
                resumeWidth,
                resumeHeight,
                5
            )
            .setDepth(201)
            .setVisible(false);

        this.resumeBg = this.add.graphics();
        const drawResumeBg = (color = 0x4a63e4, offsetX = 0, offsetY = 0) => {
            this.resumeBg.clear();
            this.resumeBg
                .fillStyle(color, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 100 + offsetX,
                    this.scale.height / 2 + 90 + offsetY,
                    resumeWidth,
                    resumeHeight,
                    5
                )
                .setDepth(202);
        };

        this.resumeBg.setVisible(false);

        this.resumeZone = this.add
            .zone(
                this.scale.width / 2 - 100,
                this.scale.height / 2 + 90,
                resumeWidth,
                resumeHeight
            )
            .setOrigin(0)
            .setDepth(203)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        this.resumeText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2 + 110,
                "Resume Game",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.05, 35),
                    color: "#ffffff",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(203)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        drawResumeBg();

        this.resumeZone
            .on("pointerover", () => {
                drawResumeBg(0x1d329f); // Hover color
            })
            .on("pointerout", () => {
                drawResumeBg(0x4a63e4); // Default color
                this.resumeText.setY(this.scale.height / 2 + 110);
            })
            .on("pointerdown", () => {
                drawResumeBg(0x16296c, 4, 4); // Pressed color + offset
                this.resumeText.setY(this.scale.height / 2 + 110 + 2);
                this.hidePopup();
            })
            .on("pointerup", () => {
                drawResumeBg(0x4a63e4); // Reset to hover color
                this.resumeText.setY(this.scale.height / 2 + 110);
            });

        this.resumeText
            .on("pointerover", () => {
                drawResumeBg(0x1d329f); // Hover color
            })
            .on("pointerout", () => {
                drawResumeBg(0x4a63e4); // Default color
                this.resumeText.setY(this.scale.height / 2 + 110);
            })
            .on("pointerdown", () => {
                drawResumeBg(0x16296c, 4, 4); // Pressed color + offset
                this.resumeText.setY(this.scale.height / 2 + 110 + 2);
                this.hidePopup();
            })
            .on("pointerup", () => {
                drawResumeBg(0x4a63e4); // Reset to hover color
                this.resumeText.setY(this.scale.height / 2 + 110);
            });

        //----------------------------------------------------------

        // Listen to key events (this handles the text input)
        this.input.keyboard.on("keydown", (event) => {
            const key = event.key;
            // If the Enter key is pressed, submit the word
            if (key === "Enter") {
                event.preventDefault(); // Prevent default behavior
                console.log("Enter pressed! Submitting...");
                this.handleWordSubmit();
            } else if (key === "Backspace") {
                this.inputText = this.inputText.slice(0, -1); // Remove last character
                this.updateInputField();
            } else if (/^[a-zA-Z]$/.test(key)) {
                if (this.inputText.length < 5) {
                    this.inputText += key.toUpperCase(); // Append character to inputText
                    this.updateInputField();
                } else {
                    // Show message when trying to type more than 8 characters
                    this.showErrorMessage("Maximum 5 letters allowed!");
                }
            }
        });

        //----------------------------------------------------------

        this.startTimer();

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

    showPopup() {
        this.popupBg.setVisible(true);
        this.popupText.setVisible(true);
        this.popupText2.setVisible(true);
        this.resumeShadow.setVisible(true);
        this.resumeBg.setVisible(true);
        this.resumeZone.setVisible(true);
        this.resumeText.setVisible(true);
        this.blurOverlay.setVisible(true);

        // Pause timer
        if (this.timerEvent) {
            this.timerEvent.paused = true;
        }
    }

    hidePopup() {
        this.popupBg.setVisible(false);
        this.popupText.setVisible(false);
        this.popupText2.setVisible(false);
        this.resumeShadow.setVisible(false);
        this.resumeBg.setVisible(false);
        this.resumeZone.setVisible(false);
        this.resumeText.setVisible(false);
        this.blurOverlay.setVisible(false);

        // Resume timer and manually check if time is up
        if (this.timerEvent) {
            this.timerEvent.paused = false;
            if (this.remainingTime <= 0) {
                this.timeIsUp(); // Manually call timeIsUp if time has already run out
            }
        }
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

    updateInputField() {
        this.inputField.setText(this.inputText); // Update the input text display

        // Change text color to black when the user starts typing
        if (this.inputText.length > 0) {
            this.inputField.setStyle({ color: "#000000" });
        } else {
            this.inputField.setStyle({ color: "#CFCFCF" }); // Grey when empty
        }
    }

    handleWordSubmit() {
        const enteredWord = this.inputText.trim();

        // Check for invalid characters (anything other than letters)
        if (!/^[a-zA-Z]+$/.test(enteredWord)) {
            this.showErrorMessage("Invalid word. Use letters only.");
        } else if (
            this.wordList.some(
                (word) => word.toLowerCase() === enteredWord.toLowerCase()
            )
        ) {
            this.showErrorMessage(
                `${enteredWord.toUpperCase()} was already answered!`
            );
            // need to add logic for answers that are not correct/not found
        } else {
            this.wordList.push(enteredWord);
            this.updateWordDisplay();
        }

        // Clear input field
        this.inputText = "";
        this.updateInputField();
    }

    updateWordDisplay() {
        // Update word display and word count
        this.wordDisplay.setText(`${this.wordList.join(", ")}`);
        this.wordCountText.setText(`${this.wordList.length} Words Found`);
    }

    showErrorMessage(message) {
        // Reset any ongoing tween
        if (this.errorMessageTween) {
            this.errorMessageTween.remove();
        }

        // Ensure the error message is visible and reset position
        this.errorMessage.setText(message).setAlpha(1).setVisible(true);

        // Start the new fade-out tween
        this.errorMessageTween = this.tweens.add({
            targets: this.errorMessage,
            x: this.errorMessage.x + 10, // Move slightly right
            yoyo: true, // Move back
            repeat: 4, // Number of shakes
            duration: 50, // Speed of each shake
            onComplete: () => {
                this.time.delayedCall(500, () => {
                    this.tweens.add({
                        targets: this.errorMessage,
                        alpha: 0, //fade out
                        duration: 1000,
                        ease: "Power2",
                        onComplete: () => {
                            this.errorMessage.setVisible(false); // Hide it after fading
                            this.errorMessage.alpha = 1; // Reset alpha for future use
                        },
                    });
                });
            },
        });
    }

    startTimer() {
        this.timerEvent = this.time.addEvent({
            delay: 1000, // 1 second
            callback: () => {
                if (this.remainingTime > 0) {
                    this.remainingTime--;
                    if (this.remainingTime <= 10) {
                        this.timerText.setColor("#ff0000");
                    }
                    this.timerText.setText(this.formatTime(this.remainingTime));
                } else {
                    this.timeIsUp(); // Call timeIsUp when the timer hits 0
                    this.timerEvent.remove(); // Remove the timer event to stop it
                }
            },
            callbackScope: this,
            loop: true,
        });
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsPart = seconds % 60;

        // Pad with leading zeros if needed
        return `${String(minutes).padStart(2, "0")}:${String(
            secondsPart
        ).padStart(2, "0")}`;
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

    timeIsUp() {
        console.log("Time's up!");

        // Store the remaining time in the global registry
        this.registry.set("remainingTime", this.remainingTime);

        // Storing word count
        this.registry.set("wordCount", this.wordList.length);

        // Save the mute state to the registry before changing the scene
        const isMuted = this.audioManager.isMuted; // Get the current mute state
        this.registry.set("isMuted", isMuted); // Store it in the registry

        this.time.removeAllEvents();

        this.tweens.add({
            targets: this.timerText,
            alpha: 0, // Fade out the timer
            duration: 1000,
            onComplete: () => {
                if (this.scene.isActive("AnagramGame")) {
                    this.scene.stop("AnagramGame");
                    this.scene.start("AnagramOver");
                    EventBus.emit("scene-changed", "AnagramOver");
                }
            },
        });
    }

    resize({ width, height }) {
        // Avoid redundant resize calls
        if (this.lastWidth === width && this.lastHeight === height) return;

        this.lastWidth = width;
        this.lastHeight = height;

        try {
            if (!this.anagramText || !this.anagramBG) {
                console.warn(
                    "Some objects are not initialized yet, resize skipped."
                );
                return;
            }

            this.background
                .setPosition(width / 2, height / 2)
                .setDisplaySize(width, height);

            this.anagramBG
                .setPosition(width / 2, 0)
                .setSize(width, Math.min(height * 0.12, 100));

            this.anagramText
                .setPosition(
                    width / 2,
                    Math.min(this.scale.height * 0.12, 200) / 2
                )
                .setFontSize(Math.min(width * 0.08, 65));

            this.timerText
                .setPosition(width / 2, height * 0.2)
                .setFontSize(Math.min(width * 0.125, 90));

            this.wordDisplay
                .setPosition(width / 2, height * 0.38)
                .setFontSize(Math.min(width * 0.06, 45));

            this.wordCountText
                .setPosition(width / 2, height * 0.55)
                .setFontSize(Math.min(width * 0.06, 50));

            this.errorMessage
                .setPosition(width / 2, height * 0.63)
                .setFontSize(Math.min(width * 0.06, 45));

            //----------------------------------------------------------

            this.inputBG
                .setPosition(width / 2, height * 0.72)
                .setSize(
                    Math.min(this.scale.width * 0.5, 275),
                    Math.min(this.scale.height * 0.1, 65)
                );

            // Get updated rectangle dimensions
            const rectWidth = this.inputBG.width;
            const rectHeight = this.inputBG.height;

            this.bottomBorder.clear(); // Clear the previous line
            this.bottomBorder
                .lineStyle(4, 0x000000, 1) // Set line style
                .moveTo(
                    this.inputBG.x - rectWidth / 2, // Left edge of the rectangle
                    this.inputBG.y + rectHeight / 2 // Bottom edge of the rectangle
                )
                .lineTo(
                    this.inputBG.x + rectWidth / 2, // Right edge of the rectangle
                    this.inputBG.y + rectHeight / 2 // Same y position
                )
                .strokePath();

            //----------------------------------------------------------

            this.inputField
                .setPosition(this.scale.width / 2, this.scale.height * 0.72)
                .setFontSize(Math.min(width * 0.07, 60));

            //----------------------------------------------------------

            const clearWidth = Math.min(this.scale.width * 0.25, 200);
            const clearHeight = Math.min(this.scale.height * 0.1, 40);

            this.clearShadow.clear();
            this.clearShadow
                .fillStyle(0x000000, 0.3)
                .fillRoundedRect(
                    this.scale.width / 2 - 215 + 4,
                    this.scale.height * 0.82 + 4,
                    clearWidth,
                    clearHeight,
                    5
                );

            this.clearBg.clear();
            this.clearBg
                .fillStyle(0xdadada, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 215,
                    this.scale.height * 0.82,
                    clearWidth,
                    clearHeight,
                    5
                );

            this.clearZone
                .setPosition(width / 2 - 215, height * 0.8)
                .setSize(clearWidth, clearHeight);

            this.clearText
                .setPosition(width / 2 - 115, height * 0.85)
                .setFontSize(Math.min(width * 0.05, 30));

            //----------------------------------------------------------

            const submitWidth = Math.min(this.scale.width * 0.25, 200);
            const submitHeight = Math.min(this.scale.height * 0.1, 40);

            this.submitShadow.clear();
            this.submitShadow
                .fillStyle(0x000000, 0.3)
                .fillRoundedRect(
                    this.scale.width / 2 + 10 + 4,
                    this.scale.height * 0.82 + 4,
                    submitWidth,
                    submitHeight,
                    5
                );

            this.submitBg.clear();
            this.submitBg
                .fillStyle(0x4a63e4, 1)
                .fillRoundedRect(
                    this.scale.width / 2 + 10,
                    this.scale.height * 0.82,
                    submitWidth,
                    submitHeight,
                    5
                );

            this.submitZone
                .setPosition(width / 2 + 10, height * 0.82)
                .setSize(submitWidth, submitHeight);

            this.submitText
                .setPosition(width / 2 + 110, height * 0.85)
                .setFontSize(Math.min(width * 0.05, 30));

            //----------------------------------------------------------

            this.blurOverlay.setPosition(0, 0).setSize(width, height);

            this.popupBg.clear();
            this.popupBg
                .fillStyle(0xffffff, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 250,
                    this.scale.height / 2 - 160,
                    this.scale.width * 0.6,
                    this.scale.height * 0.55,
                    10
                );

            this.popupText
                .setPosition(width / 2, height / 2 - 70)
                .setFontSize(Math.min(width * 0.05, 30));

            this.popupText2
                .setPosition(width / 2, height / 2 + 30)
                .setFontSize(Math.min(width * 0.05, 30));

            const resumeWidth = Math.min(this.scale.width * 0.25, 200);
            const resumeHeight = Math.min(this.scale.height * 0.1, 40);

            this.resumeShadow.clear();
            this.resumeShadow
                .fillStyle(0x000000, 0.3)
                .fillRoundedRect(
                    this.scale.width / 2 - 100 + 4,
                    this.scale.height / 2 + 90 + 4,
                    resumeWidth,
                    resumeHeight,
                    5
                );

            this.resumeBg.clear();
            this.resumeBg
                .fillStyle(0x4a63e4, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 100,
                    this.scale.height / 2 + 90,
                    resumeWidth,
                    resumeHeight,
                    5
                );

            this.resumeZone
                .setPosition(width / 2 - 100, height / 2 + 90)
                .setSize(resumeWidth, resumeHeight);

            this.resumeText
                .setPosition(width / 2, height / 2 + 110)
                .setFontSize(Math.min(width * 0.05, 35));

            //----------------------------------------------------------

            this.muteButton.setPosition(width - 70, height - 30);

            this.helpIcon.setPosition(width - 30, height - 30);

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize error: ", e);
        }
    }

    cleanup() {
        // Clean up the event listeners for the help icon
        if (this.helpIcon) {
            this.helpIcon.off("pointerover");
            this.helpIcon.off("pointerout");
            this.helpIcon.off("pointerdown");

            // Optionally, stop any ongoing tweens related to helpIcon
            this.tweens.killTweensOf(this.helpIcon); // Stop all tweens affecting helpIcon
        }

        // Ensure the error message tween is stopped and removed
        if (this.errorMessageTween) {
            this.errorMessageTween.stop(); // Stop if it's active
            this.errorMessageTween.remove(); // Clean up tween resources
            this.errorMessageTween = null;
        }

        // Remove timer event if it's active
        if (this.timerEvent) {
            this.timerEvent.remove(); // Ensure the timer event is removed
            this.timerEvent = null;
        }

        // Remove all time-based events
        this.time.removeAllEvents();

        // Remove the keyboard listener for 'keydown' event
        this.input.keyboard.off("keydown", this.handleKeyDown, this);

        // Remove pointer event listeners for 'pointerdown', 'pointerup', 'pointerover', and 'pointerout'
        this.input.off("pointerdown", this.handlePointerDown, this);
        this.input.off("pointerup", this.handlePointerUp, this);
        this.input.off("pointerover", this.handlePointerOver, this);
        this.input.off("pointerout", this.handlePointerOut, this);
    }
}

