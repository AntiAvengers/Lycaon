import PropTypes from "prop-types";
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";

export const PhaserGame = forwardRef(function PhaserGame(
    { currentActiveScene },
    ref
) {
    const game = useRef();
    const initialized = useRef(false); // Track whether the game has been initialized

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        // Check if the game has not been initialized yet
        if (!initialized.current) {
            game.current = StartGame("game-container");
            initialized.current = true; // Mark the game as initialized

            if (ref) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
                initialized.current = false; // Reset the initialization state on cleanup
            }
        };
    }, [ref]); // Add `ref` to dependencies to handle potential ref changes

    useEffect(() => {
        EventBus.on("current-scene-ready", (currentScene) => {
            if (currentActiveScene instanceof Function) {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
        });

        return () => {
            EventBus.removeListener("current-scene-ready");
        };
    }, [currentActiveScene, ref]);

    return <div id="game-container" className="rounded-[20px] shadow-lg"></div>;
});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
};

