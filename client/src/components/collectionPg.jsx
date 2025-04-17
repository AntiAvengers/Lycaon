import { useState } from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const creaturesList = [
    {
        src: "/assets/sprites/celestial-sprite.png",
        label: "creature1",
        to: "/collection/spriteDetail",
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        label: "creature2",
        to: "/collection/spriteDetail",
    },
    {
        src: "/assets/sprites/celestial-sprite.png",
        label: "creature3",
        to: "/collection/spriteDetail",
    },
    {
        src: "/assets/star.png",
        label: "creature4",
        to: "/collection/spriteDetail",
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        label: "creature5",
        to: "/collection/spriteDetail",
    },
    {
        src: "/assets/star.png",
        label: "creature6",
        to: "/collection/spriteDetail",
    },
    {
        src: "/assets/star.png",
        label: "creature7",
        to: "/collection/spriteDetail",
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        label: "creature8",
        to: "/collection/spriteDetail",
    },
    {
        src: "/assets/star.png",
        label: "creature9",
        to: "/collection/spriteDetail",
    },
];

const SpritesCollectionPg = () => {
    const [likedList, setLikedList] = useState(
        Array(creaturesList.length).fill(false)
    );
    const [popupMessage, setPopupMessage] = useState("");
    const [isFading, setIsFading] = useState(false);

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
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-[#EA1A26] text-[#FFFFFF] text-[32px] tracking-[2px] px-[40px] py-[20px] 
                    rounded-lg shadow-lg z-50 text-center"
                >
                    You do not have any sprites yet! Go play puzzles to earn
                    pages to roll for a sprite!
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

                    {/* Showcase */}
                    <section className="w-[702px] h-[260px] p-1 bg-[#FCF4E7]/10 rounded flex justify-end">
                        <ul className="w-full flex flex-row justify-evenly items-end pb-[10px]">
                            {creaturesList.slice(0, 3).map((creature) => (
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
                        <span className="text-[35px] ml-auto">30/100</span>
                    </section>

                    {/* All Sprites */}
                    <ul className="w-[754px] grid grid-cols-3 gap-[25px]">
                        {creaturesList.map((creature, index) => (
                            <li
                                key={creature.label}
                                className="bg-[#FCF4E7]/50 flex flex-col items-center justify-between p-[10px]"
                            >
                                <button
                                    onClick={() => handleToggleLike(index)}
                                    aria-label="favorite"
                                    className="w-full flex justify-end cursor-pointer"
                                >
                                    {likedList[index] ? (
                                        <FavoriteIcon
                                            style={{ color: "#EA1A26" }}
                                        />
                                    ) : (
                                        <FavoriteBorderIcon />
                                    )}
                                </button>
                                <Link key={creature.to} to={creature.to}>
                                    <img
                                        src={creature.src}
                                        alt={creature.label}
                                        className="object-contain"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SpritesCollectionPg;

