import { Boot } from "./scenes/Boot";
import { AnagramInstruc } from "./scenes/AnagramInstruc.js";
import { AnagramGame } from "./scenes/AnagramGame.js";
import { AnagramOver } from "./scenes/AnagramOver.js";
import Phaser from "phaser";
import { Preloader } from "./scenes/Preloader.js";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

// Define the aspect ratio of the game
const ASPECT_RATIO = 4 / 3;

const config = {
    type: Phaser.AUTO,
    parent: "game-container", // Parent container for the game
    backgroundColor: "rgba(0,0,0,0)", // Fully transparent
    transparent: true, // This makes the canvas transparent
    scale: {
        mode: Phaser.Scale.RESIZE, // Use RESIZE mode for dynamic scaling
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game
    },
    scene: [Boot, Preloader, AnagramInstruc, AnagramGame, AnagramOver],
    pixelArt: true, // Ensures pixel-perfect scaling (optional for pixel art)
    roundPixels: true, // Rounds pixels for smoother rendering (optional)
};

const StartGame = (parent, injected = {}) => {
    const game = new Phaser.Game({ ...config, parent });
    
    game.injected = injected;

    const handleResize = () => {
        if (!game || !game.scale || !game.isRunning) return; // Guard against null access

        const isMobile = window.innerWidth <= 768; // Mobile devices have smaller screens

        let newWidth, newHeight;

        if (isMobile) {
            // On mobile, make the canvas fill the full screen (both width and height)
            newWidth = window.innerWidth;
            newHeight = window.innerHeight;
        } else {
            // On larger screens, we use 60% of the screen width and adjust the height based on the aspect ratio
            newWidth = window.innerWidth * 0.58;
            newHeight = newWidth / ASPECT_RATIO;

            // If the new height exceeds the screen height, use the full screen height
            if (newHeight > window.innerHeight) {
                newHeight = window.innerHeight;
                newWidth = newHeight * ASPECT_RATIO;
            }
        }

        // Ensure the game is active before resizing
        //Added to stop the console spamming the error of passing null in resizing
        try {
            if (game.scale) {
                // Resize the Phaser game canvas
                game.scale.resize(newWidth, newHeight);
                game.scale.refresh(); // Refresh the scale manager to apply the changes
            }
        } catch(error) {

        }
        

        // Safely access the active scene and update UI
        const activeScene = game.scene.getScenes(true)[0];
        if (activeScene && typeof activeScene.resize === "function") {
            activeScene.resize({ width: newWidth, height: newHeight });
        }

        // Update the parent container's size (optional)
        const container = document.getElementById("game-container");
        if (container) {
            container.style.width = `${newWidth}px`;
            container.style.height = `${newHeight}px`;
        }
    };

    // Ensure resizing happens after scene creation
    game.events.once("ready", handleResize);

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Perform an initial resize after a short delay to ensure Phaser initializes
    setTimeout(() => {
        if (game && game.isRunning) {
            handleResize();
        }
    }, 100);

    // // Perform an initial resize when the game is created
    // handleResize();

    // Cleanup on unmount
    const cleanup = () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        game.destroy(true);
    };

    if (parent instanceof HTMLElement) {
        parent.addEventListener("unmount", cleanup);
    }

    return game;
};

export default StartGame;

