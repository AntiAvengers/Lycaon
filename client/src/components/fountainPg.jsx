import { useEffect, useState } from "react";

const rates = [
    { name: "Littles", percent: 0.52 },
    { name: "Familiar", percent: 0.31 },
    { name: "Noble", percent: 0.12 },
    { name: "Elite", percent: 0.045 },
    { name: "Mythic", percent: 0.005 },
];

const sprite = {
    name: "Slime",
    rank: "Elite",
    src: "/assets/sprites/slime-sprite.gif",
    still: "/assets/stillSprites/still-slime.svg",
    details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus libero sit amet egestas accumsan. Sed massa sem, convallis et fringilla lacinia, faucibus sed augue.",
};

const FountainPg = () => {
    const [showRate, setShowRate] = useState(false);
    const [pulledSprites, setPulledSprites] = useState([]);

    //For Rate Btn
    const closeRate = () => setShowRate(false);
    const handleRate = () => setShowRate(true);

    //Popup message for Pull Btns
    const handlePull = (amount) => {
        const pulls = Array.from({ length: amount }, () => ({
            ...sprite,
            id: crypto.randomUUID(), // ensure unique key for React
        }));
        setPulledSprites(pulls);
    };

    //Closes Pull Popup
    const closePullPopup = () => setPulledSprites([]);

    useEffect(() => {
        document.body.classList.add("fountain-bg");
        return () => {
            document.body.classList.remove("fountain-bg");
        };
    }, []);

    return (
        <div>
            {/* Pull Area */}
            <div className="w-[619px] h-[447px] bg-[#FFFFFF]/60 fixed top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[10px]">
                <section className="h-[390px] flex flex-col items-center justify-evenly">
                    <div className="flex flex-col items-center justify-start">
                        <img
                            src="/assets/icons/scroll.svg"
                            alt="spritePull"
                            className="w-[150px] h-[150px]"
                        />
                        <p className="text-[80px]">X pages</p>
                    </div>

                    {/* Pulling Btns */}
                    <div className="w-[65%] flex flex-row justify-between">
                        <button
                            onClick={() => handlePull(1)}
                            className="w-[174px] h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none text-[25px] text-[#FFFFFF] cursor-pointer"
                        >
                            1 Page
                        </button>
                        <button
                            onClick={() => handlePull(10)}
                            className="w-[174px] h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none text-[25px] text-[#FFFFFF] cursor-pointer"
                        >
                            10 Pages
                        </button>
                    </div>
                </section>

                {/* Rate Detail Popup */}
                <button
                    onClick={handleRate}
                    className="absolute right-[25px] bottom-[10px] underline text-[25px] cursor-pointer"
                >
                    Rate Details
                </button>

                {/* Rate Popup  */}
                {showRate && (
                    <div className="w-[407px] h-[304px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 bg-[#FBBB26] z-50 rounded-[10px] p-[10px] flex flex-col items-center justify-between">
                        <img
                            src="/assets/icons/closeBtn.svg"
                            alt="closeBtn"
                            onClick={closeRate}
                            className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                        />
                        <h1 className="text-[40px]">Sprite Rates</h1>
                        <section className="h-[75%] flex flex-col items-center justify-between text-[25px]">
                            <p>Each sprite rarity have their own rates.</p>
                            <div>
                                {rates.map((rate) => (
                                    <ul
                                        key={rate.name}
                                        className="leading-tight"
                                    >
                                        <li>
                                            {rate.name} = {rate.percent * 100}%
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Pull Popup  */}
            {pulledSprites.length > 0 && (
                <div className="w-[331px] h-[434px] max-h-[434px] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 bg-[#FBBB26] z-50 rounded-[10px] p-[20px] flex flex-col items-center">
                    <img
                        src="/assets/icons/closeBtn.svg"
                        alt="closeBtn"
                        onClick={closePullPopup}
                        className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                    />
                    <h2 className="text-[30px] font-bold mb-[10px]">
                        You just pulled:
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {pulledSprites.map((s) => (
                            <div
                                key={s.id}
                                className="flex flex-col items-center"
                            >
                                <img
                                    src={s.still}
                                    alt={s.name}
                                    className="w-[80px] h-[80px]"
                                />
                                <p className="text-[20px] font-semibold">
                                    {s.name}
                                </p>
                                <p className="text-[16px]">{s.rank}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FountainPg;

