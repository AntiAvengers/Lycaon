import { useState } from "react";
import { Link } from "react-router-dom";
import MintPg from "../mintPg";

const creaturesList = [
    {
        src: "/assets/sprites/celestial-sprite.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature1",
        to: "/collection/spriteDetail",
        rank: "Elite",
        stage: "Egg",
        name: "Nemo",
        mint: false,
        marketplace: false,
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature2",
        to: "/collection/spriteDetail",
        rank: "Littles",
        stage: "Basic",
        name: "Slimey",
        mint: false,
        marketplace: false,
    },
    {
        src: "/assets/sprites/celestial-sprite.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature3",
        to: "/collection/spriteDetail",
        rank: "Elite",
        stage: "Adult",
        name: "Nemo",
        mint: false,
        marketplace: false,
    },
    {
        src: "/assets/star.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature4",
        to: "/collection/spriteDetail",
        rank: "Elite",
        stage: "Egg",
        name: "Nemo",
        mint: false,
        marketplace: false,
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature5",
        to: "/collection/spriteDetail",
        rank: "Elite",
        stage: "Egg",
        name: "Nemo",
        mint: false,
        marketplace: false,
    },
    {
        src: "/assets/star.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature6",
        to: "/collection/spriteDetail",
        rank: "Elite",
        stage: "Egg",
        name: "Nemo",
        mint: false,
        marketplace: false,
    },
];

const UserListing = () => {
    const [showMint, setShowMint] = useState(false);
    const [sprite, setSprites] = useState(creaturesList);
    const [selectedSprite, setSelectedSprite] = useState(null);

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

    const btnSell = (clickedSprite) => {
        setSelectedSprite({ ...clickedSprite, marketplace: true });
        setSprites((prev) =>
            prev.map((s) =>
                s.label === clickedSprite.label
                    ? { ...s, marketplace: true }
                    : s
            )
        );
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

    return (
        <div className="w-[1261px] h-[337px] bg-[#FEFAF4] rounded-[10px]">
            {creaturesList.length === 0 && (
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
            {creaturesList.length > 0 && (
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
                                <section className="flex flex-col text-[25px]">
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
                                                btnSell(sprite);
                                            }
                                        }}
                                        disabled={sprite.marketplace}
                                        className={`underline cursor-pointer ${
                                            sprite.marketplace
                                                ? "text-gray-400 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {sprite.mint
                                            ? sprite.marketplace
                                                ? "On Marketplace"
                                                : "Sell on Marketplace"
                                            : "Start Minting"}
                                    </button>
                                </section>
                            </li>
                        ))}
                    </ul>
                    <Link to="/collection" className="underline text-[25px]">
                        View your collection
                    </Link>
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

