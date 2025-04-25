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

    useEffect(() => {
        document.body.classList.add("home-bg");
        return () => {
            document.body.classList.remove("home-bg");
        };
    }, []);

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="flex w-full relative">
            <div className="group">
                <img
                    className="absolute bottom-[45px] left-[606px] cursor-pointer"
                    src="/assets/icons/book.svg"
                    alt="bookIcon"
                />

                <img
                    className="absolute bottom-[45px] left-[606px] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    src="/assets/icons/book-hover.png"
                    alt="bookIconHover"
                />

                <span className="absolute bottom-[260px] left-[700px] leading-none text-[50px] text-[#000000] bg-white px-[15px] rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Puzzle
                </span>
            </div>

            {/* New User Reward Popup */}
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
                        <p>
                            As a new player, we gifted you 4 pages and 500
                            shards to start.
                        </p>
                        <p>Go enjoy the game!!!!</p>
                    </section>
                </div>
            )}
        </div>
    );
};

export default HomePg;

