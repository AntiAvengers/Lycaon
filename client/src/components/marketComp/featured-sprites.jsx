import { useState, useEffect } from "react";

import { database } from "../../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";

import SHA256 from "crypto-js/sha256";

import { fetchWithAuth } from "../../api/fetchWithAuth";
import { useAuth } from "../../context/AuthContext";

import { useCurrentWallet, useSignTransaction } from "@mysten/dapp-kit";

import { getCreatureImage } from "../../utils/getCreatureAsset";

const name = {
    slime: {
        0: "Littles Egg",
        1: "Slime",
        2: "Big Slime",
    },
    cat: {
        0: "Familiar Egg",
        1: "Kitty",
        2: "Cat",
    },
    wolf: {
        0: "Noble Egg",
        1: "Wolfy",
        2: "Emberfang",
    },
    deer: {
        0: "Elite Egg",
        1: "Glacy",
        2: "Glacielle",
    },
    dragon: {
        0: "Mythic Egg",
        1: "Lumi",
        2: "Luminara",
    },
};

const FeaturedSprites = () => {
    const { currentWallet, connectionStatus } = useCurrentWallet();
    const { mutateAsync: signTransaction } = useSignTransaction();

    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    const [disableButton, setDisableButton] = useState(false);
    const [featuredSprites, setfeaturedSprites] = useState([]);

    useEffect(() => {
        if (connectionStatus == "connected") {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const marketplace_ref = ref(database, `marketplace`);

            const unsubscribe = onValue(marketplace_ref, (snapshot) => {
                //Initial State of "marketplace" is set to [],
                if (!snapshot.val()) return;

                //Otherwise iterate through collection and update creatures state
                const users = snapshot.val();
                const updated_creatures = [];
                for (const key in users) {
                    if (key !== hash && key !== "_init") {
                        // if(key !== '_init') {
                        for (const prop in users[key]) {
                            const { owner, rarity, type, price, stage } =
                                users[key][prop];
                            const stage_to_num =
                                stage == "Egg" ? 0 : stage == "Stage 1" ? 1 : 2;
                            const r = rarity.toLowerCase();
                            console.log(r, stage_to_num, type);
                            if (r == "mythic" || r == "elite") {
                                updated_creatures.push({
                                    owner: owner,
                                    label: prop,
                                    rank: rarity,
                                    name: name[type][stage_to_num],
                                    type: type,
                                    price: price,
                                    stage: stage,
                                    marketplace: true,
                                    mint: true,
                                    src: getCreatureImage(
                                        "322",
                                        type,
                                        stage_to_num
                                    ),
                                    still: getCreatureImage(
                                        "322",
                                        type,
                                        stage_to_num
                                    ),
                                });
                            }
                        }
                    }
                }
                setfeaturedSprites(updated_creatures);
                console.log(featuredSprites);
            });

            return () => unsubscribe();
        }
    }, [connectionStatus]);

    const handleBuy = async (sprite) => {
        try {
            setDisableButton(true);
            const API_BASE_URL =
                import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                    ? import.meta.env.VITE_DEV_URL
                    : "/";
            const REQUEST_URL =
                API_BASE_URL + "marketplace/listings/request_buy_tx";

            const buy_tx = await fetchWithAuth(
                REQUEST_URL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: sprite.label,
                        price: sprite.price,
                        owner: sprite.owner,
                    }),
                    credentials: "include",
                },
                accessToken,
                refreshAccessToken,
                setAccessToken
            );

            const tx = await buy_tx.json();

            if (tx.error) {
                setDisableButton(false);
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
                API_BASE_URL + "marketplace/listings/execute_buy_tx";

            const exec_buy_tx = await fetchWithAuth(
                EXECUTE_URL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        bytes,
                        signature,
                        id: sprite.label,
                        owner: sprite.owner,
                    }),
                    credentials: "include",
                },
                accessToken,
                refreshAccessToken,
                setAccessToken
            );

            const results = await exec_buy_tx.json();
            if (!results.response.rawEffects) {
                setDisableButton(false);
                return;
            }

            const { rawEffects } = results.response;

            if (rawEffects) {
                reportTransactionEffects(rawEffects);
                setDisableButton(false);
                return true;
            }
        } catch (err) {
            console.log(err);
            if (err.shape.message.includes("User rejected the request")) {
                setDisableButton(false);
            }
        }
    };

    return (
        <div className="w-full h-[421px] bg-[#4A63E4] flex justify-center items-center">
            {featuredSprites.length === 0 && (
                <div className="text-[50px] text-[#FEFAF3] tracking-[2px]">
                    <h1>Sorry no featured sprites available . . .</h1>
                </div>
            )}

            {featuredSprites.length > 0 && (
                <ul className="w-[1182px] h-[322px] flex flex-row items-center justify-between">
                    {featuredSprites.slice(0, 2).map((feature) => (
                        <li
                            key={feature.label}
                            className="w-[581px] max-w-[581px] h-[322px] flex flex-row items-center gap-[20px]"
                        >
                            <img
                                src={feature.still}
                                alt={feature.label}
                                className="w-[322px] object-contain bg-[#E9E9E9]"
                            />
                            <section className="w-[239px] max-w-[239px] flex flex-col justify-start gap-[5px] leading-none text-[#FEFAF3]">
                                <span className="text-[25px]">
                                    {feature.stage} {feature.rank}
                                </span>
                                <span className="text-[50px] text-wrap break-words">
                                    {feature.name}
                                </span>
                                <span className="flex flex-row items-center gap-[10px] text-[40px]">
                                    <img
                                        src="/assets/icons/sui-icon-bg.svg"
                                        alt="suiIcon"
                                        className="w-[29px]"
                                    />
                                    {Number(feature.price).toFixed(2)}
                                </span>
                                <button
                                    className={
                                        disableButton
                                            ? `w-[110px] h-[35px] bg-[#808080] rounded-[66px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#000000] text-white shadow-[4px_4px_0_rgba(0,0,0,0.25)] cursor-not-allowed pointer-events-none`
                                            : `w-[110px] h-[35px] bg-[#FBBB26] rounded-[66px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#000000] cursor-pointer`
                                    }
                                    onClick={() => handleBuy(feature)}
                                >
                                    Buy Now
                                </button>
                            </section>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FeaturedSprites;

