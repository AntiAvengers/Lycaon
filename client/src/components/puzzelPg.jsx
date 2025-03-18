import { useRef, useState, useEffect } from "react";
import { EventBus } from "../game/EventBus.js";

import Phaser from "phaser";
import { PhaserGame } from "../game/PhaserGame.jsx";

const PuzzelPg = () => {
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
    const [currentSceneKey, setCurrentSceneKey] = useState("MainMenu");

    const changeScene = () => {
        const scene = phaserRef.current.scene;
        if (scene && scene.scene.key !== "Game") {
            scene.changeScene();
        }
    };

    const moveSprite = () => {
        const scene = phaserRef.current.scene;
        if (scene && scene.scene.key === "MainMenu") {
            // Get the update logo position
            scene.moveLogo(({ x, y }) => {
                setSpritePosition({ x, y });
            });
        }
    };

    const addSprite = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            // Add more stars
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);
            //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
            const star = scene.add.sprite(x, y, "star");
            //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
            //  You could, of course, do this from within the Phaser Scene code, but this is just an example
            //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
            scene.add.tween({
                targets: star,
                duration: 500 + Math.random() * 1000,
                alpha: 0,
                yoyo: true,
                repeat: -1,
            });
        }
    };

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        setCurrentSceneKey(scene.scene.key);
        setCanMoveSprite(scene.scene.key !== "MainMenu");
    };

    useEffect(() => {
        const handleSceneChange = (sceneName) => {
            console.log(`Switched to scene: ${sceneName}`);
            setCurrentSceneKey(sceneName);
        };

        EventBus.on("scene-changed", handleSceneChange);
        return () => EventBus.off("scene-changed", handleSceneChange);
    }, []);

    return (
        <div className="flex flex-row">
            {/* Left Side of PuzzlePg - (Titel + Phaser) */}
            <section className="flex flex-col justify-center items-center">
                <h1 className="text-4xl font-semibold my-4">Puzzles</h1>
                <section className="flex flex-row justify-center items-center">
                    <PhaserGame
                        ref={phaserRef}
                        currentActiveScene={currentScene}
                    />
                    <div>
                        <div>
                            <button
                                className="button"
                                onClick={changeScene}
                                disabled={currentSceneKey === "Game"}
                            >
                                {currentSceneKey === "Game"
                                    ? "In Game"
                                    : "Start Game"}
                            </button>
                        </div>
                        <div>
                            <button
                                disabled={canMoveSprite}
                                className="button"
                                onClick={moveSprite}
                            >
                                Toggle Movement
                            </button>
                        </div>
                        <div>
                            Sprite Position:
                            <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
                        </div>
                        <div>
                            <button className="button" onClick={addSprite}>
                                Add New Sprite
                            </button>
                        </div>
                    </div>
                </section>
            </section>

            {/* Right Side PuzzlePg - (Showcase+High Score + Leaderboard)  */}
            <section>
                <div>Showcase</div>
                <div>High Score</div>
                <div>Leaderboard</div>
            </section>
        </div>
    );
};

export default PuzzelPg;

