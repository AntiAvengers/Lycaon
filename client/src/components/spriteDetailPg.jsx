import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { database } from "../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";

import SHA256 from "crypto-js/sha256";

import { fetchWithAuth } from "../api/fetchWithAuth";
import { useAuth } from "../context/AuthContext";

import { useCurrentWallet, useSignTransaction } from "@mysten/dapp-kit";

import {
    getCreatureImage,
    getCreatureStillImage,
} from "../utils/getCreatureAsset";

import FoodInventory from "./spriteDetailComp/foodInventory";
import SpritesInfo from "./spriteDetailComp/spriteInfo";
import FoodMeter from "./spriteDetailComp/foodMeter";
import MintPg from "./mintPg";
import { getAge } from "../utils/getAge";

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
    //Need character limit on details
    details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus libero sit amet egestas accumsan. Sed massa sem, convallis et fringilla lacinia, faucibus sed augue.",
    mint: false,
    marketplace: false,
    evo: true,
};

const food_SVGs = {
    Apple: "/assets/foods/apple.svg",
    Cherry: "/assets/foods/cherries.svg",
    Chicken: "/assets/foods/meat.svg",
    Steak: "/assets/foods/steak.svg",
};

const audio = {
    feed: new Audio("assets/sounds/sprite_eat.mp3"),
};

const SpritesDetailPg = () => {
    const { currentWallet, connectionStatus } = useCurrentWallet();

    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    const [showMint, setShowMint] = useState(false);
    const [hunger, setHunger] = useState(sprite.hunger);
    const [foods, setFoods] = useState(initialFoodList);
    const [isFull, setIsFull] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [minted, setMinted] = useState(sprite.mint);
    const [market, setMarket] = useState(sprite.marketplace);
    const [showAmount, setShowAmount] = useState(null);
    const [foodValues, setFoodValues] = useState({});
    const [lore, setLore] = useState("");
    const [spriteInfo, setSpriteInfo] = useState(false);

    const location = useLocation();
    const { id } = location.state;

    const { mutateAsync: signTransaction } = useSignTransaction();

    //Setting State for - All Food Values
    useEffect(() => {
        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";
        const URL = API_BASE_URL + "game/pantry/get";
        fetchWithAuth(
            URL,
            { method: "POST", credentials: "include" },
            accessToken,
            refreshAccessToken,
            setAccessToken
        )
            .then((request) => request.json())
            .then((res) => setFoodValues(res.response));

        const LORE_URL = API_BASE_URL + "users/sprites/get-lore";
        fetchWithAuth(
            LORE_URL,
            { method: "POST", credentials: "include" },
            accessToken,
            refreshAccessToken,
            setAccessToken
        )
            .then((request) => request.json())
            .then((res) => setLore(res.response));
    }, []);

    //Setting State for - Hunger, Pantry Inventory
    useEffect(() => {
        if (connectionStatus == "connected") {
            if (Object.keys(foodValues).length === 0) return;

            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const sprite_ref = ref(database, `collections/${hash}/${id}`);
            const pantry_ref = ref(database, `pantry/${hash}`);

            const unsubscribe_sprite = onValue(sprite_ref, (snapshot) => {
                const sprite_snapshot = snapshot.val();
                const {
                    date_of_birth,
                    hunger,
                    type,
                    stage,
                    traits,
                    minted_ID,
                    on_marketplace,
                    can_evolve,
                    nickname,
                    experience,
                } = sprite_snapshot;
                const details = lore[type.toLowerCase()]?.lore;
                const personality = Object.values(traits).filter(
                    (t) => t !== "?"
                );
                const name = type.charAt(0).toUpperCase() + type.slice(1);

                setSpriteInfo({
                    id: id,
                    name: nickname.length > 0 ? nickname : name,
                    age: getAge(date_of_birth),
                    stage: stage,
                    // src: getCreatureImage(type, stage), //Defaults to Star if nothing matches
                    src: "/assets/sprite-550/550x550 _noble.png",
                    // src: "/assets/sprites/flame-wolf.gif",
                    still: getCreatureStillImage(type, stage), //Defaults to Star if nothing matches
                    personality: personality,
                    details: details || "NO INFO FOUND",
                    mint: minted_ID,
                    marketplace: on_marketplace,
                    evo: can_evolve,
                    experience: experience,
                });
                //The reason why the message shows up, marketplace_UUID is truthy and passed down to mintPg
                //Wait no it's not....this should still be false during the minting process
                setMarket(on_marketplace);
                setMinted(!minted_ID ? false : true);
                setHunger(hunger);
            });

            const unsubscribe_pantry = onValue(pantry_ref, (snapshot) => {
                const pantry = snapshot.val();
                const array = [];
                for (const key in pantry) {
                    array.push({
                        src: food_SVGs[key],
                        label: key,
                        amt: pantry[key],
                        value: foodValues[key]?.value ?? 0,
                    });
                }
                setFoods(array);
            });

            return () => {
                unsubscribe_sprite();
                unsubscribe_pantry();
            };
        }
    }, [connectionStatus, foodValues, lore]);

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

    const closeMint = () => {
        setShowMint(false);
    };

    const handleMint = async () => {
        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";
        const REQUEST_URL = API_BASE_URL + "users/sprites/request_mint_tx";
        const mint_tx = await fetchWithAuth(
            REQUEST_URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id }),
                credentials: "include",
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );

        const tx = await mint_tx.json();

        if (tx.error) {
            console.error(tx.error);
            return;
        }

        const { transactionBlock } = tx;

        const { bytes, signature, reportTransactionEffects } =
            await signTransaction({
                transaction: transactionBlock,
                chain: `sui:${
                    import.meta.env.VITE_APP_MODE == "PRODUCTION"
                        ? "testnet"
                        : "devnet"
                }`,
            });

        const EXECUTE_URL = API_BASE_URL + "users/sprites/execute_mint_tx";

        const exec_mint_tx = await fetchWithAuth(
            EXECUTE_URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bytes, signature, id: id }),
                credentials: "include",
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );

        const results = await exec_mint_tx.json();
        const { rawEffects } = results.response;
        console.log("RAW EFFECTS:", rawEffects);

        if (rawEffects) {
            setMinted(true);
            reportTransactionEffects(rawEffects);
            return true;
        }
    };

    const handleSell = async (asking_price) => {
        console.log("Running handleSell() on spriteDetailPg");
        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";
        const REQUEST_URL =
            API_BASE_URL + "marketplace/listings/request_listing_tx";
        console.log(id);
        const mint_tx = await fetchWithAuth(
            REQUEST_URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id, asking_price: asking_price }),
                credentials: "include",
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );

        const tx = await mint_tx.json();
        console.log(tx);

        if (tx.error) {
            console.error(tx.error);
            return;
        }

        const { transactionBlock } = tx;

        const { bytes, signature, reportTransactionEffects } =
            await signTransaction({
                transaction: transactionBlock,
                chain: `sui:${
                    import.meta.env.VITE_APP_MODE == "PRODUCTION"
                        ? "testnet"
                        : "devnet"
                }`,
            });

        if (!signature) {
            console.error("SOMETHING WENT WRONG");
        }

        const EXECUTE_URL =
            API_BASE_URL + "marketplace/listings/execute_listing_tx";

        const exec_mint_tx = await fetchWithAuth(
            EXECUTE_URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bytes,
                    signature,
                    id: id,
                    asking_price: asking_price,
                }),
                credentials: "include",
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );

        const results = await exec_mint_tx.json();
        const { rawEffects } = results.response;

        if (rawEffects) {
            console.log("rawEffects True: for handleSell");
            reportTransactionEffects(rawEffects);
            setMarket(true);
            return true;
        }
    };

    const handleFeed = async (foodLabel) => {
        //API Call to get how much hunger is
        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";
        const URL = API_BASE_URL + "users/sprites/update_sprite";
        const request = await fetchWithAuth(
            URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: id,
                    food_type: foodLabel,
                }),
                credentials: "include", // to include cookies
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );

        const res = await request.json();
        if (res.response) {
            //Sprite Full
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

            // setHunger((prev) => Math.min(prev + foodValue, maxHunger));
            // setFoods((prevFoods) =>
            //     prevFoods.map((food) =>
            //         food.label === foodLabel && food.amt > 0
            //             ? { ...food, amt: food.amt - 1 }
            //             : food
            //     )
            // );

            // Show "+X" for feeding effect
            audio.feed.play();
            setShowAmount(`+${res.response.food_value}`);
            setTimeout(() => setShowAmount(null), 1000);
        }
    };

    //Background
    useEffect(() => {
        document.body.classList.add("spriteDetail-bg");
        return () => {
            document.body.classList.remove("spriteDetail-bg");
        };
    }, []);

    return (
        <div className="w-[1440px] h-[75vh] flex flex-row justify-evenly items-center relative">
            {/* Food Inventory */}
            <section className="flex flex-col">
                <FoodInventory
                    foods={foods}
                    onFeed={handleFeed}
                    disabled={spriteInfo && spriteInfo.stage == 0}
                />
                <Link
                    to="/pantry"
                    className="mt-[25px] underline text-[25px] text-[#FFFFFF] cursor-pointer hover:text-[#FBBB26]"
                >
                    Go to Pantry
                </Link>
            </section>
            {/* Food Meter and Sprite Gif */}
            <section className="w-[550px] h-full w-m-[496px] h-m-[543px] p-[15px] relative flex items-end justify-center">
                <FoodMeter
                    hunger={hunger}
                    max={maxHunger}
                    egg={spriteInfo.stage === 0}
                />
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
                    src={spriteInfo && spriteInfo.src}
                    alt={spriteInfo && spriteInfo.name}
                    className="w-full"
                    // className="min-w-[50%]"
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
                    {spriteInfo.name} is full!
                </div>
            )}

            {/* Sprite Description Box*/}
            <section className="w-[343px] h-[409px] bg-[#FEFAF3]/65 rounded-[10px] py-[35px] px-[40px] flex flex-col justify-between items-right">
                {spriteInfo && <SpritesInfo sprite={spriteInfo} />}
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

            <Link
                to="/collection"
                className="absolute right-[70px] bottom-[0px] underline text-[25px] text-[#FFFFFF] cursor-pointer hover:text-[#FBBB26]"
            >
                Back to Collection
            </Link>

            {/* Mint Popup */}
            {showMint && (
                <div className="fixed inset-0 bg-[#140E28]/60 z-50 flex items-center justify-center">
                    <MintPg
                        onClose={closeMint}
                        sprite={spriteInfo}
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

