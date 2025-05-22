import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { database } from "../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";

import { fetchWithAuth } from "../api/fetchWithAuth";
import { useAuth } from "../context/AuthContext";

import SHA256 from "crypto-js/sha256";

import { useCurrentWallet, useCurrentAccount } from "@mysten/dapp-kit";

const audio = {
    starter_gift: new Audio("/assets/sounds/starter_gift.mp3"),
    menu_click: new Audio("assets/sounds/header_menu_click.mp3"),
};

const HomePg = () => {
    const { currentWallet, connectionStatus } = useCurrentWallet();

    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    const [showNamePopup, setShowNamePopup] = useState(false); //new user Name popup
    const [showWelcomePopup, setShowWelcomePopup] = useState(false); //welcome popup
    const [playerName, setPlayerName] = useState(""); //Username

    const handleKeyDown = (e) => {
        if (e.key == "Enter") {
            setPlayerProfileName(playerName);
        }
    };

    const setPlayerProfileName = async (name) => {
        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";
        const REQUEST_URL = API_BASE_URL + "users/stats/set-profile-name";
        const request = await fetchWithAuth(
            REQUEST_URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profile_name: name,
                }),
                credentials: "include",
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );
        const GIFT_URL = API_BASE_URL + "users/stats/get-welcome-gift";
        const gift = await fetchWithAuth(
            GIFT_URL,
            {
                method: "POST",
                credentials: "include",
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );
        audio.starter_gift.play();
        setShowWelcomePopup(true);
    };

    useEffect(() => {
        if (connectionStatus == "connected") {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const users_ref = ref(database, `users/${hash}/profile_name`);

            const unsubscribe = onValue(users_ref, (snapshot) => {
                if (snapshot.val() == "") {
                    setShowNamePopup(true);
                } else {
                    setPlayerName(snapshot.val());
                }
            });

            return () => unsubscribe();
        }
    }, [connectionStatus]);

    // Popup for Name
    useEffect(() => {
        const isFirstTime = false; // Replace with actual login/new-user logic
        if (isFirstTime) {
            setShowNamePopup(true); // show first popup
        }
    }, []);

    // Background for HomePg
    useEffect(() => {
        document.body.classList.add("home-bg");
        return () => {
            document.body.classList.remove("home-bg");
        };
    }, []);

    //Enter btn triggers to next popup (Username >>> Welcome)
    useEffect(() => {
        const handleEnter = (e) => {
            if (e.key === "Enter" && showNamePopup && playerName.trim()) {
                setShowNamePopup(false);
                setShowWelcomePopup(true);
            }
        };
        window.addEventListener("keydown", handleEnter);
        return () => window.removeEventListener("keydown", handleEnter);
    }, [showNamePopup, playerName]);

    // Close popup with ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setShowWelcomePopup(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div
            className="relative w-full h-auto"
            aria-hidden={showWelcomePopup || showNamePopup}
        >
            {/* Book (Puzzle) */}
            <div className="relative group w-[1440px] h-full mx-auto">
                <Link
                    className="absolute top-[-200px] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer cursor-pointer z-10"
                    to="/puzzle"
                    onClick={() => audio.menu_click.play()}
                >
                    <img src="/assets/icons/book.png" alt="bookIcon" />
                    <span className="fixed top-[30%] left-[50%] -translate-x-1/2 text-[36px] bg-white px-4 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-15">
                        Puzzle
                    </span>
                </Link>
            </div>

            {/* Fountain */}
            <div className="relative group w-[1440px] h-full mx-auto">
                <Link
                    className="absolute top-[70px] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                    to="/fountain"
                    onClick={() => audio.menu_click.play()}
                >
                    <img src="/assets/icons/fountain.png" alt="fountainIcon" />
                    <span className="fixed bottom-[25%] left-[50%] -translate-x-1/2 text-[36px] bg-white px-4 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-25">
                        Fountain
                    </span>
                </Link>
            </div>

            {/* Collection */}
            <div className="relative group w-[1440px] h-full mx-auto">
                <Link
                    className="absolute left-0 top-[10px] -translate-y-1/2 cursor-pointer z-20"
                    to="/collection"
                    onClick={() => audio.menu_click.play()}
                >
                    <img src="/assets/icons/statues.png" alt="statuesIcon" />
                    <span className="absolute top-1/2 left-[35%] transform -translate-y-1/2 text-[36px] bg-white px-4 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Collection
                    </span>
                </Link>
            </div>

            {/* Pantry */}
            <div className="relative group w-[1440px] h-full mx-auto">
                <Link
                    className="absolute left-[26%] top-[-49px] -translate-y-1/2 cursor-pointer"
                    to="/pantry"
                    onClick={() => audio.menu_click.play()}
                >
                    <img src="/assets/icons/tree.png" alt="treeIcon" />
                    <span className="absolute top-[60%] left-[48%] transform -translate-x-1/2 text-[36px] bg-white px-4 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                        Pantry
                    </span>
                </Link>
            </div>

            {/* Market */}
            <div className="relative group w-[1440px] h-full mx-auto">
                <Link
                    className="absolute right-[-10px] top-[-138px] scale-[95%] -translate-y-1/2 curor-pointer"
                    to="/market"
                    onClick={() => audio.menu_click.play()}
                >
                    <img src="/assets/icons/market.png" alt="marketIcon" />
                    <span className="absolute top-[70%] right-[35%] transform -translate-y-1/2 text-[36px] bg-white px-4 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Market
                    </span>
                </Link>
            </div>

            {/* Background dimmed and prevents user from interacting w/ homePg */}
            {(showWelcomePopup || showNamePopup) && (
                <div className="fixed inset-0 bg-black opacity-50 z-40 pointer-events-auto" />
            )}

            {/* New UserName */}
            {showNamePopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg p-[30px] z-50 flex flex-col justify-center items-center">
                    <p className="text-[35px] text-white">
                        Before you go on your adventure...
                    </p>
                    <p className="text-[35px] text-white leading-none">
                        What is your name?
                    </p>
                    <p className="text-[25px] text-[#FBBB26] mb-4">
                        &#x26A0; Name can NOT be changed, please choose wisely!
                        &#x26A0;
                    </p>
                    <input
                        type="text"
                        required
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Your Name"
                        className="px-4 py-3 mb-4 rounded-[10px] text-[25px] w-[280px] text-center bg-[#FEFAF3] outline-none focus:ring-2 focus:ring-[#FBBB26] shadow-lg/30 placeholder-gray-400"
                    />
                    <button
                        className={`px-5 text-[25px] ${
                            playerName.trim()
                                ? "w-auto h-[35px] bg-[#FBBB26] rounded-[66px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[#000000] cursor-pointer"
                                : "w-auto h-[35px] bg-[#808080] rounded-[66px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[#FEFAF3] shadow-none cursor-not-allowed pointer-events-none"
                        }`}
                        disabled={!playerName.trim()}
                        onClick={() => {
                            if (playerName.trim()) {
                                setShowNamePopup(false);
                                setPlayerProfileName(playerName);
                                setShowWelcomePopup(true);
                            }
                        }}
                    >
                        Confirm
                    </button>
                </div>
            )}

            {/* New User Reward Popup */}
            {showWelcomePopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg p-[40px] z-50 flex flex-col justify-center items-center">
                    <img
                        src="/assets/icons/closeBtn.svg"
                        alt="closeBtn"
                        onClick={() => setShowWelcomePopup(false)}
                        className="absolute top-[10px] right-[10px] cursor-pointer w-[30px] h-[30px]"
                    />
                    <section className="text-[25px] text-[#FFFFFF] text-center mt-[10px] leading-tight tracking-[1px]">
                        <h1 className="text-[50px]">Welcome!</h1>
                        <p>Thank you for playing Lycaon! 🎉</p>
                        <p>
                            As a new player, we gifted you{" "}
                            <span className="text-[#FBBB26] uppercase">
                                4 pages
                            </span>{" "}
                            and{" "}
                            <span className="text-[#FBBB26] uppercase">
                                500 shards
                            </span>{" "}
                            to start.
                        </p>
                        <p>Go enjoy the game!!!</p>
                    </section>
                </div>
            )}
        </div>
    );
};

export default HomePg;

