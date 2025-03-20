import { useRef, useState, useEffect } from "react";
import { EventBus } from "../game/EventBus.js";
import { PhaserGame } from "../game/PhaserGame.jsx";

import ShowcaseBox from "./puzzleComp/showcaseBox.jsx";
import HighscoreBox from "./puzzleComp/highScoreBox.jsx";
import LeaderboardBox from "./puzzleComp/leaderBoardBox.jsx";

const PuzzelPg = () => {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const [currentSceneKey, setCurrentSceneKey] = useState("MainMenu");

    // Update current scene state
    const currentScene = (scene) => {
        if (scene.scene.key !== currentSceneKey) {
            setCurrentSceneKey(scene.scene.key);
        }
    };

    // Listen for scene change events via EventBus
    useEffect(() => {
        const handleSceneChange = (sceneName) => {
            console.log(`Switched to scene: ${sceneName}`);
            setCurrentSceneKey(sceneName);
        };

        EventBus.on("scene-changed", handleSceneChange);
        return () => EventBus.off("scene-changed", handleSceneChange);
    }, [currentSceneKey]);

    // Handle dynamic Phaser canvas resizing
    useEffect(() => {
        const handleResize = () => {
            const game = phaserRef.current?.game;
            if (game && game.isRunning) {
                game.scale.resize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex w-full flex-col sm:flex-row sm:mx-8 max-w-screen mx-auto min-h-full">
            {/* Left Side of PuzzlePg - (Titel + Phaser) */}
            <section className="w-fit flex flex-col justify-center items-center px-4">
                <h1 className="text-4xl font-semibold my-4">Puzzles</h1>
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            </section>

            {/* Right Side PuzzlePg - (Showcase+High Score + Leaderboard)  */}
            <section className="w-auto flex flex-col justify-center items-center gap-6 m-2 sm:m-4 flex-grow">
                <ShowcaseBox />
                <HighscoreBox />
                <LeaderboardBox />
            </section>
        </div>
    );
};

export default PuzzelPg;

