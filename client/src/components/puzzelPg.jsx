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
        <div className="w-full sm:w-[1320.5px] sm:h-[648.06px] flex flex-col sm:flex-row sm:mx-4 justify-center gap-[10px] sm:gap-[20px]">
            {/* Left Side of PuzzlePg - (Titel + Phaser) */}
            <section className="flex justify-center items-center">
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            </section>

            {/* Right Side PuzzlePg - (Showcase+High Score + Leaderboard)  */}
            <section className="w-auto sm:w-[441px] sm:h-[648.06px] flex flex-col justify-center items-center gap-[17px] mx-2 mb-2 sm:m-0">
                <ShowcaseBox />
                <HighscoreBox />
                <LeaderboardBox />
            </section>
        </div>
    );
};

export default PuzzelPg;

