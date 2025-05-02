import { useEffect, useState } from "react";
import { useLocation, useNavigationType, Link } from "react-router-dom";

const HomePg = () => {
    const location = useLocation();
    const navType = useNavigationType();
    const [showPopup, setShowPopup] = useState(false);

    // Trigger for New User Popup --- still need connect on how to detect new user
    useEffect(() => {
        document.title = "Lycaon - Home"; 
        const cameFromRoot =
            document.referrer.endsWith("/") || location.state?.from === "/";
        if (navType === "PUSH" && cameFromRoot) {
            setShowPopup(true);
        }
    }, [location, navType]);

    // Background for HomePg
    useEffect(() => {
        document.body.classList.add("home-bg");
        return () => {
            document.body.classList.remove("home-bg");
        };
    }, []);

    // Close popup with ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setShowPopup(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="flex w-full relative">
            {/* Book Group */}
            <div className="group">
                <Link to="/puzzle">
                    <img
                        className="absolute bottom-[45px] left-[51.20%] transform -translate-x-1/2 cursor-pointer group-hover:opacity-0 transition-opacity duration-200"
                        src="/assets/icons/book.svg"
                        alt="bookIcon"
                    />
                    <img
                        className="absolute bottom-[45px] left-[51.20%] transform -translate-x-1/2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        src="/assets/icons/book-hover.png"
                        alt="bookIconHover"
                    />
                </Link>

                <span className="absolute bottom-[260px] left-[52%] transform -translate-x-1/2 leading-none text-[50px] text-[#000000] bg-white px-[15px] rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Puzzle
                </span>
            </div>

            {/* Statue Group */}
            <div className="group z-30">
                <Link to="/collection">
                    <img
                        className="absolute top-1/2 left-0 transform -translate-y-[53%] cursor-pointer"
                        src="/assets/icons/statues.png"
                        alt="statuesIcon"
                    />
                    <span className="absolute top-1/2 left-[9%] transform -translate-y-[30%] leading-none text-[50px] text-[#000000] bg-white px-[15px] rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Collection
                    </span>
                </Link>
            </div>

            {/* Market Group */}
            <div className="group">
                <Link to="/marketplace">
                    <img
                        className="absolute top-1/2 right-[1%] transform -translate-y-[74%] cursor-pointer"
                        src="/assets/icons/market.png"
                        alt="marketIcon"
                    />
                    <span className="absolute top-1/2 right-[10%] transform -translate-y-[50%] leading-none text-[50px] text-[#000000] bg-white px-[15px] rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Marketplace
                    </span>
                </Link>
            </div>

            {/* Pantry Group */}
            <div className="group">
                <Link to="/pantry">
                    <img
                        className="absolute top-1/2 left-[23.5%] transform -translate-y-[75%]"
                        src="/assets/icons/tree.png"
                        alt="treeIcon"
                    />
                    <span className="absolute top-1/2 left-[26%] transform -translate-y-[50%] leading-none text-[50px] text-[#000000] bg-white px-[15px] rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Pantry
                    </span>
                </Link>
            </div>

            {/* Fountain Group */}

            <div className="group">
                <Link to="/fountain">
                    <img
                        className="absolute top-1/2 left-1/2 transform -translate-x-[47%] -translate-y-[18%]"
                        src="/assets/icons/fountain.png"
                        alt="foundtainIcon"
                    />
                    <span className="absolute top-[150px] left-[51%] transform -translate-x-1/2 leading-none text-[50px] text-[#000000] bg-white px-[15px] rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Fountain
                    </span>
                </Link>
            </div>

            {/* New User Reward Popup */}
            {showPopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg p-[30px] z-50 flex flex-col justify-center items-center">
                    <img
                        src="/assets/icons/closeBtn.svg"
                        alt="closeBtn"
                        onClick={() => setShowPopup(false)}
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

