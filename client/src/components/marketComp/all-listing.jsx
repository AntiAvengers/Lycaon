import { useState, useMemo, useEffect } from "react";

import { database } from "../../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";

import SHA256 from "crypto-js/sha256";

import { fetchWithAuth } from "../../api/fetchWithAuth";
import { useAuth } from "../../context/AuthContext";

import { useCurrentWallet, useSignTransaction } from "@mysten/dapp-kit";

import {
    getCreatureImage,
    getCreatureStillImage,
} from "../../utils/getCreatureAsset";

const AllListing = () => {
    const { currentWallet, connectionStatus } = useCurrentWallet();
    const { mutateAsync: signTransaction } = useSignTransaction();

    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    const [filter, setFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("price");
    const [sortOrder, setSortOrder] = useState("asc");
    const [creaturesList, setCreaturesList] = useState([]);
    const [filteredCreatures, setFilteredCreatures] = useState([]);
    const [disableButton, setDisableButton] = useState(false);

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
                        for (const prop in users[key]) {
                            const { owner, rarity, type, price, stage } =
                                users[key][prop];
                            const stage_to_num =
                                stage == "Egg" ? 0 : stage == "Basic" ? 1 : 2;
                            updated_creatures.push({
                                owner: owner,
                                label: prop,
                                rank: rarity,
                                name: type,
                                price: price,
                                stage: stage,
                                marketplace: true,
                                mint: true,
                                src: getCreatureImage(type, stage_to_num),
                                still: getCreatureStillImage(
                                    type,
                                    stage_to_num
                                ),
                            });
                        }
                    }
                }
                setCreaturesList(updated_creatures);
            });

            return () => unsubscribe();
        }
    }, [connectionStatus]);

    useEffect(() => {
        const rankOrder = ["Littles", "Familiar", "Noble", "Elite", "Mythic"];

        const sortFn = (a, b) => {
            if (sortBy === "price") {
                return sortOrder === "asc"
                    ? a.price - b.price
                    : b.price - a.price;
            } else if (sortBy === "rank") {
                return sortOrder === "asc"
                    ? rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank)
                    : rankOrder.indexOf(b.rank) - rankOrder.indexOf(a.rank);
            }
            return 0;
        };

        if (filter === "all") {
            // No prioritization, just sort all
            setFilteredCreatures([...creaturesList].sort(sortFn));
        } else {
            const prioritized = creaturesList
                .filter((c) => c.rank === filter)
                .sort(sortFn);
            const rest = creaturesList
                .filter((c) => c.rank !== filter)
                .sort(sortFn);
            setFilteredCreatures([...prioritized, ...rest]);
        }
    }, [creaturesList, filter, sortBy, sortOrder]);

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
        <div className="w-[1267px]">
            {creaturesList.length === 0 && (
                <div className="h-[50dvh] flex items-center justify-center text-[50px] text-[#FEFAF3] tracking-[2px]">
                    <h1>No listing on the market yet . . .</h1>
                </div>
            )}

            {creaturesList.length > 0 && (
                <div className="flex flex-col items-start justify-start mt-[10px] gap-[25px] relative">
                    <div className="w-full flex justify-end">
                        <button
                            onClick={() => setShowFilters((prev) => !prev)}
                            className="w-[57px] h-[35px] rounded-[66px] bg-[#FFFFFF] flex items-center justify-center cursor-pointer shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75"
                        >
                            <img
                                src="/assets/icons/filter.svg"
                                alt="filterIcon"
                                className="w-[20px] h-[25px]"
                            />
                        </button>
                    </div>

                    {showFilters && (
                        <div className="absolute top-[45px] right-0 text-[#FCF4E7] bg-[#273472] rounded-[10px] shadow-md p-2 z-10 w-[150px]">
                            <button
                                className="block w-full text-left px-2 py-1 rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 cursor-pointer"
                                onClick={() => {
                                    setFilter("all");
                                    setShowFilters(false);
                                }}
                            >
                                All
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 cursor-pointer"
                                onClick={() => {
                                    setSortBy("price");
                                    setSortOrder("asc");
                                    setShowFilters(false);
                                }}
                            >
                                Price ↑
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 cursor-pointer"
                                onClick={() => {
                                    setSortBy("price");
                                    setSortOrder("desc");
                                    setShowFilters(false);
                                }}
                            >
                                Price ↓
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 cursor-pointer"
                                onClick={() => {
                                    setSortBy("rank");
                                    setSortOrder("asc");
                                    setShowFilters(false);
                                }}
                            >
                                Rank ↑
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 cursor-pointer"
                                onClick={() => {
                                    setSortBy("rank");
                                    setSortOrder("desc");
                                    setShowFilters(false);
                                }}
                            >
                                Rank ↓
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 cursor-pointer"
                                onClick={() => {
                                    setFilter("Littles");
                                    setShowFilters(false);
                                }}
                            >
                                Littles
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 cursor-pointer"
                                onClick={() => {
                                    setFilter("Familiar");
                                    setShowFilters(false);
                                }}
                            >
                                Familiar
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 cursor-pointer"
                                onClick={() => {
                                    setFilter("Noble");
                                    setShowFilters(false);
                                }}
                            >
                                Noble
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 cursor-pointer"
                                onClick={() => {
                                    setFilter("Elite");
                                    setShowFilters(false);
                                }}
                            >
                                Elite
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 cursor-pointer"
                                onClick={() => {
                                    setFilter("Mythic");
                                    setShowFilters(false);
                                }}
                            >
                                Mythic
                            </button>
                        </div>
                    )}

                    <ul className="w-full flex flex-wrap gap-x-[105px] gap-y-[50px] max-w-max">
                        {filteredCreatures.map((creature) => (
                            <li
                                key={creature.label}
                                className="w-[238px] h-[370px]"
                            >
                                <img
                                    src={creature.still}
                                    alt={creature.label}
                                    className="w-full h-[237px] object-contain bg-[#E9E9E9]"
                                />
                                <section className="flex flex-col leading-none gap-[5px] mt-[5px] text-[#FEFAF3]">
                                    <span className="flex flex-row items-center gap-[10px] text-[25px]">
                                        <img
                                            src="/assets/icons/sui-icon-bg.svg"
                                            alt="suiIcon"
                                            className="w-[17px]"
                                        />
                                        {creature.price}
                                    </span>
                                    <span className="text-[18px] uppercase">
                                        {creature.stage} {creature.rank}
                                    </span>
                                    <span className="text-[30px] text-wrap truncate">
                                        {creature.name}
                                    </span>
                                    <button
                                        className={
                                            disableButton
                                                ? `w-[110px] h-[35px] bg-[#808080] rounded-[66px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#000000] text-white shadow-none cursor-not-allowed pointer-events-none`
                                                : `w-[110px] h-[35px] bg-[#FBBB26] rounded-[66px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#000000] cursor-pointer`
                                        }
                                        onClick={() => handleBuy(creature)}
                                    >
                                        Buy Now
                                    </button>
                                </section>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AllListing;

