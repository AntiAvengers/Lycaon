import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class AnagramGame extends Scene {
    lastWidth = null;
    lastHeight = null;

    constructor() {
        super("AnagramGame");
        this.timerText = null;
        this.remainingTime = 10;
        this.wordList = [];
        this.inputText = "";
    }

    preload() {
        console.log("AnagramGame scene preloading");
    }

    create() {
        this.cameras.main.setBackgroundColor(0xf2f0ef);

        //----------------------------------------------------------

        this.anagramBG = this.add
            .rectangle(
                this.scale.width / 2, // Center horizontally
                0, // Touch the top
                this.scale.width,
                Math.min(this.scale.height * 0.15, 200), // Height of the button
                0xadb5bd
            )
            .setOrigin(0.5, 0) // Center horizontally, ancho at top
            .setDepth(99); // Make sure the background is behind the text

        this.anagramText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height + Math.min(this.scale.height * 0.15, 200) / 2, // Vertically center text within rectangle
                "E  I  T  S  P  E  R",
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

        this.timerText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.25,
                this.formatTime(this.remainingTime),
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.wordDisplay = this.add
            .text(this.scale.width / 2, this.scale.height * 0.38, " ", {
                fontFamily: "Arial",
                fontSize: Math.min(this.scale.width * 0.05, 25),
                color: "#000000",
                align: "center",
                wordWrap: { width: this.scale.width * 0.8 },
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.wordCountText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.55,
                "0 Words Found",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    color: "#000000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.errorMessage = this.add
            .text(this.scale.width / 2, this.scale.height * 0.63, "", {
                fontFamily: "Arial",
                fontSize: Math.min(this.scale.width * 0.05, 25),
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
                Math.min(this.scale.width * 0.4, 300),
                Math.min(this.scale.height * 0.1, 45),
                0xd8e2dc
            )
            .setOrigin(0.5)
            .setDepth(99);

        this.inputField = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.72,
                "Start Typing!",
                {
                    fontFamily: "Arial",
                    color: "#000000",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.clearBG = this.add
            .rectangle(
                this.scale.width / 2 - 100,
                this.scale.height * 0.85,
                Math.min(this.scale.width * 0.25, 200), // Width of the button
                Math.min(this.scale.height * 0.1, 40), // Height of the button
                0xadb5bd
            )
            .setOrigin(0.5)
            .setDepth(99)
            .setInteractive({ useHandCursor: true });

        this.clearBtn = this.add
            .text(
                this.scale.width / 2 - 100,
                this.scale.height * 0.85,
                "Clear",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    color: "#000000",
                    align: "center",
                }
            )
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.submitBG = this.add
            .rectangle(
                this.scale.width / 2 + 100,
                this.scale.height * 0.85,
                Math.min(this.scale.width * 0.25, 200), // Width of the button
                Math.min(this.scale.height * 0.1, 40), // Height of the button
                0xadb5bd
            )
            .setOrigin(0.5)
            .setDepth(99)
            .setInteractive({ useHandCursor: true });

        this.submitBtn = this.add
            .text(
                this.scale.width / 2 + 100,
                this.scale.height * 0.85,
                "Submit",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    color: "#000000",
                    align: "center",
                }
            )
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.helpIcon = this.add
            .image(this.scale.width / 2, this.scale.height * 0.95, "helpIcon")
            .setOrigin(0.5)
            .setScale(0.5) // Resize the icon if needed
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        //----------------------------------------------------------

        this.popupBg = this.add
            .rectangle(
                this.scale.width / 2,
                this.scale.height / 2,
                400,
                300,
                0xffffff
            )
            .setOrigin(0.5)
            .setDepth(200)
            .setVisible(false);

        this.popupText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height / 2 - 40,
                "Unscramble the anagram within 30 seconds! Reach a high enough score, and you might unlock more pages.",
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: 350 },
                    lineSpacing: 5,
                }
            )
            .setOrigin(0.5)
            .setDepth(201)
            .setVisible(false);

        this.closeBtn = this.add
            .rectangle(
                this.scale.width / 2,
                this.scale.height / 2 + 70,
                80,
                40,
                0x00ff00
            )
            .setOrigin(0.5)
            .setDepth(201)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        this.closeText = this.add
            .text(this.scale.width / 2, this.scale.height / 2 + 70, "Back", {
                fontFamily: "Arial",
                fontSize: Math.min(this.scale.width * 0.05, 25),
                color: "#000000",
            })
            .setOrigin(0.5)
            .setDepth(202)
            .setVisible(false);

        this.closeBtn.on("pointerdown", () => {
            this.hidePopup();
        });

        this.closeText.on("pointerdown", () => {
            this.hidePopup();
        });

        //----------------------------------------------------------

        this.startTimer();

        // Listen to key events (this handles the text input)
        this.input.keyboard.on("keydown", (event) => {
            // If the Enter key is pressed, submit the word
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent default behavior
                console.log("Enter pressed! Submitting...");
                this.handleWordSubmit();
            } else if (event.key === "Backspace") {
                this.inputText = this.inputText.slice(0, -1); // Remove last character
                this.updateInputField();
            } else if (/^[a-zA-Z]$/.test(event.key)) {
                if (this.inputText.length < 8) {
                    this.inputText += event.key; // Append character to inputText
                    this.updateInputField();
                } else {
                    // Show message when trying to type more than 8 characters
                    this.showErrorMessage("Maximum 8 letters allowed!");
                }
            }
        });

        //----------------------------------------------------------

        const buttonHoverEffect = (button, background, isHovering) => {
            const textColor = isHovering ? "#ffcc00" : "#000000";
            const backgroundColor = isHovering ? 0xcccccc : 0xadb5bd;
            const scaleValue = isHovering ? 1.05 : 1;

            button.setStyle({ color: textColor });
            background.setFillStyle(backgroundColor);

            this.tweens.add({
                targets: [button, background],
                scaleX: scaleValue,
                scaleY: scaleValue,
                duration: 200,
                ease: "Power1",
            });
        };

        // Apply hover effect to clear button
        this.clearBG.on("pointerover", () =>
            buttonHoverEffect(this.clearBtn, this.clearBG, true)
        );
        this.clearBG.on("pointerout", () =>
            buttonHoverEffect(this.clearBtn, this.clearBG, false)
        );
        this.clearBtn.on("pointerover", () =>
            buttonHoverEffect(this.clearBtn, this.clearBG, true)
        );
        this.clearBtn.on("pointerout", () =>
            buttonHoverEffect(this.clearBtn, this.clearBG, false)
        );

        // Apply hover effect to submit button
        this.submitBG.on("pointerover", () =>
            buttonHoverEffect(this.submitBtn, this.submitBG, true)
        );
        this.submitBG.on("pointerout", () =>
            buttonHoverEffect(this.submitBtn, this.submitBG, false)
        );
        this.submitBtn.on("pointerover", () =>
            buttonHoverEffect(this.submitBtn, this.submitBG, true)
        );
        this.submitBtn.on("pointerout", () =>
            buttonHoverEffect(this.submitBtn, this.submitBG, false)
        );

        // Button click functionality
        this.clearBG.on("pointerdown", () => {
            if (this.inputField) {
                this.inputField.setText("");
                this.inputText = "";
            }
        });
        this.clearBtn.on("pointerdown", () => {
            if (this.inputField) {
                this.inputField.setText("");
                this.inputText = "";
            }
        });
        this.submitBG.on("pointerdown", () => this.handleWordSubmit());
        this.submitBtn.on("pointerdown", () => this.handleWordSubmit());

        //----------------------------------------------------------

        this.helpIcon.on("pointerover", () => {
            this.helpIcon.setTint(0xcccccc); // Darken on hover
            this.helpIcon.setScale(0.8); // Slightly increase size
        });

        this.helpIcon.on("pointerout", () => {
            this.helpIcon.clearTint(); // Remove tint
            this.helpIcon.setScale(0.5); // Reset size
        });

        // Click event
        this.helpIcon.on("pointerdown", () => {
            console.log("Button clicked!");
            this.showPopup();
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
    }

    showPopup() {
        this.popupBg.setVisible(true);
        this.popupText.setVisible(true);
        this.closeBtn.setVisible(true);
        this.closeText.setVisible(true);

        // Pause timer
        if (this.timerEvent) {
            this.timerEvent.paused = true;
        }
    }

    hidePopup() {
        this.popupBg.setVisible(false);
        this.popupText.setVisible(false);
        this.closeBtn.setVisible(false);
        this.closeText.setVisible(false);

        // Resume timer and manually check if time is up
        if (this.timerEvent) {
            this.timerEvent.paused = false;
            if (this.remainingTime <= 0) {
                this.timeIsUp(); // Manually call timeIsUp if time has already run out
            }
        }
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
            },
        });
    }

    updateInputField() {
        this.inputField.setText(this.inputText); // Update the input text display
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
            this.showErrorMessage("Word already found!");
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

    startTimer() {
        this.timerEvent = this.time.addEvent({
            delay: 1000, // 1 second
            callback: () => {
                if (this.remainingTime > 0) {
                    this.remainingTime--;
                    this.timerText.setText(this.formatTime(this.remainingTime));
                } else {
                    // Change the color before calling timeIsUp
                    this.timerText.setColor("#ff0000");
                    this.timeIsUp(); // Call timeIsUp when the timer hits 0
                    this.timerEvent.remove(); // Remove the timer event to stop it
                }
            },
            callbackScope: this,
            loop: true,
        });
    }

    // updateTimer() {
    //     this.remainingTime--;

    //     // Update the timer display in MM:SS format
    //     this.timerText.setText(this.formatTime(this.remainingTime));

    //     if (this.remainingTime <= 0) {
    //         // Change the timer text color to red
    //         this.timerText.setColor("#ff0000");

    //         this.timeIsUp();
    //     }
    // }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsPart = seconds % 60;

        // Pad with leading zeros if needed
        return `${String(minutes).padStart(2, "0")}:${String(
            secondsPart
        ).padStart(2, "0")}`;
    }

    timeIsUp() {
        console.log("Time's up!");

        // Store the remaining time in the global registry
        this.registry.set("remainingTime", this.remainingTime);

        // Storing word count
        this.registry.set("wordCount", this.wordList.length);

        this.time.removeAllEvents();

        this.tweens.add({
            targets: this.timerText,
            alpha: 0, // Fade out the timer
            duration: 1000,
            onComplete: () => {
                this.scene.stop("AnagramGame"); // Stop the current scene
                this.scene.start("AnagramOver"); // Start the GameOver scene
            },
        });
    }

    resize({ width, height }) {
        // Avoid redundant resize calls
        if (this.lastWidth === width && this.lastHeight === height) return;

        this.lastWidth = width;
        this.lastHeight = height;

        // // Ensure canvas does not overflow the viewport
        // const newWidth = Math.min(width, window.innerWidth);
        // const newHeight = Math.min(height, window.innerHeight);

        try {
            if (!this.anagramText || !this.anagramBG) {
                console.warn(
                    "Some objects are not initialized yet, resize skipped."
                );
                return;
            }

            this.anagramBG
                .setPosition(width / 2, 0)
                .setSize(width, Math.min(height * 0.15, 200));

            this.anagramText
                .setPosition(
                    width / 2,
                    Math.min(this.scale.height * 0.15, 200) / 2
                )
                .setFontSize(Math.min(width * 0.05, 35));

            this.timerText
                .setPosition(width / 2, height * 0.25)
                .setFontSize(Math.min(width * 0.05, 25));

            this.wordDisplay
                .setPosition(width / 2, height * 0.38)
                .setFontSize(Math.min(width * 0.05, 25));

            this.wordCountText
                .setPosition(width / 2, height * 0.55)
                .setFontSize(Math.min(width * 0.05, 25));

            this.errorMessage
                .setPosition(width / 2, height * 0.63)
                .setFontSize(Math.min(width * 0.05, 25));

            this.inputBG
                .setPosition(width / 2, height * 0.72)
                .setSize(
                    Math.min(this.scale.width * 0.4, 300),
                    Math.min(this.scale.height * 0.1, 45)
                );

            this.inputField
                .setPosition(this.scale.width / 2, this.scale.height * 0.72)
                .setFontSize(Math.min(width * 0.05, 25));

            this.clearBG
                .setPosition(width / 2 - 100, height * 0.85)
                .setSize(
                    Math.min(this.scale.width * 0.25, 200),
                    Math.min(this.scale.height * 0.1, 40)
                );

            this.clearBtn
                .setPosition(width / 2 - 100, height * 0.85)
                .setFontSize(Math.min(width * 0.05, 25));

            this.submitBG
                .setPosition(width / 2 + 100, height * 0.85)
                .setSize(
                    Math.min(this.scale.width * 0.25, 200),
                    Math.min(this.scale.height * 0.1, 40)
                );

            this.submitBtn
                .setPosition(width / 2 + 100, height * 0.85)
                .setSize(
                    Math.min(this.scale.width * 0.25, 200),
                    Math.min(this.scale.height * 0.1, 40)
                );

            this.helpIcon.setPosition(width / 2, height * 0.95);

            this.popupBg.setPosition(width / 2, height / 2).setSize(400, 300);

            this.popupText
                .setPosition(width / 2, height / 2 - 40)
                .setFontSize(Math.min(width * 0.05, 25));

            this.closeBtn
                .setPosition(width / 2, height / 2 + 70)
                .setSize(80, 40);

            this.closeText
                .setPosition(width / 2, height / 2 + 70)
                .setFontSize(Math.min(width * 0.05, 25));

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize error: ", e);
        }
    }
}

