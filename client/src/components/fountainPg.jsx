import { useEffect, useState } from "react";

const rates = [
    { name: "Littles", percent: 0.52 },
    { name: "Familiar", percent: 0.31 },
    { name: "Noble", percent: 0.12 },
    { name: "Elite", percent: 0.045 },
    { name: "Mythic", percent: 0.005 },
];

const FountainPg = () => {
    const [showRate, setShowRate] = useState(false);
    const [pullMessage, setPullMessage] = useState("");

    //For Rate Btn
    const closeRate = () => setShowRate(false);
    const handleRate = () => setShowRate(true);

    //Popmessage for Pull Btns
    const handlePull = (amount) => {
        setPullMessage(
            `You just pulled ${amount} page${amount > 1 ? "s" : ""}!`
        );
        setTimeout(() => setPullMessage(""), 2000);
    };

    useEffect(() => {
        document.body.classList.add("fountain-bg");
        return () => {
            document.body.classList.remove("fountain-bg");
        };
    }, []);
    return (
        <div className="w-[619px] h-[447px] bg-[#FFFFFF]/60 fixed top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[10px]">
            <div className="h-[390px] flex flex-col items-center justify-evenly">
                <section className="flex flex-col items-center justify-start">
                    <img
                        src="/assets/icons/scroll.svg"
                        alt="spritePull"
                        className="w-[150px] h-[150px]"
                    />
                    <p className="text-[80px]">X pages</p>
                </section>

                {/* Pulling Btns */}
                <section className="w-[65%] flex flex-row justify-between">
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
                </section>
            </div>

            {/* Rate Detaile Popup */}
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
                                <ul key={rate.name} className="leading-tight">
                                    <li>
                                        {rate.name} = {rate.percent * 100}%
                                    </li>
                                </ul>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {/* Pull Popup  */}
            {pullMessage && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 bg-[#FBBB26] text-black text-[30px] px-[20px] py-[10px] rounded-[10px] shadow-lg z-50">
                    {pullMessage}
                </div>
            )}
        </div>
    );
};

export default FountainPg;

