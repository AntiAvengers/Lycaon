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

import { getCreatureImage } from "../utils/getCreatureAsset";

const audio = {
    menu_click: new Audio('assets/sounds/header_menu_click.mp3'),
}

const name = {
    slime: {
        0: "Littles Egg",
        1: "Slime",
        2: "Big Slime"
    },
    cat: {
        0: "Familiar Egg",
        1: "Kitty",
        2: "Cat"
    },
    wolf: {
        0: "Noble Egg",
        1: "Wolfy",
        2: "Emberfang"
    },
    deer: {
        0: "Elite Egg",
        1: "Glacy",
        2: "Glacielle"
    },
    dragon: {
        0: "Mythic Egg",
        1: "Lumi",
        2: "Luminara"
    }
}

const SpritesCollectionPg = () => {
    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    const { currentWallet, connectionStatus } = useCurrentWallet();

    const { mutateAsync: signTransaction } = useSignTransaction();

    //set to [-1] because otherwise while getting info from database, it shows the "you have no sprites" part
    const [creaturesList, setCreatures] = useState([]);

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

                const updated_creatures = [];
                for (const key in collections) {
                    const {
                        favorite,
                        minted_ID,
                        rarity,
                        type,
                        stage,
                        on_marketplace,
                        nickname,
                        date_acquired,
                        can_evolve,
                    } = collections[key];

                    const showcase_size =
                        stage == 0
                            ? "200"
                            : stage == 1 && type !== "slime"
                            ? "322"
                            : "GIF";
                    const showcase_px =
                        showcase_size == "GIF" ? "200" : showcase_size;

                    const info = {
                        date_acquired: date_acquired,
                        src: getCreatureImage("238", type, stage),
                        still: getCreatureImage("238", type, stage),
                        showcase_src: getCreatureImage(
                            showcase_size,
                            type,
                            stage
                        ),
                        showcase_px: showcase_px,
                        label: key, //UUID
                        to: "/collection/spriteDetail",
                        rank: rarity,
                        name: name[type][stage],
                        type: type,
                        nickname: nickname,
                        mint: minted_ID,
                        marketplace: on_marketplace,
                        favorite: favorite,
                        evo: can_evolve,
                    };

                    updated_creatures.push(info);
                }
                updated_creatures.sort((a, b) =>
                    a.date_acquired > b.date_acquired ? -1 : 1
                );
                setCreatures(updated_creatures);
                setIsLoading(false);
            });

            return () => unsubscribe();
        }
    }, [connectionStatus]);

    //Like sprites
    const handleToggleLike = async (index) => {
        audio.menu_click.play();
        const currentLikesCount = creaturesList.filter(
            (obj) => obj.favorite
        ).length;
        if (currentLikesCount >= 3 && !creaturesList[index].favorite) {
            setPopupMessage("You can only like up to 3 Sprites!");
            setIsFading(false); // reset if re-triggered quickly
            setTimeout(() => setIsFading(true), 1000);
            setTimeout(() => {
                setPopupMessage("");
                setIsFading(false); // reset for next time
            }, 2500); // Remove after fade
            return;
        }

        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";

        const URL = API_BASE_URL + "users/sprites/update_sprite";

        const changed = !creaturesList[index].favorite;

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
            console.error(res.error);
            return;
        }
    };

    // Cancel marketplace listing
    const handleCancelListing = async (creature) => {
        audio.menu_click.play();
        try {
            setDisableButton(true);
            const API_BASE_URL =
                import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                    ? import.meta.env.VITE_DEV_URL
                    : "/";
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
                        import.meta.env.VITE_APP_MODE == "PRODUCTION"
                            ? "testnet"
                            : "devnet"
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
        document.title = "Lycaon";

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
                        {creaturesList.filter((obj) => obj.favorite).length ===
                        0 ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-[#000000] text-[50px] bg-white/20 backdrop-blur-md px-4 py-2 rounded-[20px]">
                                    Favorite a sprite to showcase your sprite!
                                </p>
                            </div>
                        ) : (
                            <ul className="w-full max-w-[755px] flex flex-row justify-evenly items-end pb-[10px]">
                                {creaturesList
                                    .filter((obj) => obj.favorite)
                                    .slice(0, 3) // up to 3
                                    .map((creature) => (
                                        <li key={creature.label}>
                                            <img
                                                // src={creature.src}
                                                src={creature.showcase_src}
                                                alt={creature.label}
                                                // className="w-[200px] max-w-[200px]"
                                                className={`w-[${creature.showcase_px}] max-w-[${creature.showcase_px}]`}
                                            />
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </section>

                    {/* Sprites Count */}
                    <section className="w-[754px] flex items-center">
                        <span className="text-[35px] ml-auto text-[#FEFAF3]">
                            {creaturesList.length}/100
                        </span>
                    </section>

                    {/* All Sprites */}
                    <ul className="w-[810px] h-[1050px] max-h-[1050px] grid grid-cols-3 gap-[25px] overflow-y-auto px-[20px]">
                        {creaturesList.map((creature, index) => (
                            <li
                                key={creature.label}
                                className="relative h-[312px] flex flex-col items-start"
                            >
                                {/* Badge for Cancel? + Listed*/}
                                {creature.marketplace && (
                                    <div>
                                        <button
                                            onClick={() =>
                                                setCancelPopup(creature)
                                            }
                                            className="absolute top-2 right-2 bg-[#FBBB26] text-black text-xs px-2 py-1 rounded-full z-10 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <span className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full z-10">
                                            Listed
                                        </span>
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
                                    {/* Evolve Badge */}
                                    {creature.evo && !creature.marketplace && (
                                        <span className="absolute top-2 left-2 bg-[#FBBB26] text-[#000000] text-xs px-2 py-1 rounded-full z-10">
                                            Ready to Evolve
                                        </span>
                                    )}
                                    {/* Like Btn */}
                                    <button
                                        onClick={() => handleToggleLike(index)}
                                        aria-label="favorite"
                                        className="absolute top-2 right-2 cursor-pointer"
                                    >
                                        {creature.favorite ? (
                                            <FavoriteIcon
                                                style={{ color: "#EA1A26" }}
                                            />
                                        ) : (
                                            <FavoriteBorderIcon
                                                style={{ color: "EA1A26" }}
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
                                        onClick={() => audio.menu_click.play()}
                                    >
                                        <img
                                            src={creature.src}
                                            alt={creature.label}
                                            className="w-[238px] max-w-[238px]"
                                        />
                                    </Link>
                                </div>
                                {/* Sprites Descipt */}
                                <div className="w-full h-[80px] flex flex-col items-start justify-between bg-[#4A63E4] py-[16px] px-[20px] leading-none text-[#FFFFFF]">
                                    <p className="w-full text-[18px] uppercase leading-none truncate">
                                        {creature.rank} {/* creature.name */}
                                    </p>
                                    <span className="w-full text-[25px] truncate">
                                        {creature.nickname || creature.name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* Cancel Popup */}
            {cancelPopup && (
                <div className="fixed inset-0 bg-[#140E28]/60 z-50">
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg z-50 w-[331px] h-[434px] flex flex-col items-center justify-center gap-[20px] text-[#FCF4EF] leading-none">
                        <img
                            src="/assets/icons/closeBtn.svg"
                            alt="closeBtn"
                            onClick={() => setCancelPopup(null)}
                            className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                        />
                        <h1 className="w-[70%] text-[35px] text-[#FCF4EF] text-center truncate">
                            {cancelPopup.name}
                        </h1>
                        <img
                            src={cancelPopup.still}
                            alt={cancelPopup.label}
                            className="object-contain w-[150px] h-[150px] max-h-[150px]"
                        />
                        <section className="w-full h-[101px] bg-[#242C53] flex flex-col items-center justify-center text-[#FCF4EF] text-[25px] text-center px-4">
                            <p className="w-[90%] text-[25px] text-center">
                                Would you like to take it off the market?
                            </p>
                        </section>
                        <button
                            onClick={() => handleCancelListing(cancelPopup)}
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
                </div>
            )}
        </div>
    );
};

export default SpritesCollectionPg;

