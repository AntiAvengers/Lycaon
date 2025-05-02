import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePg = () => {
    const [showNamePopup, setShowNamePopup] = useState(false); //new user Name popup
    const [showWelcomePopup, setShowWelcomePopup] = useState(false); //welcome popup
    const [playerName, setPlayerName] = useState(""); //Username

    // Popup for Name
    useEffect(() => {
        const isFirstTime = false; // Replace with actual login/new-user logic
        if (isFirstTime) {
            setShowNamePopup(true); // show first popup
        }
    }, []);

    // Background for HomePg
    useEffect(() => {
        document.body.classList.add("home-bg");
        return () => {
            document.body.classList.remove("home-bg");
        };
    }, []);

    //Enter btn triggers to next popup (Username >>> Welcome)
    useEffect(() => {
        const handleEnter = (e) => {
            if (e.key === "Enter" && showNamePopup && playerName.trim()) {
                setShowNamePopup(false);
                setShowWelcomePopup(true);
            }
        };
        window.addEventListener("keydown", handleEnter);
        return () => window.removeEventListener("keydown", handleEnter);
    }, [showNamePopup, playerName]);

    // Close popup with ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setShowWelcomePopup(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div
            className="flex w-full relative"
            aria-hidden={showWelcomePopup || showNamePopup}
        >
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

            {/* Background dimmed and prevents user from interacting w/ homePg */}
            {(showWelcomePopup || showNamePopup) && (
                <div className="fixed inset-0 bg-black opacity-50 z-40 pointer-events-auto" />
            )}

            {/* New UserName */}
            {showNamePopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg p-[30px] z-50 flex flex-col justify-center items-center">
                    <p className="text-[35px] text-white">
                        Before you go on your adventure...
                    </p>
                    <p className="text-[35px] text-white leading-none">
                        What is your name?
                    </p>
                    <p className="text-[25px] text-[#EA1A26] mb-4">
                        &#x26A0; Name can NOT be changed, choose wisely!
                        &#x26A0;
                    </p>
                    <input
                        type="text"
                        required
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        className="px-4 py-3 mb-4 rounded-[8px] text-[25px] text-white w-[280px] text-center outline-none focus:ring-2 focus:ring-[#FBBB26] shadow-md placeholder-gray-400"
                    />
                    <button
                        className={`px-5 py-2 rounded text-[20px] font-bold transition ${
                            playerName.trim()
                                ? "bg-[#FBBB26] hover:bg-yellow-400 cursor-pointer"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!playerName.trim()}
                        onClick={() => {
                            if (playerName.trim()) {
                                setShowNamePopup(false);
                                setShowWelcomePopup(true);
                            }
                        }}
                    >
                        Confirm
                    </button>
                </div>
            )}

            {/* New User Reward Popup */}
            {showWelcomePopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg p-[30px] z-50 flex flex-col justify-center items-center">
                    <img
                        src="/assets/icons/closeBtn.svg"
                        alt="closeBtn"
                        onClick={() => setShowWelcomePopup(false)}
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

