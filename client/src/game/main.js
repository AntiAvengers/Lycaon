import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import Phaser from "phaser";
import { Preloader } from "./scenes/Preloader";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

// Define the aspect ratio of the game
const ASPECT_RATIO = 16 / 16;

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight, // Set height to full screen height
    parent: "game-container", // Parent container for the game
    backgroundColor: "#028af8",
    scale: {
        // mode: Phaser.Scale.FIT, // Automatically resize to fit
        mode: Phaser.Scale.RESIZE, // Use RESIZE mode for dynamic scaling
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game
    },
    scene: [Boot, Preloader, MainMenu, Game, GameOver],
};

const StartGame = (parent) => {
    const game = new Phaser.Game({ ...config, parent });

    // const handleResize = () => {
    //     const isMobile = window.innerWidth <= 768; // Mobile devices have smaller screens

    //     let newWidth, newHeight;

    //     if (isMobile) {
    //         // On mobile, make the canvas fill the full screen (both width and height)
    //         newWidth = window.innerWidth;
    //         newHeight = window.innerHeight;
    //     } else {
    //         // On larger screens, we use 60% of the screen width and adjust the height based on the aspect ratio
    //         newWidth = window.innerWidth * 0.6;
    //         newHeight = newWidth / ASPECT_RATIO;

    //         // If the new height exceeds the screen height, use the full screen height
    //         if (newHeight > window.innerHeight) {
    //             newHeight = window.innerHeight;
    //             newWidth = newHeight * ASPECT_RATIO;
    //         }
    //     }

    //     // Resize the Phaser game canvas
    //     game.scale.resize(newWidth, newHeight);
    //     // game.scale.refresh(); // Refresh the scale manager to apply the changes

    //     // Update the parent container's size (optional)
    //     const container = document.getElementById("game-container");
    //     if (container) {
    //         container.style.width = `${newWidth}px`;
    //         container.style.height = `${newHeight}px`;
    //     }
    // };

    const handleResize = () => {
        const isMobile = window.innerWidth <= 768; // Mobile devices have smaller screens

        let newWidth, newHeight;

        if (isMobile) {
            // On mobile, make the canvas fill the full screen (both width and height)
            newWidth = window.innerWidth;
            newHeight = window.innerHeight;
        } else {
            // On larger screens, we use 60% of the screen width and adjust the height based on the aspect ratio
            newWidth = window.innerWidth;
            newHeight = newWidth / ASPECT_RATIO;

            // If the new height exceeds the screen height, use the full screen height
            if (newHeight > window.innerHeight) {
                newHeight = window.innerHeight;
                newWidth = newHeight * ASPECT_RATIO;
            }
        }

        // Resize the Phaser game canvas
        game.scale.resize(newWidth, newHeight);
        game.scale.refresh(); // Refresh the scale manager to apply the changes

        // Update the parent container's size (optional)
        const container = document.getElementById("game-container");
        if (container) {
            container.style.width = `${newWidth}px`;
            container.style.height = `${newHeight}px`;
        }
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Perform an initial resize when the game is created
    handleResize();

    return game;
};

export default StartGame;

