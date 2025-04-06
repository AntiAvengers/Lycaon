import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InGameCurrencyTracker from "./headerComp/inGameCurrencyTracker.jsx";
import SuiWallet from "./headerComp/suiWallet.jsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [revealedWord, setRevealedWord] = useState("");
    const [message, setMessage] = useState("");

    const location = useLocation(); // Track the current route
    const navigate = useNavigate();
    const menuRef = useRef(null); // Reference for the menu

    const handleHomeClick = () => {
        navigate("/home"); // Navigate to home
        window.location.reload(); // Force a page reload
    };

    // Show the confirmation popup or message
    const handlePuzzleClick = (e) => {
        e.preventDefault();
        if (location.pathname === "/puzzles") {
            setMessage("You are already on the Puzzles page!");
            setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
        } else {
            setLoading(true);
            setCountdown(3); // Reset countdown
            setRevealedWord("");

            let timer = 3;
            const interval = setInterval(() => {
                timer -= 1;
                setCountdown(timer);
                if (timer === 0) {
                    clearInterval(interval);
                    // Pause before revealing the word
                    setTimeout(() => {
                        setRevealedWord("Random Game"); // Reveal word
                        setTimeout(() => {
                            navigate("/puzzles"); // Navigate after reveal
                            setLoading(false);
                            setRevealedWord("");
                        }, 2000); // Reveal for 2 seconds
                    }, 1400); // Pause for 1.5sec before reveal
                }
            }, 1000); // Countdown every second
        }
    };

    const handleClick = () => {
        setOpen((prev) => !prev);
        console.log("Dropdown menu header clicked");
    };

    // Close dropdown on route change
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // Memorized function to prevent unnecessary re-creations
    const handleOutsideClick = useCallback((event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("pointerdown", handleOutsideClick);
        return () =>
            document.removeEventListener("pointerdown", handleOutsideClick);
    }, [handleOutsideClick]);

    return (
        <header className="sticky top-0 z-50 sm:h-[75px] text-[#FCF4E7] flex justify-center items-center">
            <div className="w-[1255px] max-w-full h-[55px] bg-[#273472] sm:rounded-[79px] py-[10px] px-6 sm:px-[40px] flex flex-row justify-between shadow-md mx-0 md:mx-[10px] sm:mx-0">
                {/* Left Section: Menu and Logo */}
                <section className="flex flex-row justify-between items-center gap-4 sm:gap-[30px]">
                    <div ref={menuRef} className="relative">
                        {open ? (
                            <img
                                src="assets/icons/closeBtn.svg"
                                alt="Currency Icon"
                                className="w-[40px] h-[40px]"
                                onClick={handleClick}
                            />
                        ) : (
                            <img
                                src="assets/icons/openBtn.svg"
                                alt="Currency Icon"
                                className="w-[40px] h-[40px]"
                                onClick={handleClick}
                            />
                        )}
                        {open && (
                            <ul className="absolute w-[136px] sm:w-[255px] h-auto -left-[24px] sm:left-0 mt-[7px] shadow-xl rounded-b-[10px] px-[10px] pt-[10px] pb-[20px] bg-[#273472]">
                                {[
                                    { to: "/home", label: "Home" },
                                    {
                                        to: "/puzzles",
                                        label: "Puzzles",
                                        action: handlePuzzleClick,
                                    },
                                    { to: "/fountain", label: "Fountain" },
                                    { to: "/collection", label: "Collection" },
                                    { to: "/trove", label: "Trove" },
                                    { to: "/market", label: "Market" },
                                ].map((item) => (
                                    <li
                                        key={item.to}
                                        className="w-[128px] sm:w-[235px] h-[42px] sm:h-[45px] flex items-center pl-[20px] sm:pl-[36px] pr-[10px] py-[10px] rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:shadow-none transition-hover duration-200"
                                    >
                                        <Link
                                            className="text-start text-[26px] text-[#FCF4E7]"
                                            to={item.to}
                                            onClick={
                                                item.action ||
                                                (() => setOpen(false))
                                            }
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button
                        onClick={handleHomeClick}
                        className="flex flex-row items-center text-[24px] sm:text-[40px] cursor-pointer"
                    >
                        <img
                            src="assets/star.png"
                            alt="Key Icon"
                            className="w-7 h-7 sm:w-[40px] sm:h-[40px] mr-[15px]"
                        />
                        Lycaon
                    </button>
                </section>

                {/* Right Section: Currency, Wallet, Profile */}
                <section className="flex flex-row gap-[14px] items-center">
                    <InGameCurrencyTracker />
                    <SuiWallet />
                    <Link to="/user-profile" aria-label="Go to User Profile">
                        <AccountCircleIcon sx={{ width: 30, height: 30 }} />
                    </Link>
                </section>

                {/* Loading Page */}
                {loading && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
                        {/* Transparent Overlay */}
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="relative text-white flex flex-col justify-center items-center gap-8 px-4">
                            {/* Loading Message */}
                            {!revealedWord && (
                                <h1 className="text-3xl sm:text-5xl font-bold animate-glow text-center leading-snug">
                                    Randomizing <br className="sm:hidden" />{" "}
                                    Puzzle...
                                </h1>
                            )}
                            {/* Countdown Display */}
                            <span
                                className={`text-5xl sm:text-7xl font-extrabold animate-pulse ${
                                    countdown === 1
                                        ? "text-red-400"
                                        : countdown === 2
                                        ? "text-yellow-400"
                                        : "text-green-400"
                                }`}
                            >
                                {revealedWord || countdown}
                            </span>

                            {/* Progress Bar */}
                            <div
                                className="w-full max-w-xs sm:max-w-md h-4 bg-[#6C757D] rounded-full overflow-hidden"
                                dir="rtl"
                            >
                                <div
                                    className="h-full bg-blue-500 transition-all duration-1000"
                                    style={{
                                        width: `${(countdown / 3) * 100}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Already on PuzzlePage Message */}
                {message && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md text-center text-xl sm:text-2xl">
                        {message}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

