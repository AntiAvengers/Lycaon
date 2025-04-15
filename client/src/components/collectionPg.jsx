import { useState } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const creaturesList = [
    {
        src: "/assets/star.png",
        label: "creature1",
        to: "/collection/spriteDetail",
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        label: "creature2",
        to: "/collection/spriteDetail",
    },
    {
        src: "/assets/star.png",
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

    const handleToggleLike = (index) => {
        const updatedLikes = [...likedList];
        updatedLikes[index] = !updatedLikes[index];
        setLikedList(updatedLikes);
    };

    return (
        <div className="w-full flex flex-col items-center justify-start">
            <h1 className="text-[80px] text-center">Sprites Collection</h1>

            {/* Showcase */}
            <section className="w-[702px] h-[260px] p-1 bg-[#FCF4E7]/10 rounded flex flex-col justify-between items-end">
                <div className="w-[30px] h-[30px] flex items-center justify-center bg-[#FCF4E7]/50 rounded-full cursor-pointer">
                    <EditIcon />
                </div>
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
                                <FavoriteIcon style={{ color: "#EA1A26" }} />
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
        </div>
    );
};

export default SpritesCollectionPg;

