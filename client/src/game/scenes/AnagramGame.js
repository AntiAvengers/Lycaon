import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class AnagramGame extends Scene {
    lastWidth = null;
    lastHeight = null;

    constructor() {
        super("AnagramGame");
        this.timerText = null;
        this.remainingTime = 30;
        this.wordList = [];
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

        //----------------------------------------------------------

        this.startTimer();

        // Create an invisible input field
        this.inputField = document.createElement("input");
        this.inputField.type = "text";
        this.inputField.style.position = "absolute";

        // Set input dimensions
        const inputWidth = 200;
        this.inputField.style.width = `${inputWidth}px`;
        this.inputField.style.height = "45px";
        this.inputField.style.fontSize = "35px";
        this.inputField.style.zIndex = "1000";

        this.inputField.style.borderBottom = "2px solid #adb5bd";
        this.inputField.placeholder = "Enter Word";

        // Append input field to the game container
        this.game.canvas.parentNode.appendChild(this.inputField);

        // Position the input field dynamically
        this.updateInputPosition();

        // Listen for Enter key to submit the word
        this.input.keyboard.on("keydown-ENTER", () => this.handleWordSubmit());

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
        this.clearBG.on("pointerdown", () => (this.inputField.value = ""));
        this.clearBtn.on("pointerdown", () => (this.inputField.value = ""));
        this.submitBG.on("pointerdown", () => this.handleWordSubmit());
        this.submitBtn.on("pointerdown", () => this.handleWordSubmit());

        //----------------------------------------------------------

        this.scale.on("resize", this.updateInputPosition, this);

        // Listen for screen resizing
        this.scale.on("resize", this.resize, this);

        // Resize once on creation to ensure proper positioning
        this.resize({ width: this.scale.width, height: this.scale.height });

        EventBus.emit("current-scene-ready", this);
    }

    showErrorMessage(message) {
        // Reset any ongoing tween
        if (this.errorMessageTween) {
            this.errorMessageTween.remove();
        }

        // Set the new error message and make it visible
        this.errorMessage.setText(message).setAlpha(1);

        // Start the new fade-out tween
        this.errorMessageTween = this.tweens.add({
            targets: this.errorMessage,
            alpha: 0, // Fade out after 2 seconds
            duration: 2000,
            ease: "Power2",
            delay: 2000, // Delay the fade-out for 2 seconds
        });
    }

    handleWordSubmit() {
        const enteredWord = this.inputField.value.trim();

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
        this.inputField.value = "";
    }

    destroyInput() {
        // Clean up the input field when changing scenes
        this.inputField.remove();
    }

    updateWordDisplay() {
        // Update word display and word count
        this.wordDisplay.setText(`${this.wordList.join(", ")}`);
        this.wordCountText.setText(`${this.wordList.length} Words Found`);
    }

    updateInputPosition() {
        if (!this.inputField) return;

        // Get the canvas position in the viewport
        const canvasRect = this.game.canvas.getBoundingClientRect();

        // Center horizontally within the canvas
        const inputWidth = 200;
        this.inputField.style.left = `${
            canvasRect.left + (canvasRect.width - inputWidth) / 2
        }px`;

        // Position vertically the canvas height
        this.inputField.style.top = `${
            canvasRect.top +
            canvasRect.height * 0.9 -
            this.inputField.offsetHeight / 2
        }px`;
    }

    startTimer() {
        this.time.addEvent({
            delay: 1000, // 1 second (1000 ms)
            callback: this.updateTimer,
            callbackScope: this,
            loop: true, // Repeat the event
        });
    }

    updateTimer() {
        this.remainingTime--;

        // Update the timer display in MM:SS format
        this.timerText.setText(this.formatTime(this.remainingTime));

        if (this.remainingTime <= 0) {
            this.timeIsUp();
        }
    }

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
        this.time.removeAllEvents();
        this.scene.stop("AnagramGame"); // Ensure Game scene is stopped
        this.scene.start("GameOver"); // Change scene when time runs out
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

            this.anagramBG.setPosition(width / 2, 0);
            this.anagramBG.setSize(width, Math.min(height * 0.15, 200));

            this.anagramText.setPosition(
                width / 2,
                Math.min(this.scale.height * 0.15, 200) / 2
            );
            this.anagramText.setFontSize(Math.min(width * 0.05, 35));

            this.timerText.setPosition(width / 2, height * 0.25);
            this.timerText.setFontSize(Math.min(width * 0.05, 25));

            this.wordDisplay.setPosition(width / 2, height * 0.38);
            this.wordDisplay.setFontSize(Math.min(width * 0.05, 25));

            this.wordCountText.setPosition(width / 2, height * 0.55);
            this.wordCountText.setFontSize(Math.min(width * 0.05, 25));

            this.errorMessage.setPosition(width / 2, height * 0.63);
            this.errorMessage.setFontSize(Math.min(width * 0.05, 25));

            this.clearBG.setPosition(width / 2 - 100, height * 0.85);
            this.clearBG.setSize(
                Math.min(this.scale.width * 0.25, 200),
                Math.min(this.scale.height * 0.1, 40)
            );

            this.clearBtn.setPosition(width / 2 - 100, height * 0.85);
            this.clearBtn.setFontSize(Math.min(width * 0.05, 25));

            this.submitBG.setPosition(width / 2 + 100, height * 0.85);
            this.submitBG.setSize(
                Math.min(this.scale.width * 0.25, 200),
                Math.min(this.scale.height * 0.1, 40)
            );

            this.submitBtn.setPosition(width / 2 + 100, height * 0.85);
            this.submitBtn.setSize(
                Math.min(this.scale.width * 0.25, 200),
                Math.min(this.scale.height * 0.1, 40)
            );

            // Update input position dynamically
            if (this.inputField) {
                this.updateInputPosition();
            }

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize error: ", e);
        }
    }

    destroy() {
        this.destroyInput();
    }
}

