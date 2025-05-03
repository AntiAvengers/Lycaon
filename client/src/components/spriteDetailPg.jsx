import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FoodInventory from "./spriteDetailComp/foodInventory";
import SpritesInfo from "./spriteDetailComp/spriteInfo";
import FoodMeter from "./spriteDetailComp/foodMeter";
import MintPg from "./mintPg";

const initialFoodList = [
    { src: "/assets/foods/apple.svg", label: "apple", amt: 4, value: 1 },
    { src: "/assets/foods/cherries.svg", label: "cherries", amt: 56, value: 2 },
    { src: "/assets/foods/meat.svg", label: "chicken", amt: 100, value: 3 },
    { src: "/assets/foods/steak.svg", label: "steak", amt: 10, value: 4 },
];

const sprite = {
    name: "Sprite",
    src: "/assets/sprites/slime-sprite.gif",
    still: "/assets/stillSprites/still-slime.svg",
    hunger: 4,
    age: 5,
    personality: ["Happy", "Adventurous"],
    details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus libero sit amet egestas accumsan. Sed massa sem, convallis et fringilla lacinia, faucibus sed augue.",
    mint: false,
    marketplace: false,
    evo: true,
};

const SpritesDetailPg = () => {
    const [showMint, setShowMint] = useState(false); //Mint Popup
    const [hunger, setHunger] = useState(sprite.hunger); //Sprite hunger level
    const [foods, setFoods] = useState(initialFoodList); //User Food Inventory
    const [isFull, setIsFull] = useState(false); //Error message for Sprite Fullness
    const [isFading, setIsFading] = useState(false); //Fading timer for error message fullness
    const [minted, setMinted] = useState(sprite.mint); //Sprite minted state
    const [market, setMarket] = useState(sprite.marketplace); //Sprite maketplace state
    const [showAmount, setShowAmount] = useState(null); //Value of food being fed

    const navigate = useNavigate();

    const maxHunger = 8; //Max Hunger of Sprite

    //Mint Popup btn trigger
    const handleMintClick = () => {
        if (!minted) {
            setShowMint(true);
        } else if (minted && !market) {
            setShowMint(true);
        } else if (minted && market) {
            navigate("/marketplace");
        }
    };

    //Closes Mint Popup
    const closeMint = () => {
        setShowMint(false);
    };

    //Mint state change
    const handleMint = () => {
        setMinted(true);
    };

    //Marketplace state change
    const handleSell = () => {
        setMarket(true);
    };

    //Feeding
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

        // Show "+X" for feeding effect
        setShowAmount(`+${foodValue}`);
        setTimeout(() => setShowAmount(null), 1000);
    };

    //Background
    useEffect(() => {
        document.body.classList.add("spriteDetail-bg");
        return () => {
            document.body.classList.remove("spriteDetail-bg");
        };
    }, []);

    return (
        <div className="w-full h-[625px] flex flex-row justify-evenly items-center">
            {/* Food Inventory*/}
            <FoodInventory foods={foods} onFeed={handleFeed} />
            {/* Food Meter and Sprite Gif */}
            <section className="w-[496px] h-[543px] w-m-[496px] h-m-[543px] p-[15px] relative flex items-end justify-center">
                <FoodMeter hunger={hunger} max={maxHunger} />
                {showAmount && (
                    <span
                        className="absolute top-[75px] left-[150px] text-[#FFFFFF] text-[60px] font-bold"
                        style={{
                            transform: "translate(-50%, -50%)",
                            opacity: 1,
                            animation: "fade-up 1s ease-out forwards",
                        }}
                    >
                        {showAmount}
                    </span>
                )}
                <img
                    src={sprite.src}
                    alt={sprite.name}
                    className="min-w-[50%]"
                />
            </section>

            {/* Fullness Popup */}
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

            {/* Sprite Description Box*/}
            <section className="w-[343px] h-[409px] bg-[#FEFAF3]/65 rounded-[10px] py-[20px] px-[30px] flex flex-col justify-around items-right">
                <SpritesInfo sprite={sprite} />
                <button
                    onClick={handleMintClick}
                    className="w-[189px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#FFFFFF] text-center cursor-pointer"
                >
                    {minted
                        ? market
                            ? "View Marketplace"
                            : "Sell on Marketplace"
                        : "Mint Sprite"}
                </button>
            </section>

            {/* Mint Popup */}
            {showMint && (
                <div className="fixed inset-0 bg-[#140E28]/60 z-50 flex items-center justify-center">
                    <MintPg
                        onClose={closeMint}
                        sprite={sprite}
                        onMint={handleMint}
                        onSell={handleSell}
                        minted={minted}
                        market={market}
                    />
                </div>
            )}
        </div>
    );
};

export default SpritesDetailPg;

