import { useState, useEffect } from "react";

const foods = [
    {
        src: "/assets/foods/cherries.svg",
        label: "Cherries",
        value: 1,
        price: 20,
    },
    {
        src: "/assets/foods/apple.svg",
        label: "Apple",
        value: 2,
        price: 40,
    },
    { src: "/assets/foods/meat.svg", label: "Chicken", value: 3, price: 100 },
    { src: "/assets/foods/steak.svg", label: "Steak", value: 4, price: 500 },
];

const PantryPg = () => {
    const [buy, setBuy] = useState(false); //buy popup
    const [selectedFood, setSelectedFood] = useState(null);
    const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
    const [quantity, setQuantity] = useState(1);

    //closes buy popup
    const closeBuy = () => {
        setBuy(false);
        setSelectedFood(null);
        setPurchaseConfirmed(false);
    };

    //handles food purchased
    const handleBuy = (food) => {
        setSelectedFood(food);
        setQuantity(1);
        setBuy(true);
    };

    //Background
    useEffect(() => {
        document.body.classList.add("pantry-bg");
        return () => {
            document.body.classList.remove("pantry-bg");
        };
    }, []);

    return (
        <div className="w-[1150px] h-[550px] flex flex-col text-[#FFFFFF]">
            <h1 className="text-start text-[75px]">Pantry</h1>
            <div className="flex-1 flex items-center justify-center">
                {/* Pantry List */}
                <ul className="w-full flex flex-row justify-between">
                    {foods.map((food) => (
                        <li
                            onClick={() => handleBuy(food)}
                            key={food.label}
                            className="group w-[262px] h-[262px] bg-[#FFFFFF]   rounded-[10px] outline-[5px] outline-transparent transition-outline duration-300 hover:outline-[#4A63E4] shadow-md flex flex-col justify-between"
                        >
                            <section className="h-[213px] flex justify-center items-center relative cursor-pointer transition-all duration-300 rounded-t-[10px] active:inset-shadow-sm active:inset-shadow-[#000000] active:scale-95">
                                <img
                                    src={food.src}
                                    alt={food.label}
                                    className="w-[147px] h-[147px] transform transition duration-300 ease-in-out group-hover:-translate-y-1"
                                />
                            </section>
                            <section className="h-[49px] bg-[#4A63E4] rounded-b-[10px] flex flex-row justify-center items-center gap-[30px] text-[25px] leading-none">
                                <div className="flex flex-row items-center gap-[5px]">
                                    <img 
                                    className="w-[21px] h-[23px]"
                                    src="/assets/icons/shard.svg" alt="shardIcon" />
                                 <span>{food.price}</span>   
                                </div>
                                
                                <span>{food.label}</span>
                            </section>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Purchase Popup */}
            {buy && (
                <div className="fixed inset-0 bg-[#140E28]/60 z-50 flex items-center justify-center">
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg z-50 w-[331px] h-[434px] flex flex-col items-center justify-evenly">
                        <img
                            src="/assets/icons/closeBtn.svg"
                            alt="closeBtn"
                            onClick={closeBuy}
                            className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                        />
                        <h1 className="text-[30px] text-[#FCF4EF]">
                            Buy {selectedFood.label}
                        </h1>
                        <img
                            src={selectedFood.src}
                            alt={selectedFood.label}
                            className="w-[160px] h-[160px]"
                        />
                        <section className="flex flex-col items-center gap-2">
                            {/* Purchasing */}
                            {!purchaseConfirmed ? (
                                <>
                                    <section className="flex flex-row items-center gap-2">
                                        <label className="text-white">
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onWheel={(e) => e.target.blur()}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === "") {
                                                    setQuantity(""); // allow empty temporarily
                                                } else {
                                                    const value = Math.max(
                                                        1,
                                                        Number(val)
                                                    );
                                                    setQuantity(value);
                                                }
                                            }}
                                            className="no-spinner w-[50px] h-[25px] border-b-[1px] border-white outline-none bg-transparent text-end text-white"
                                        />
                                    </section>
                                    <p className="text-[25px] text-[#FCF4EF]">
                                        Total: {selectedFood.price * quantity}
                                        {""} Shards
                                    </p>
                                </>
                            ) : (
                                // Purchased
                                <p className="text-[22px] text-[#FCF4EF] text-center">
                                    You bought {quantity} {selectedFood.label}
                                    {quantity > 1 ? "s" : ""}! 🎉
                                </p>
                            )}
                        </section>

                        <button
                            onClick={() => {
                                if (!purchaseConfirmed)
                                    setPurchaseConfirmed(true);
                            }}
                            disabled={purchaseConfirmed}
                            className={`rounded-[4px] px-[20px] py-[5px] text-[25px] transition-all duration-75 
                             ${
                                 purchaseConfirmed
                                     ? "bg-gray-400 text-white shadow-none cursor-not-allowed"
                                     : "bg-[#FEFAF3] text-[#273472] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                             }`}
                        >
                            {purchaseConfirmed
                                ? "Thank you for your purchase!"
                                : "Confirm Purchase"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PantryPg;

