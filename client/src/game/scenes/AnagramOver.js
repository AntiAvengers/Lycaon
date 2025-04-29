import { EventBus } from "../EventBus";
import { Scene } from "phaser";

import { AudioManager } from "../AudioManager";

export class AnagramOver extends Scene {
    background;
    audioManager;
    muteButton;
    anagramBG;
    anagramText;
    timerText;
    timesUpText;
    wordCount;
    rewardBg;
    rewardsText;
    rewardsText2;
    scrollIcon;
    homeShadow;
    homeBg;
    homeZone;
    homeText;

    lastWidth = null;
    lastHeight = null;

    constructor() {
        super("AnagramOver");
    }

    preload() {
        console.log("GameOver scene preloading");
    }

    create() {
        //input data from last scene
        const remainingTime = this.registry.get("remainingTime");

        const wordCount = this.registry.get("wordCount");

        const pageReward = this.calculatePages(wordCount);

        //----------------------------------------------------------

        //Main Background
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
                this.scale.width / 2, // Center horizontally
                0, // Touch the top
                this.scale.width,
                Math.min(this.scale.height * 0.12, 100), // Height of the button
                0x4a63e4
            )
            .setAlpha(0.65)
            .setOrigin(0.5, 0) // Center horizontally, ancho at top
            .setDepth(99); // Make sure the background is behind the text

        //Where the randomized letters will appear
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
                this.scale.height * 0.22,
                this.formatTime(remainingTime),
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.125, 90),
                    color: "#EA1A26",
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.timesUpText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.35,
                "Time's up!",
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.08, 55),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.wordCount = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.43,
                `You found ${wordCount} words!`,
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.08, 55),
                    color: "#000000",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.rewardBg = this.add
            .image(this.scale.width / 2, this.scale.height * 0.67, "reward-bg")
            .setOrigin(0.5)
            .setScale(1.1)
            .setDepth(99);

        this.rewardsText = this.add
            .text(this.scale.width / 2, this.scale.height * 0.6, "Obtained", {
                fontFamily: "CustomFont",
                fontSize: Math.min(this.scale.width * 0.05, 45),
                color: "#ffffff",
                align: "center",
                wordWrap: { width: this.scale.width * 0.8 },
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.rewardsText2 = this.add
            .text(
                this.scale.width / 2 - 30,
                this.scale.height * 0.7,
                `${pageReward}x`,
                {
                    fontFamily: "CustomFont",
                    fontSize: Math.min(this.scale.width * 0.1, 90),
                    color: "#ffffff",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 },
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.scrollIcon = this.add
            .image(this.scale.width / 2 + 40, this.scale.height * 0.7, "scroll")
            .setOrigin(0.5)
            .setScale(2.75)
            .setDepth(100);

        //----------------------------------------------------------

        const homeWidth = Math.min(this.scale.width * 0.25, 200);
        const homeHeight = Math.min(this.scale.height * 0.1, 40);

        this.homeShadow = this.add.graphics();
        this.homeShadow
            .fillStyle(0x000000, 0.3)
            .fillRoundedRect(
                this.scale.width / 2 - 100 + 4,
                this.scale.height * 0.88 + 4,
                homeWidth,
                homeHeight,
                5
            )
            .setDepth(98);

        this.homeBg = this.add.graphics();
        const drawHomeBg = (color = 0x4a63e4, offsetX = 0, offsetY = 0) => {
            this.homeBg.clear();
            this.homeBg
                .fillStyle(color, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 100 + offsetX,
                    this.scale.height * 0.88 + offsetY,
                    homeWidth,
                    homeHeight,
                    5
                )
                .setDepth(99);
        };

        this.homeZone = this.add
            .zone(
                this.scale.width / 2 - 100,
                this.scale.height * 0.88,
                homeWidth,
                homeHeight
            )
            .setOrigin(0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        this.homeText = this.add
            .text(this.scale.width / 2, this.scale.height * 0.91, "Back Home", {
                fontFamily: "CustomFont",
                fontSize: Math.min(this.scale.width * 0.05, 30),
                color: "#ffffff",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive({ useHandCursor: true });

        drawHomeBg();

        const handleHomeOver = () => {
            drawHomeBg(0x1d329f); // Hover color
        };

        const handleHomeOut = () => {
            drawHomeBg(0x4a63e4); // Default color
            this.homeText.setY(this.scale.height * 0.91);
        };

        const handleHomeDown = () => {
            drawHomeBg(0x16296c, 4, 4); // Pressed color + offset
            this.homeText.setY(this.scale.height * 0.91 + 2);
            window.location.href = "/home"; // Navigate to home
        };

        const handleHomeUp = () => {
            drawHomeBg(0x4a63e4); // Reset color
            this.homeText.setY(this.scale.height * 0.91);
        };

        // Apply handlers to both homeZone and homeText
        [this.homeZone, this.homeText].forEach((obj) => {
            obj.setInteractive()
                .on("pointerover", handleHomeOver)
                .on("pointerout", handleHomeOut)
                .on("pointerdown", handleHomeDown)
                .on("pointerup", handleHomeUp);
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

            this.background
                .setPosition(width / 2, height / 2)
                .setDisplaySize(width, height);

            this.anagramBG
                .setPosition(width / 2, 0)
                .setSize(width, Math.min(height * 0.12, 100));

            this.anagramText
                .setPosition(
                    width / 2,
                    Math.min(this.scale.height * 0.12, 100) / 2
                )
                .setFontSize(Math.min(width * 0.08, 65));

            this.timerText
                .setPosition(width / 2, height * 0.22)
                .setFontSize(Math.min(width * 0.125, 90));

            this.timesUpText
                .setPosition(width / 2, height * 0.35)
                .setFontSize(Math.min(width * 0.08, 55));

            this.wordCounts
                .setPosition(width / 2, height * 0.43)
                .setFontSize(Math.min(width * 0.08, 55));

            this.rewardBg.setPosition(width / 2, height * 0.67);

            this.rewardsText
                .setPosition(width / 2, height * 0.6)
                .setFontSize(Math.min(width * 0.05, 45));

            this.rewardsText2
                .setPosition(width / 2 - 30, height * 0.7)
                .setFontSize(Math.min(width * 0.1, 90));

            this.scrollIcon.setPosition(width / 2 + 40, height * 0.7);

            //----------------------------------------------------------

            const homeWidth = Math.min(this.scale.width * 0.25, 200);
            const homeHeight = Math.min(this.scale.height * 0.1, 40);

            this.homeShadow.clear();
            this.homeShadow
                .fillStyle(0x000000, 0.3)
                .fillRoundedRect(
                    this.scale.width / 2 - 100 + 4,
                    this.scale.height * 0.88 + 4,
                    homeWidth,
                    homeHeight,
                    5
                );

            this.homeBg.clear();
            this.homeBg
                .fillStyle(0x4a63e4, 1)
                .fillRoundedRect(
                    this.scale.width / 2 - 100,
                    this.scale.height * 0.88,
                    homeWidth,
                    homeHeight,
                    5
                );

            this.homeZone
                .setPosition(width / 2 - 100, height * 0.88)
                .setSize(homeWidth, homeHeight);

            this.homeText
                .setPosition(width / 2, height * 0.91)
                .setFontSize(Math.min(width * 0.05, 30));

            //----------------------------------------------------------

            this.muteButton.setPosition(width - 30, height - 30);

            // Update camera viewport to match the new width/height
            this.cameras.main.setViewport(0, 0, width, height);
        } catch (e) {
            console.error("Resize error: ", e);
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

