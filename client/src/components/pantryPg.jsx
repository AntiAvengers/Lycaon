import { useState } from "react";

const foods = [
    { src: "/assets/foods/apple.svg", label: "apple", value: 1, price: 5 },
    { src: "/assets/foods/meat-stick.svg", label: "meat", value: 2, price: 10 },
    { src: "/assets/star.png", label: "pizza", value: 3, price: 25 },
    { src: "/assets/star.png", label: "carrot", value: 4, price: 50 },
];

const PantryPg = () => {
    const [buy, setBuy] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const closeBuy = () => {
        setBuy(false);
        setSelectedFood(null);
    };

    const handleBuy = (food) => {
        setSelectedFood(food);
        setQuantity(1);
        setBuy(true);
    };

    return (
        <div className="w-[1000px] h-[550px] flex flex-col text-[#FFFFFF]">
            <h1 className="text-start text-[60px]">Pantry</h1>
            <div className="flex-1 flex items-center justify-center">
                <ul className="w-full flex flex-row justify-between">
                    {foods.map((food) => (
                        <li
                            onClick={() => handleBuy(food)}
                            key={food.label}
                            className="group flex flex-col gap-2"
                        >
                            <section className="w-[200px] h-[200px] bg-[#FFFFFF] rounded-[10px] shadow-md flex justify-center items-center relative cursor-pointer  outline-[5px] outline-transparent transition-all duration-300 hover:outline-[#4A63E4] shadow-md active:inset-shadow-sm active:inset-shadow-[#000000] active:scale-95">
                                <img
                                    src={food.src}
                                    alt={food.label}
                                    className="w-[100px] h-[100px] transform transition duration-300 ease-in-out group-hover:-translate-y-1"
                                />
                            </section>
                            <section className="flex flex-col">
                                <span>{food.price} Shards</span>
                                <span>{food.label}</span>{" "}
                            </section>
                        </li>
                    ))}
                </ul>
            </div>

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
                        <section className="flex flex-row">
                            <label>Amount</label>
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
                                        const value = Math.max(1, Number(val));
                                        setQuantity(value);
                                    }
                                }}
                                className="no-spinner w-[35px] h-[20px] border-b-[1px] border-white outline-none bg-transparent text-end"
                            />
                        </section>

                        <p className="text-[25px] text-[#FCF4EF]">
                            Total: {selectedFood.price * quantity} Shards
                        </p>
                        <button className="bg-[#FEFAF3] text-[#273472] rounded-[4px] px-[20px] py-[5px] text-[25px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75">
                            Confirm Purchase
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PantryPg;

