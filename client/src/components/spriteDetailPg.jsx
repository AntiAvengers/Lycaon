import { useEffect, useState } from "react";

import FoodInventory from "./spriteDetailComp/foodInventory";
import SpritesInfo from "./spriteDetailComp/spriteInfo";
import FoodMeter from "./spriteDetailComp/foodMeter";
import MintPg from "./mintPg";

const initialFoodList = [
    { src: "/assets/star.png", label: "apple", amt: 4, value: 1 },
    { src: "/assets/star.png", label: "meat", amt: 56, value: 2 },
    { src: "/assets/star.png", label: "pizza", amt: 100, value: 3 },
    { src: "/assets/star.png", label: "carrot", amt: 10, value: 4 },
];

const sprite = {
    name: "Sprite",
    src: "/assets/sprites/slime-sprite.gif",
    still:"/assets/stillSprites/still-slime.svg",
    hunger: 4,
    age: 5,
    personality: ["Happy", "Adventurous"],
    details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus libero sit amet egestas accumsan. Sed massa sem, convallis et fringilla lacinia, faucibus sed augue.",
};

const SpritesDetailPg = () => {
    const [showMint, setShowMint] = useState(false);
    const [hunger, setHunger] = useState(sprite.hunger);
    const [foods, setFoods] = useState(initialFoodList);
    const [isFull, setIsFull] = useState(false);
    const [isFading, setIsFading] = useState(false);

    const maxHunger = 8;

    const handleMintClick = () => {
        setShowMint(true);
    };

    const closeMint = () => {
        setShowMint(false);
    };

    const handleFeed = (foodValue, foodLabel) => {
        if (hunger >= maxHunger || isFading) {
            // Block feeding while fading
            setIsFull(true);
            setIsFading(false); // reset fade immediately

            // Start fading after 1.5 seconds
            setTimeout(() => {
                setIsFading(true);
            }, 1000); // delay fade

            // Fully hide popup after 2.5 seconds
            setTimeout(() => {
                setIsFull(false);
                setIsFading(false);
            }, 2000);

            return; // Block feeding when full
        }

        setHunger((prev) => Math.min(prev + foodValue, maxHunger));
        setFoods((prevFoods) =>
            prevFoods.map((food) =>
                food.label === foodLabel && food.amt > 0
                    ? { ...food, amt: food.amt - 1 }
                    : food
            )
        );
    };

    useEffect(() => {
        document.body.classList.add("spriteDetail-bg");
        return () => {
            document.body.classList.remove("spriteDetail-bg");
        };
    }, []);

    return (
        <div className="w-full h-[625px] flex flex-row justify-evenly items-center">
            {/* Food */}
            <FoodInventory foods={foods} onFeed={handleFeed} />
            <section className="w-[496px] h-[543px]  rounded-[10px] p-[15px] relative flex items-end justify-center">
                <FoodMeter hunger={hunger} max={maxHunger} />
                <img
                    src={sprite.src}
                    alt={sprite.name}
                    className="min-w-[50%]"
                />
            </section>

            {isFull && (
                <div
                    className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-[#FFFFFF] text-[#000000] text-[30px] tracking-[2px] p-[20px] rounded-lg shadow-lg z-50 
                    transition-opacity duration-1000 ease-in-out
                    ${isFading ? "opacity-0" : "opacity-100"}`}
                >
                    {sprite.name} is full!
                </div>
            )}

            {/* Sprite */}
            <section className="w-[343px] h-[409px] bg-[#FEFAF3]/65 rounded-[10px] py-[20px] flex flex-col justify-around items-center">
                <SpritesInfo sprite={sprite} />
                <button
                    onClick={handleMintClick}
                    className="w-[189px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#FFFFFF] text-center"
                >
                    Mint Sprite
                </button>
            </section>

            {/* Minting Comp Popup */}
            {showMint && (
                <div className="fixed inset-0 bg-[#140E28]/60 z-50 flex items-center justify-center">
                    <MintPg onClose={closeMint} sprite={sprite} />
                </div>
            )}
        </div>
    );
};

export default SpritesDetailPg;

