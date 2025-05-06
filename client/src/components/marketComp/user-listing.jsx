import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MintPg from "../mintPg";

import { database } from '../../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

import SHA256 from 'crypto-js/sha256';

import { useCurrentWallet, useSignTransaction } from '@mysten/dapp-kit';

import { getCreatureImage, getCreatureStillImage } from "../../utils/getCreatureAsset";

// const creaturesList = [
//     {
//         src: "/assets/sprites/celestial-sprite.png",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature1",
//         to: "/collection/spriteDetail",
//         rank: "Elite",
//         stage: "Egg",
//         name: "Nemo",
//         mint: false,
//         marketplace: false,
//     },
//     {
//         src: "/assets/sprites/slime-sprite.gif",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature2",
//         to: "/collection/spriteDetail",
//         rank: "Littles",
//         stage: "Basic",
//         name: "Slimey",
//         mint: false,
//         marketplace: false,
//     },
//     {
//         src: "/assets/sprites/celestial-sprite.png",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature3",
//         to: "/collection/spriteDetail",
//         rank: "Elite",
//         stage: "Adult",
//         name: "Nemo",
//         mint: false,
//         marketplace: false,
//     },
//     {
//         src: "/assets/star.png",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature4",
//         to: "/collection/spriteDetail",
//         rank: "Elite",
//         stage: "Egg",
//         name: "Nemo",
//         mint: false,
//         marketplace: false,
//     },
//     {
//         src: "/assets/sprites/slime-sprite.gif",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature5",
//         to: "/collection/spriteDetail",
//         rank: "Elite",
//         stage: "Egg",
//         name: "Nemo",
//         mint: false,
//         marketplace: false,
//     },
//     {
//         src: "/assets/star.png",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature6",
//         to: "/collection/spriteDetail",
//         rank: "Elite",
//         stage: "Egg",
//         name: "Nemo",
//         mint: false,
//         marketplace: false,
//     },
// ];

const UserListing = () => {
    const { currentWallet, connectionStatus } = useCurrentWallet();

    const [showMint, setShowMint] = useState(false);
    const [sprite, setSprites] = useState([]);
    const [selectedSprite, setSelectedSprite] = useState(null);
    const [cancelPopup, setCancelPopup] = useState(null);

    useEffect(() => {       
        if(connectionStatus == 'connected') {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const collections_ref = ref(database, `collections/${hash}`);

            const unsubscribe = onValue(collections_ref, (snapshot) => {
                //Initial State of "creatures" is set to [],
                if(!snapshot.val()) return;

                //Otherwise iterate through collection and update creatures state
                const collections = snapshot.val();

                // const updated_likes = [...likedList];
                const updated_creatures = [];
                
                for(const key in collections) {
                    const { minted_ID, rarity, type, stage, on_marketplace } = collections[key];

                    const info = {
                        src: getCreatureImage(type, stage),
                        still: getCreatureStillImage(type, stage),
                        label: key, //UUID
                        to: "/collection/spriteDetail",
                        rank: rarity,
                        stage: stage == 0 ? 'Egg' : stage == 1 ? 'Basic?' : 'Adult?',
                        name: type,
                        mint: minted_ID,
                        marketplace: on_marketplace
                    }

                    updated_creatures.push(info);
                }
                setSprites(updated_creatures);
            });

            return () => unsubscribe();
        }
    }, [connectionStatus]);

    const handleMintClick = (clickedSprite) => {
        setSelectedSprite(clickedSprite);
        setShowMint(true);
    };

    const closeMint = () => {
        setShowMint(false);
        setSelectedSprite(null);
    };

    const handleMint = () => {
        setSprites((prev) =>
            prev.map((s) =>
                s.label === selectedSprite.label ? { ...s, mint: true } : s
            )
        );
        setSelectedSprite((prev) => ({ ...prev, mint: true }));
    };

    const handleSell = () => {
        setSprites((prev) =>
            prev.map((s) =>
                s.label === selectedSprite.label
                    ? { ...s, marketplace: true }
                    : s
            )
        );
        setSelectedSprite((prev) => ({ ...prev, marketplace: true }));
    };

    // Cancel marketplace listing
    const handleCancelListing = (label) => {
        setSprites((prev) =>
            prev.map((s) =>
                s.label === label ? { ...s, marketplace: false } : s
            )
        );

        // Also update selectedSprite if it's the one being canceled
        setSelectedSprite((prev) =>
            prev && prev.label === label
                ? { ...prev, marketplace: false }
                : prev
        );

        setCancelPopup(null);
    };

    return (
        <div className="w-[1261px] h-[337px] bg-[#FEFAF4] rounded-[10px]">
            {sprite.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center leading-none">
                    <section className="text-center text-[#000000] text-[37px] pb-[20px]">
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
                </div>
            )}
            {sprite.length > 0 && (
                <div className="h-full px-[80px] py-[10px] flex flex-col justify-around">
                    <h1 className="text-[40px]">Your Sprites</h1>
                    <ul className="flex flex-row items-center justify-between">
                        {sprite.slice(0, 3).map((sprite) => (
                            <li
                                key={sprite.label}
                                className="flex flex-row items-center gap-[20px]"
                            >
                                <img
                                    src={sprite.still}
                                    alt={sprite.label}
                                    className="object-contain bg-[#E9E9E9]"
                                />
                                <section className="flex flex-col items-start text-[25px]">
                                    <span>
                                        {sprite.stage} {sprite.rank}
                                    </span>
                                    <span>{sprite.name}</span>
                                    <button
                                        onClick={() => {
                                            if (!sprite.mint) {
                                                handleMintClick(sprite);
                                            } else if (
                                                sprite.mint &&
                                                !sprite.marketplace
                                            ) {
                                                // btnSell(sprite);
                                                handleMintClick(sprite);
                                            }
                                        }}
                                        disabled={sprite.marketplace}
                                        className={`underline cursor-pointer hover:text-[#FBBB26] ${
                                            sprite.marketplace
                                                ? "text-gray-400 pointer-events-none cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {sprite.mint
                                            ? sprite.marketplace
                                                ? "On Marketplace"
                                                : "Sell on Marketplace"
                                            : "Start Minting"}
                                    </button>
                                    {sprite.marketplace && (
                                        <button
                                            onClick={() =>
                                                setCancelPopup(sprite)
                                            }
                                            className="underline cursor-pointer hover:text-[#FBBB26]"
                                        >
                                            Cancel?
                                        </button>
                                    )}
                                </section>
                            </li>
                        ))}
                    </ul>
                    <Link to="/collection" className="underline text-[25px]">
                        View your collection
                    </Link>

                    {cancelPopup && (
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg z-50 w-[331px] h-[434px] flex flex-col items-center justify-center gap-[20px] text-white leading-none">
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
                                Would you like to take it off the marketplace?
                            </p>
                            <button
                                onClick={() =>
                                    handleCancelListing(cancelPopup.label)
                                }
                                className="w-fit h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] bg-[#FEFAF3] text-[#273472] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
                            >
                                Confirm
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Minting Comp Popup */}
            {showMint && selectedSprite && (
                <div className="fixed inset-0 bg-[#140E28]/60 z-50 flex items-center justify-center">
                    <MintPg
                        onClose={closeMint}
                        sprite={selectedSprite}
                        onMint={handleMint}
                        onSell={handleSell}
                    />
                </div>
            )}
        </div>
    );
};

export default UserListing;

