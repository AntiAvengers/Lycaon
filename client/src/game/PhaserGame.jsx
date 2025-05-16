import PropTypes from "prop-types";
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";

import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../api/fetchWithAuth';


export const PhaserGame = forwardRef(function PhaserGame(
    { currentActiveScene },
    ref
) {
    const game = useRef();
    const initialized = useRef(false); // Track whether the game has been initialized

    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    const BASE_URL = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' 
    ? import.meta.env.VITE_DEV_URL
    : '/';

    const AUTH_API_CALL = async(path, body) => {
        const URL = BASE_URL + path;
        const options = {
            method: 'POST',
            credentials: 'include' //to send cookies
        };
        if(body) {
            options.headers = { 'Content-Type': 'application/json' }
            options.body = JSON.stringify(body);
        }
        const request = await fetchWithAuth(
            URL,
            options,
            accessToken,
            refreshAccessToken, 
            setAccessToken
        );
        const data = await request.json();
        return data;
    }


    // const use_key = async() => {
    //     const URL = BASE_URL + 'game/puzzle/';
    //     const request = await fetchWithAuth(
    //         URL, 
    //         {
    //             method: 'POST',
    //             credentials: 'include' //to send cookies
    //         },
    //         accessToken, 
    //         refreshAccessToken, 
    //         setAccessToken
    //         );
    //     const data = await request.json();
    //     const { response } = data;
    //     return response;
    // }
    // const get_puzzle_data = async () => {
    //     const URL = BASE_URL + 'game/puzzle/';
    //     const request = await fetchWithAuth(
    //         URL, 
    //         {
    //             method: 'POST',
    //             credentials: 'include' //to send cookies
    //         },
    //         accessToken, 
    //         refreshAccessToken, 
    //         setAccessToken
    //         );
    //     const data = await request.json();
    //     const { puzzle } = data;
    //     return puzzle;
    // }

    // const check_answer = async (answer) => {
    //     const URL = BASE_URL + 'game/puzzle/check-answer/'
    //     const request = await fetchWithAuth(
    //         URL, 
    //         {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ answer: answer }),
    //             credentials: 'include' //to send cookies
    //         },
    //         accessToken, 
    //         refreshAccessToken, 
    //         setAccessToken
    //         );
    //     const data = await request.json();
    //     const { result } = data;
    //     return result;
    // }

    // const game_finished = async () => {
    //     const URL = BASE_URL + 'game/puzzle/finish/'
    //     const request = await fetchWithAuth(
    //         URL, 
    //         {
    //             method: 'POST',
    //             credentials: 'include' //to send cookies
    //         },
    //         accessToken, 
    //         refreshAccessToken, 
    //         setAccessToken
    //         );
    //     const data = await request.json();
    //     const { output } = data;
    //     return output;
    // }

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {
        // Check if the game has not been initialized yet
        if (!initialized.current) {
            game.current = StartGame("game-container", { AUTH_API_CALL });
            // game.current = StartGame("game-container", { get_puzzle_data, check_answer, game_finished });
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

