import { useState } from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const creaturesList = [
    {
        src: "/assets/sprites/celestial-sprite.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature1",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        mint: true,
        marketplace: false,
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature2",
        to: "/collection/spriteDetail",
        rank: "Littles",
        name: "Slimey",
        mint: true,
        marketplace: false,
    },
    {
        src: "/assets/sprites/celestial-sprite.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature3",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        mint: true,
        marketplace: false,
    },
    {
        src: "/assets/star.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature4",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        mint: true,
        marketplace: true,
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature5",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        mint: true,
        marketplace: true,
    },
    {
        src: "/assets/star.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature6",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        mint: true,
        marketplace: false,
    },
    {
        src: "/assets/star.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature7",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        mint: true,
        marketplace: false,
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature8",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        mint: true,
        marketplace: false,
    },
    {
        src: "/assets/star.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature9",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        mint: true,
        marketplace: false,
    },
];

const userData = { collection: 30 };

const SpritesCollectionPg = () => {
    const [likedList, setLikedList] = useState(
        Array(creaturesList.length).fill(false)
    );
    const [popupMessage, setPopupMessage] = useState(""); //popup for max like
    const [isFading, setIsFading] = useState(false); //fading for max like popup

    //Like sprites
    const handleToggleLike = (index) => {
        const updatedLikes = [...likedList];
        const currentLikesCount = updatedLikes.filter(Boolean).length;

        if (!updatedLikes[index]) {
            if (currentLikesCount >= 3) {
                setPopupMessage("You can only like up to 3 items!");
                setIsFading(false); // reset if re-triggered quickly
                setTimeout(() => setIsFading(true), 1000);
                setTimeout(() => {
                    setPopupMessage("");
                    setIsFading(false); // reset for next time
                }, 2500); // Remove after fade
                return;
            }
        }

        updatedLikes[index] = !updatedLikes[index];
        setLikedList(updatedLikes);
    };

    return (
        <div className="w-full flex flex-col items-center justify-start">
            {/* If user has no creatures */}
            {creaturesList.length === 0 && (
                <div
                    className="w-[890px] h-[598px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-[#FEFAF3] text-[#000000] text-[37px] text-center px-[40px] py-[20px] leading-none rounded-[20px] shadow-lg z-50 flex flex-col items-center justify-center gap-[40px]"
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
            {creaturesList.length > 0 && (
                <>
                    <h1 className="text-[80px] text-center">
                        Sprites Collection
                    </h1>

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
                    <section className="w-[702px] h-[260px] p-1 bg-[url('/assets/bg/grassBtmShowcase.svg')] bg-no-repeat bg-contain bg-bottom flex justify-end">
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
                        <span className="text-[35px] ml-auto">
                            {userData.collection}/100
                        </span>
                    </section>

                    {/* All Sprites */}
                    <ul className="w-[754px] grid grid-cols-3 gap-[25px]">
                        {creaturesList.map((creature, index) => (
                            <li
                                key={creature.label}
                                className={`flex flex-col items-start justify-between ${
                                    creature.marketplace
                                        ? "opacity-50 filter grayscale pointer-events-none cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {/* Badge */}
                                {creature.marketplace && (
                                    <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full z-10">
                                        Listed
                                    </span>
                                )}

                                <div className="w-full h-[219px] bg-[#FCF4E7]/50 flex flex-col justify-between items-center p-2 relative">
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
                                            <FavoriteBorderIcon />
                                        )}
                                    </button>
                                    {/* Spacer to push image down */}
                                    <div className="flex-grow" />
                                    {/* Sprites */}
                                    <Link key={creature.to} to={creature.to}>
                                        <img
                                            src={creature.src}
                                            alt={creature.label}
                                            className="object-contain max-h-[150px]"
                                        />
                                    </Link>
                                </div>
                                {/* Sprties Descipt */}
                                <div className="flex flex-col items-start">
                                    <span className="text-[15px] font-bold mt-2">
                                        {creature.rank}
                                    </span>
                                    <span className="text-[25px]">
                                        {creature.name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SpritesCollectionPg;

