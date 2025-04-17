import { useEffect, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const HomePg = () => {
    const location = useLocation();
    const navType = useNavigationType();
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const cameFromRoot =
            document.referrer.endsWith("/") || location.state?.from === "/";
        if (navType === "PUSH" && cameFromRoot) {
            setShowPopup(true);
        }
    }, [location, navType]);

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="flex w-full max-w-screen mx-8 sm:mt-8 md:mt-8 sm:my-0 my-8 border-1 border-gray-300 bg-[#E9ECEF] justify-center items-center">
            <h1 className="text-5xl">Home</h1>

            {/* Popup */}
            {showPopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg p-[30px] z-50 flex flex-col justify-center items-center">
                    <img
                        src="/assets/icons/closeBtn.svg"
                        alt="closeBtn"
                        onClick={closePopup}
                        className="absolute top-[10px] right-[10px] cursor-pointer w-[30px] h-[30px]"
                    />
                    <section className="text-[25px] text-[#FFFFFF] text-center mt-[10px] leading-none tracking-[1px]">
                        <h1 className="text-[45px]">Welcome!</h1>
                        <p>Thank you for playing Lycaon! 🎉</p>
                        <p>As a new player, we gifted you 4 pages and 500 shards to start.</p>
                        <p>Go enjoy the game!!!!</p>
                    </section>
                </div>
            )}
        </div>
    );
};

export default HomePg;

