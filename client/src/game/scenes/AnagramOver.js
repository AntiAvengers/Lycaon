import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class AnagramOver extends Scene {
    lastWidth = null;
    lastHeight = null;

    constructor() {
        super("AnagramOver");
    }

    preload() {
        console.log("GameOver scene preloading");
    }

    create() {
        // Retrieve the remaining time from the global registry
        const remainingTime = this.registry.get("remainingTime");

        const wordCount = this.registry.get("wordCount");

        const pageReward = this.calculatePages(wordCount);

        console.log("Total Pages:", pageReward);

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

        // Set up your timer display here, using the `remainingTime` retrieved
        this.timerText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.25,
                this.formatTime(remainingTime),
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25),
                    color: "#ff0000",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.timesUpText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.45,
                "Time's up!",
                {
                    fontFamily: "Arial Black",
                    fontSize: Math.min(this.scale.width * 0.08, 50), // Responsive font size
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.wordCount = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.60,
                `You found ${wordCount} words!`,
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 25), // Responsive font size
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.rewardsText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.7,
                `You are rewarded with ${pageReward} pages!`,
                {
                    fontFamily: "Arial",
                    fontSize: Math.min(this.scale.width * 0.05, 30), // Responsive font size
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.backBG = this.add
            .rectangle(
                this.scale.width / 2,
                this.scale.height * 0.8,
                Math.min(this.scale.width * 0.3, 300), // Width of the button
                Math.min(this.scale.height * 0.1, 40), // Height of the button
                0xadb5bd
            )
            .setOrigin(0.5)
            .setDepth(99)
            .setInteractive({ useHandCursor: true });

        this.backBtn = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.8,
                "Back to Home",
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

        const buttonHoverEffect = (isHovering) => {
            const textColor = isHovering ? "#ffcc00" : "#000000";
            const backgroundColor = isHovering ? 0xcccccc : 0xadb5bd;
            const scaleValue = isHovering ? 1.05 : 1;

            this.backBtn.setStyle({ color: textColor });
            this.backBG.setFillStyle(backgroundColor);

            this.tweens.add({
                targets: this.backBtn,
                scaleX: scaleValue,
                scaleY: scaleValue,
                duration: 200,
                ease: "Power1",
            });

            this.tweens.add({
                targets: this.backBG,
                scaleX: scaleValue,
                scaleY: scaleValue,
                duration: 200,
                ease: "Power1",
            });
        };

        this.backBG.on("pointerover", () => buttonHoverEffect(true));
        this.backBG.on("pointerout", () => buttonHoverEffect(false));

        this.backBtn.on("pointerover", () => buttonHoverEffect(true));
        this.backBtn.on("pointerout", () => buttonHoverEffect(false));

        [this.backBG, this.backBtn].forEach((btn) => {
            btn.setInteractive({ useHandCursor: true });
            btn.on("pointerdown", () => {
                window.location.href = "/home";
            });
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

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsPart = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(
            secondsPart
        ).padStart(2, "0")}`;
    }

    calculatePages(wordCount) {
        if (wordCount === 0) {
            return 0;
        } else if (wordCount <= 5) {
            return 1;
        } else if (wordCount <= 10) {
            return 2;
        } else {
            return 3;
        }
    }

    resize({ width, height }) {
        // Avoid redundant resize calls
        if (this.lastWidth === width && this.lastHeight === height) return;

        this.lastWidth = width;
        this.lastHeight = height;

        try {
            // Ensure objects are properly initialized before resizing
            if (!this.timerText || !this.timesUpText) {
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

            this.timesUpText
                .setPosition(width / 2, height * 0.45)
                .setFontSize(Math.min(width * 0.08, 50));

            this.wordCount
                .setPosition(width / 2, height * 0.6)
                .setFontSize(Math.min(width * 0.05, 25));

            this.rewardsText
                .setPosition(width / 2, height * 0.7)
                .setFontSize(Math.min(width * 0.05, 30));

            this.backBG
                .setPosition(width / 2, height * 0.8)
                .setSize(
                    Math.min(this.scale.width * 0.3, 300),
                    Math.min(this.scale.height * 0.1, 40)
                );

            this.backBtn
                .setPosition(width / 2, height * 0.8)
                .setFontSize(Math.min(width * 0.06, 25));

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize error: ", e);
        }
    }
}

