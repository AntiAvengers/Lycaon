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

    const handleSceneReady = (currentScene) => {
        setScene(currentScene);
        
        currentScene.events.off('score-updated');
        currentScene.events.off('leaderboard-updated');

        currentScene.events.on('score-updated', setHighScore);
        currentScene.events.on('leaderboard-updated', setLeaderboardData);
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

    //Puzzle-Pg Background
    useEffect(() => {
        document.body.classList.add("puzzle-bg");
        return () => {
            document.body.classList.remove("puzzle-bg");
        };
    }, []);

    return (
        <div className="w-[1321px] h-[648px] flex flex-row justify-center gap-[10px] sm:gap-[20px]">
            {/* Left Side of PuzzlePg - Phaser */}
            <section className="flex justify-center items-center">
                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            </section>

            {/* Right Side PuzzlePg - (Showcase + High Score + Leaderboard)  */}
            <section className="w-[441px] min-w-[441px] h-full flex flex-col justify-between items-center">
                <ShowcaseBox />
                <HighscoreBox />
                <LeaderboardBox />
            </section>
        </div>
    );
};

export default PuzzelPg;

