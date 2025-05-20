import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/fetchWithAuth";
import { database } from "../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import SHA256 from "crypto-js/sha256";

import { useCurrentWallet } from "@mysten/dapp-kit";

const FountainPg = () => {
    const [showRate, setShowRate] = useState(false);
    const [pulledSprites, setPulledSprites] = useState([]);
    const [pages, setPages] = useState(-1);
    const [rates, setRates] = useState([]);
    const [showError, setShowError] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);

    const { currentWallet, connectionStatus } = useCurrentWallet();

    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    //For Rate Btn
    const closeRate = () => setShowRate(false);
    const handleRate = () => setShowRate(true);

    //Popup message for Pull Btns
    const handlePull = async (amount) => {
        if (pages > 0) {
            setShowVideo(true); // show the animation
            setVideoEnded(false); // reset in case it's been set
        }

        const ten_pull = amount == 1 ? false : true;
        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";
        const URL = API_BASE_URL + "game/fountain/pull";
        const request = await fetchWithAuth(
            URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ten_pull: ten_pull }),
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );

        const res = await request.json();
        if (res.error) {
            // setShowError(true);
            console.log(res.error);
            return;
        }

        const pulls = res.response.map((obj) => {
            //Better way once more we have more assets
            const src =
                obj.type == "slime"
                    ? "/assets/sprites/slime-sprite.gif"
                    : "/assets/sprites/baby-fire-wolf.png";

            const still =
                obj.type == "slime"
                    ? "/assets/stillSprites/still-slime.svg"
                    : "/assets/sprites/baby-fire-wolf.png";

            const output = {
                id: crypto.randomUUID(),
                name: obj.type,
                rank: obj.rarity,
                src: src,
                still: still,
                details:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus libero sit amet egestas accumsan. Sed massa sem, convallis et fringilla lacinia, faucibus sed augue.",
            };
            return output;
        });

        // const pulls = Array.from({ length: amount }, () => ({
        //     ...sprite,
        //     id: crypto.randomUUID(), // ensure unique key for React
        // }));

        setPulledSprites(pulls);
    };

    //Closes Pull Popup
    const closePullPopup = () => setPulledSprites([]);

    //0 pages deactivates pull btns
    useEffect(() => {
        if (pages <= 0) {
            console.log("true", pages);
            setShowError(true);
        } else {
            console.log("false", pages);
            setShowError(false); // Optional: reset error if pages increase
        }
    }, [pages]);

    //Setting pull rates from server
    useEffect(() => {
        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";
        const URL = API_BASE_URL + "game/fountain/get-pull-rates";
        const response = fetchWithAuth(
            URL,
            { method: "POST" },
            accessToken,
            refreshAccessToken,
            setAccessToken
        ).then((reponse) => {
            reponse.json().then((data) => {
                setRates(data.response);
            });
        });
    }, []);

    //Setting number of pages player has
    useEffect(() => {
        if (connectionStatus == "connected") {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const users_ref = ref(database, `users/${hash}/pages`);
            const unsubscribe = onValue(users_ref, (snapshot) => {
                const num_of_pages = snapshot.val() || -1;
                if (num_of_pages == undefined || num_of_pages == null) {
                    console.error(
                        "Internal Error: Pages not displaying properly"
                    );
                    return;
                }
                setPages(num_of_pages);
            });

            return () => unsubscribe();
        }
    }, [connectionStatus]);

    //Background
    useEffect(() => {
        document.body.classList.add("fountain-bg");
        return () => {
            document.body.classList.remove("fountain-bg");
        };
    }, []);

    return (
        <div>
            {/* Pull Area */}
            <div className="w-[619px] h-[447px] 3xl:w-[700px] 3xl:h-[500px] 4xl:w-[750px] 4xl:h-[550px] 5xl:w-[800px] 5xl:h-[600px] 6xl:w-[850px] 6xl:h-[650px] bg-[#FFFFFF]/90 flex items-center justify-center rounded-[10px] relative">
                <section className="h-[390px] flex flex-col items-center justify-center gap-[15px]">
                    <div className="flex flex-col items-center leading-none">
                        <img
                            src="/assets/icons/fountain-icon.svg"
                            alt="spritePull"
                            className="w-[100px] h-[100px]"
                        />
                        <div className="text-center">
                            <p className="text-[80px]">
                                {pages >= 0
                                    ? `${pages} Page${pages === 1 ? "" : "s"}`
                                    : "0 Page"}
                            </p>
                            {pages <= 0 && (
                                <p className="text-[25px] text-[#FBBB26]">
                                    You do not have enough pages. Play some
                                    games to earn pages!
                                </p>
                            )}
                        </div>
                    </div>

                    <p className="w-[403px] text-[25px] text-center leading-none">
                        Each page of the Codex Bestiarum stirs forgotten sprites
                        to rise—draw them forth if you dare, but know this: to
                        pull is to wager with fate itself.
                    </p>

                    {/* Pulling Btns */}
                    <div className="w-[350px] flex flex-row justify-between">
                        <button
                            onClick={() => handlePull(1)}
                            disabled={pages < 1}
                            className={`w-[145px] h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] cursor-pointer
                                ${
                                    showError
                                        ? "bg-[#DADADA] text-[#140E28] cursor-not-allowed shadow-[4px_4px_0_rgba(0,0,0,0.25)]"
                                        : "bg-[#4A63E4] hover:bg-[#1D329F] text-[#FEFAF3] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                                }`}
                        >
                            1 Page
                        </button>
                        <button
                            onClick={() => handlePull(10)}
                            disabled={pages < 10}
                            className={`w-[145px] h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] cursor-pointer
                                ${
                                    showError
                                        ? "bg-[#DADADA] text-[#140E28] cursor-not-allowed shadow-[4px_4px_0_rgba(0,0,0,0.25)]"
                                        : "bg-[#4A63E4] hover:bg-[#1D329F] text-white shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                                }`}
                        >
                            10 Pages
                        </button>
                    </div>
                </section>

                {/* Rate Detail Popup */}
                <button
                    onClick={handleRate}
                    className="absolute right-[20px] bottom-[5px] underline text-[25px] cursor-pointer"
                >
                    Rate Details
                </button>
                {showRate && (
                    <div className="w-[450px] h-[370px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 bg-[#FBBB26] z-50 rounded-[10px] p-[10px] flex flex-col items-center gap-[24px]">
                        <img
                            src="/assets/icons/closeBtn.svg"
                            alt="closeBtn"
                            onClick={closeRate}
                            className="absolute top-[10px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                        />
                        <h1 className="text-[40px]">Sprite Rates</h1>
                        <section className="h-[250px] flex flex-col items-center justify-between text-[25px]">
                            <p>Each sprite rarity have their own rates.</p>
                            <div>
                                {rates.map((rate) => (
                                    <ul
                                        key={rate.name}
                                        className="leading-[40px]"
                                    >
                                        <li>
                                            {rate.name} ={" "}
                                            {rate.percentage * 100}%
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Pulling Video */}
            {showVideo && !videoEnded && (
                <div className="fixed inset-0 bg-black z-50">
                    <video
                        src="/assets/bg/pull-sprite.mp4"
                        autoPlay
                        onEnded={() => {
                            setVideoEnded(true);
                            setShowVideo(false); // hide the video container
                        }}
                        onClick={(e) => {
                            e.currentTarget.pause(); // Stop the video
                            setVideoEnded(true);
                            setShowVideo(false);
                        }}
                        className="w-screen h-screen object-cover cursor-pointer"
                    />
                </div>
            )}

            {/* Pull Popup  */}
            {videoEnded && pulledSprites.length > 0 && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#4A63E4] z-50 rounded-[15px] p-[20px] flex flex-col items-center">
                    <img
                        src="/assets/icons/closeBtn.svg"
                        alt="closeBtn"
                        onClick={closePullPopup}
                        className="absolute top-[15px] right-[15px] cursor-pointer w-[40px] h-[40px]"
                    />
                    {pulledSprites.length === 1 ? (
                        <div className="w-[518px] h-[466px] max-h-[466px] flex flex-col items-center justify-center gap-[25px] text-[#FFFFFF]">
                            <img
                                src={pulledSprites[0].still}
                                alt={pulledSprites[0].name}
                                className="w-[160px] h-[160px] mb-2"
                            />
                            <div className="text-center text-[50px] leading-none">
                                <p>Congrats!</p>
                                <p>
                                    You obtained a{" "}
                                    <span className="text-yellow-400">
                                        {pulledSprites[0].rank}{" "}
                                        {pulledSprites[0].name}
                                    </span>
                                    .
                                </p>
                            </div>
                            <Link
                                to="/collection"
                                className="w-[174px] h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] bg-[#FEFAF3] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none text-[#273472] cursor-pointer"
                            >
                                View in Collection
                            </Link>
                        </div>
                    ) : (
                        <div className="relative w-[803px] h-[544px] flex flex-col items-center justify-center gap-[20px]">
                            <div className="absolute top-[25px] text-center text-[50px] text-[#FEFAF3] leading-none">
                                <p>Congrats! You have obtained . . .</p>
                            </div>
                            <div className=" grid grid-cols-5 gap-[17px]">
                                {pulledSprites.map((s) => (
                                    <img
                                        key={s.name}
                                        src={s.still}
                                        alt={s.name}
                                        className="w-[132px] h-[151px] shadow-xl"
                                    />
                                ))}
                            </div>
                            <Link
                                to="/collection"
                                className="absolute bottom-[30px] w-[174px] h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] bg-[#FEFAF3] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none text-[#273472] cursor-pointer"
                            >
                                View in Collection
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FountainPg;

