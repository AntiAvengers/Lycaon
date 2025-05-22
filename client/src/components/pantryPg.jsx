import { useState, useEffect } from "react";

import { database } from "../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";

import { fetchWithAuth } from "../api/fetchWithAuth";
import { useAuth } from "../context/AuthContext";

import SHA256 from "crypto-js/sha256";

import { useCurrentWallet } from "@mysten/dapp-kit";

const food_SVGs = {
    Cherry: "/assets/foods/cherries.svg",
    Apple: "/assets/foods/apple.svg",
    Chicken: "/assets/foods/meat.svg",
    Steak: "/assets/foods/steak.svg",
};

const PantryPg = () => {
    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    const { currentWallet, connectionStatus } = useCurrentWallet();

    const [buy, setBuy] = useState(false); //buy popup
    const [selectedFood, setSelectedFood] = useState(null);
    const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [foods, setFoods] = useState([]);
    const [error, setError] = useState(false);
    const [playerFoods, setPlayerFoods] = useState([]);

    const API_BASE_URL =
        import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
            ? import.meta.env.VITE_DEV_URL
            : "/";

    const purchase_food = async (food_type, amount) => {
        const URL = API_BASE_URL + "game/pantry/buy";
        const request = await fetchWithAuth(
            URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ food_type, amount }),
                credentials: "include", // to include cookies
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );

        const res = await request.json();

        if (res.error) {
            setError(res.error);
            return;
        }

        if (!purchaseConfirmed) setPurchaseConfirmed(true);
    };

    useEffect(() => {
        if (connectionStatus == "connected") {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const pantry_ref = ref(database, `pantry/${hash}`);

            const unsubscribe = onValue(pantry_ref, (snapshot) => {
                const player_foods = [];
                const pantry = snapshot.val();
                for (const food in pantry) {
                    player_foods.push({
                        label: food,
                        src: food_SVGs[food],
                        amt: pantry[food],
                    });
                }
                setPlayerFoods(player_foods);
            });

            return () => unsubscribe();
        }
    }, [connectionStatus]);

    useEffect(() => {
        const URL = API_BASE_URL + "game/pantry/get";

        fetchWithAuth(
            URL,
            { method: "POST", credentials: "include" },
            accessToken,
            refreshAccessToken,
            setAccessToken
        ).then((request) => {
            request.json().then((res) => {
                if (res.error) {
                    setError(res.error);
                    return;
                }
                const obj = res.response;
                const output = [];
                for (const key in obj) {
                    output.push({
                        label: key,
                        value: obj[key].value,
                        price: obj[key].cost,
                        src: food_SVGs[key],
                    });
                }
                setFoods(output);
            });
        });
    }, []);

    //closes buy popup
    const closeBuy = () => {
        setBuy(false);
        setSelectedFood(null);
        setPurchaseConfirmed(false);
        setError(false);
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
        <div className="self-start mt-[70px]" >
            <div className="w-[1150px] h-full flex flex-col justify-start gap-[35px] text-[#FFFFFF]">
                <h1 className="text-start text-[75px] leading-none">Pantry</h1>
                {/* User Pantry Inventory */}
                <div className="w-[305px] h-[44px] bg-[#F7F7F7] rounded-[10px] text-[#000000] text-[35px]">
                    <ul className="w-full h-full flex flex-row items-center justify-evenly">
                        {playerFoods.map((food) => (
                            <li
                                key={food.label}
                                className="flex flex-row items-center"
                            >
                                <img
                                    className="w-[25px] h-[25px]"
                                    src={food.src}
                                    alt={food.label}
                                />
                                <span>{food.amt}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex items-center justify-center">
                    {/* Pantry List */}
                    <ul className="w-full flex flex-row justify-between">
                        {foods.map((food) => (
                            <li
                                onClick={() => handleBuy(food)}
                                key={food.label}
                                className="group w-[262px] h-[262px] bg-[#F7F7F7] rounded-[10px] outline-[5px] outline-transparent transition-outline duration-300 hover:outline-[#4A63E4] shadow-md flex flex-col justify-between"
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
                                            src="/assets/icons/shard.svg"
                                            alt="shardIcon"
                                        />
                                        <span>{food.price}</span>
                                    </div>

                                    <span>{food.label}</span>
                                </section>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Purchase Popup */}
            {buy && (
                <div className="fixed inset-0 bg-[#140E28]/60 z-50">
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] text-[#FCF4EF] leading-none rounded-[10px] shadow-lg z-50 w-[331px] h-[434px] flex flex-col items-center justify-center gap-[15px]">
                        <img
                            src="/assets/icons/closeBtn.svg"
                            alt="closeBtn"
                            onClick={closeBuy}
                            className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                        />
                        {!purchaseConfirmed ? (
                            <section className="text-[35px] text-center">
                                <p>Confirm to buy </p>
                                <p>{selectedFood.label}</p>
                            </section>
                        ) : (
                            <section className="text-[35px] w-[75%] text-center">
                                <p>Thank you for your purchase!</p>
                            </section>
                        )}
                        <section className="bg-[#F7F7F7] rounded-full p-[25px]">
                            <img
                                src={selectedFood.src}
                                alt={selectedFood.label}
                                className="w-[100px] h-[100px]"
                            />
                        </section>

                        <section className="w-full h-[100px] bg-[#242C53] flex flex-col items-center justify-evenly text-[25px] text-[#FCF4EF] leading-none">
                            {/* Purchasing */}
                            {error ? (
                                <p>{error}</p>
                            ) : !purchaseConfirmed ? (
                                <>
                                    <section className="flex flex-row items-center gap-[50px]">
                                        <label>Amount</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            required
                                            onWheel={(e) => e.target.blur()}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === "") {
                                                    setQuantity("");
                                                } else {
                                                    const value = Math.max(
                                                        1,
                                                        Number(val)
                                                    );
                                                    setQuantity(value);
                                                }
                                            }}
                                            className="no-spinner w-[40px] h-[25px] border-b-[1px] border-white outline-none bg-transparent text-center text-white"
                                        />
                                    </section>
                                    <section className="flex flex-row items-center gap-[40px]">
                                        <p>Total Price</p>
                                        <p className="flex flex-row gap-[5px]">
                                            <span className="border-b-[1px] max-w-[70px] truncate">
                                                {selectedFood.price * quantity}{" "}
                                            </span>
                                            <img
                                                className="w-[21px] h-[22px]"
                                                src="/assets/icons/shard.svg"
                                                alt="shardIcon"
                                            />
                                        </p>
                                    </section>
                                </>
                            ) : (
                                // Purchased
                                <p className="text-[25px] text-[#FCF4EF] text-center">
                                    You bought {quantity}{" "}
                                    {selectedFood.label.charAt(
                                        selectedFood.label.length - 1
                                    ) == "y" && quantity > 1
                                        ? selectedFood.label.slice(0, -1)
                                        : selectedFood.label}
                                    {quantity > 1 &&
                                    selectedFood.label.charAt(
                                        selectedFood.label.length - 1
                                    ) == "y"
                                        ? "ies"
                                        : quantity > 1
                                        ? "s"
                                        : ""}
                                    ! 🎉
                                </p>
                            )}
                        </section>
                        {!purchaseConfirmed && (
                            <button
                                onClick={() => {
                                    // purchase_food(selectedFood.label, quantity);
                                    if (!quantity || quantity < 1) {
                                        setError(
                                            "Please enter a valid amount."
                                        );
                                        return;
                                    }
                                    setError(""); // Clear previous errors
                                    purchase_food(selectedFood.label, quantity);
                                }}
                                disabled={
                                    !quantity ||
                                    quantity < 1 ||
                                    error ||
                                    purchaseConfirmed
                                }
                                className={`rounded-[4px] px-[20px] py-[5px] text-[25px] transition-all duration-75 
                             ${
                                 !quantity ||
                                 quantity < 1 ||
                                 error ||
                                 purchaseConfirmed
                                     ? "bg-gray-400 text-white shadow-none cursor-not-allowed"
                                     : "bg-[#FEFAF3] text-[#273472] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
                             }`}
                            >
                                {error
                                    ? `${selectedFood.price * quantity} Shards`
                                    : "Confirm"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PantryPg;

