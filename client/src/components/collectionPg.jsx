import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { fetchWithAuth } from "../api/fetchWithAuth";
import { useAuth } from "../context/AuthContext";

import { database } from "../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";

import SHA256 from "crypto-js/sha256";

import { useCurrentWallet, useSignTransaction } from "@mysten/dapp-kit";

import {
    getCreatureImage,
    getCreatureStillImage,
} from "../utils/getCreatureAsset";

const SpritesCollectionPg = () => {
    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    const { currentWallet, connectionStatus } = useCurrentWallet();

    const { mutateAsync: signTransaction } = useSignTransaction();

    //set to [-1] because otherwise while getting info from database, it shows the "you have no sprites" part
    const [creaturesList, setCreatures] = useState([]);

    const [likedList, setLikedList] = useState(
        Array(creaturesList.length).fill(false)
    );

    const [popupMessage, setPopupMessage] = useState(""); //popup for max like
    const [isFading, setIsFading] = useState(false); //fading for max like popup
    const [cancelPopup, setCancelPopup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [disableButton, setDisableButton] = useState(false);

    //Firebase Database - Collection of Sprites
    useEffect(() => {
        if (connectionStatus == "connected") {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const collections_ref = ref(database, `collections/${hash}`);

            const unsubscribe = onValue(collections_ref, (snapshot) => {
                //Initial State of "creatures" is set to [],
                if (!snapshot.exists()) {
                    setIsLoading(false);
                    return;
                }
                if (!snapshot.val()) {
                    setIsLoading(false);
                    return;
                }
                //Otherwise iterate through collection and update creatures state
                const collections = snapshot.val();

                const updated_likes = [...likedList];
                const updated_creatures = [];
                let i = 0;

                for (const key in collections) {
                    const {
                        favorite,
                        minted_ID,
                        rarity,
                        type,
                        stage,
                        on_marketplace,
                        nickname,
                    } = collections[key];

                    if (favorite) {
                        updated_likes[i] = favorite;
                    }

                    const info = {
                        src: getCreatureImage(type, stage),
                        still: getCreatureStillImage(type, stage),
                        label: key, //UUID
                        to: "/collection/spriteDetail",
                        rank: rarity,
                        name: type,
                        nickname: nickname,
                        mint: minted_ID,
                        marketplace: on_marketplace,
                    };

                    updated_creatures.push(info);

                    i++;
                }
                setCreatures(updated_creatures);
                setLikedList(updated_likes);
                setIsLoading(false);
            });

            return () => unsubscribe();
        }
    }, [connectionStatus]);

    //Like sprites
    const handleToggleLike = async (index) => {
        const updatedLikes = [...likedList];
        const currentLikesCount = updatedLikes.filter(Boolean).length;

        if (!updatedLikes[index]) {
            if (currentLikesCount >= 3) {
                setPopupMessage("You can only like up to 3 Sprites!");
                setIsFading(false); // reset if re-triggered quickly
                setTimeout(() => setIsFading(true), 1000);
                setTimeout(() => {
                    setPopupMessage("");
                    setIsFading(false); // reset for next time
                }, 2500); // Remove after fade
                return;
            }
        }

        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "";

        const URL = API_BASE_URL + "users/sprites/update_sprite";

        const changed = !updatedLikes[index];

        console.log(creaturesList[index].label, changed);

        const request = await fetchWithAuth(
            URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: creaturesList[index].label,
                    favorite: changed,
                }),
                credentials: "include", // to include cookies
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );

        const res = await request.json();

        if (res.error) {
            return;
        }

        updatedLikes[index] = changed;
        setLikedList(updatedLikes);
    };

    // Cancel marketplace listing
    const handleCancelListing = async (creature) => {
        try {
            setDisableButton(true);
            const API_BASE_URL =
                import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                    ? import.meta.env.VITE_DEV_URL
                    : "";
            const REQUEST_URL =
                API_BASE_URL + "marketplace/listings/request_cancel_tx";

            console.log(creature.label);

            const cancel_tx = await fetchWithAuth(
                REQUEST_URL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: creature.label }),
                    credentials: "include",
                },
                accessToken,
                refreshAccessToken,
                setAccessToken
            );

            const tx = await cancel_tx.json();
            console.log(tx);

            if (tx.error) {
                console.error(tx.error);
                return;
            }

            const { transactionBlock } = tx;

            const { bytes, signature, reportTransactionEffects } =
                await signTransaction({
                    transaction: transactionBlock,
                    chain: `sui:${
                        import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                            ? "devnet"
                            : "testnet"
                    }`,
                });

            const EXECUTE_URL =
                API_BASE_URL + "marketplace/listings/execute_cancel_tx";

            const exec_cancel_tx = await fetchWithAuth(
                EXECUTE_URL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        bytes,
                        signature,
                        id: creature.label,
                    }),
                    credentials: "include",
                },
                accessToken,
                refreshAccessToken,
                setAccessToken
            );

            const results = await exec_cancel_tx.json();
            const { rawEffects } = results.response;

            if (rawEffects) {
                reportTransactionEffects(rawEffects);
                setCancelPopup(null);
                setDisableButton(false);
                return true;
            }
        } catch (err) {
            if (err.shape.message.includes("User rejected the request")) {
                setDisableButton(false);
            }
        }
    };

    //Background
    useEffect(() => {
        document.body.classList.add("collection-bg");
        return () => {
            document.body.classList.remove("collection-bg");
        };
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-start gap-[10px] relative">
            {/* If user has no creatures */}
            {creaturesList.length === 0 && !isLoading && (
                <div
                    className="w-[890px] h-[598px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-[#FEFAF3] text-[#000000] text-[50px] text-center px-[40px] py-[20px] leading-none rounded-[20px] shadow-lg flex flex-col items-center justify-center gap-[40px]"
                >
                    <span>0/100</span>
                    <section>
                        <p>You do not have any sprites!</p>
                        <p>
                            Play some games and earn pages to pull for sprites!
                        </p>
                    </section>
                    <Link
                        to="/puzzle"
                        className="w-[189px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#FFFFFF] cursor-pointer flex items-center justify-center"
                    >
                        Play the puzzle!
                    </Link>
                    <img src="/assets/bg/grassBtmShowcase.svg" alt="grassBtm" />
                </div>
            )}

            {/* Only show content below if there are creatures */}
            {creaturesList.length > 0 && !isLoading && (
                <>
                    {/* Like Error Message */}
                    {popupMessage && (
                        <div
                            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-[#EA1A26] text-[#FFFFFF] text-[30px] tracking-[2px] p-[20px] rounded-lg shadow-lg z-50 
                    transition-opacity duration-1000 ease-in-out
                    ${isFading ? "opacity-0" : "opacity-100"}`}
                        >
                            {popupMessage}
                        </div>
                    )}

                    {/* Showcase - Liked Creatures */}
                    <section className="w-[755px] h-[500px] p-1 bg-[url('/assets/bg/grassBtmShowcase.svg')] bg-no-repeat bg-contain bg-bottom flex justify-end">
                        <ul className="w-full flex flex-row justify-evenly items-end pb-[10px]">
                            {creaturesList
                                .filter((_, idx) => likedList[idx]) // only liked
                                .slice(0, 3) // up to 3
                                .map((creature) => (
                                    <li key={creature.label}>
                                        <img
                                            src={creature.src}
                                            alt={creature.label}
                                            className="object-contain"
                                        />
                                    </li>
                                ))}
                        </ul>
                    </section>

                    {/* Sprites Count */}
                    <section className="w-[754px] flex items-center">
                        <span className="text-[35px] ml-auto text-[#FFFFFF]">
                            {creaturesList.length}/100
                        </span>
                    </section>

                    {/* All Sprites */}
                    <ul className="w-[810px] h-[1050px] grid grid-cols-3 gap-[25px] overflow-y-auto px-[20px]">
                        {creaturesList.map((creature, index) => (
                            <li
                                key={creature.label}
                                className="relative h-[312px] flex flex-col items-start"
                            >
                                {/* Badge for Cancel? + Listed*/}
                                {creature.marketplace && (
                                    <div>
                                        <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full z-10">
                                            Listed
                                        </span>
                                        <button
                                            onClick={() =>
                                                setCancelPopup(creature)
                                            }
                                            className="absolute top-2 left-2 bg-[#FBBB26] text-black text-xs px-2 py-1 rounded-full z-10 cursor-pointer"
                                        >
                                            Cancel?
                                        </button>
                                    </div>
                                )}

                                <div
                                    className={`w-full h-[219px] bg-[#FEFAF3] flex flex-col justify-between items-center p-2 relative 
                                     ${
                                         creature.marketplace
                                             ? "opacity-50 grayscale pointer-events-none"
                                             : ""
                                     }
                                    `}
                                >
                                    {/* Like Btn */}
                                    <button
                                        onClick={() => handleToggleLike(index)}
                                        aria-label="favorite"
                                        className="absolute top-2 right-2 cursor-pointer"
                                    >
                                        {likedList[index] ? (
                                            <FavoriteIcon
                                                style={{ color: "#EA1A26" }}
                                            />
                                        ) : (
                                            <FavoriteBorderIcon
                                                style={{ color: "#EA1A26" }}
                                            />
                                        )}
                                    </button>
                                    {/* Spacer to push image down */}
                                    <div className="flex-grow" />
                                    {/* Sprites */}
                                    <Link
                                        key={creature.to}
                                        to={creature.to}
                                        state={{ id: creature.label }}
                                    >
                                        <img
                                            src={creature.src}
                                            alt={creature.label}
                                            className="object-contain max-h-[150px]"
                                        />
                                    </Link>
                                </div>
                                {/* Sprites Descipt */}
                                <div className="w-full h-[80px] flex flex-col items-start justify-between bg-[#4A63E4] py-[16px] px-[20px] leading-none text-[#FFFFFF]">
                                    <section className="text-[18px] flex flex-row justify-start gap-[10px]">
                                        <span className="uppercase">
                                            {creature.rank}
                                        </span>
                                        <span className="capitalize" >{creature.name}</span>
                                    </section>

                                    <span className="text-[25px]" >
                                        {creature.nickname || creature.name}
                                    </span>
                                </div>

                                {/* Cancel Popup */}
                                {cancelPopup && (
                                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-md z-50 w-[331px] h-[434px] flex flex-col items-center justify-center gap-[20px] text-white leading-none">
                                        <img
                                            src="/assets/icons/closeBtn.svg"
                                            alt="closeBtn"
                                            onClick={() => setCancelPopup(null)}
                                            className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                                        />
                                        <img
                                            src={cancelPopup.still}
                                            alt={cancelPopup.label}
                                            className="object-contain max-h-[150px]"
                                        />
                                        <span className="text-[25px]">
                                            {cancelPopup.name}
                                        </span>
                                        <p className="text-[25px] text-center">
                                            Would you like to take it off the
                                            marketplace?
                                        </p>
                                        <button
                                            onClick={() =>
                                                handleCancelListing(cancelPopup)
                                            }
                                            className={`w-fit h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] bg-[#FEFAF3] text-[#273472] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer
                                                ${
                                                    disableButton
                                                        ? "bg-gray-400 text-white shadow-none cursor-not-allowed pointer-events-none"
                                                        : "bg-[#FEFAF3] text-[#273472] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
                                                }`}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SpritesCollectionPg;

