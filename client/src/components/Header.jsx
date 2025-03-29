import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InGameCurrencyTracker from "./headerComp/inGameCurrencyTracker.jsx";
import SuiWallet from "./headerComp/suiWallet.jsx";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button } from "@mui/material";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [revealedWord, setRevealedWord] = useState("");
    const [message, setMessage] = useState("");

    const location = useLocation(); // Track the current route
    const navigate = useNavigate();
    const menuRef = useRef(null); // Reference for the menu

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
            <div className="w-[1255px] max-w-full h-[55px] bg-[#0D1641] sm:rounded-[79px] py-[10px] px-6 sm:px-[40px] flex flex-row justify-between shadow-md mx-0 md:mx-[10px] sm:mx-0">
                {/* Left Section: Menu and Logo */}
                <section className="flex flex-row justify-between items-center gap-4 sm:gap-[30px]">
                    <div ref={menuRef} className="relative">
                        <MenuIcon
                            fontSize="large"
                            className="cursor-pointer"
                            edge="start"
                            onClick={handleClick}
                            aria-label="Open Menu"
                        />
                        {open && (
                            <ul className="absolute left-0 mt-2 shadow-lg rounded-lg p-4 space-y-2 bg-[#F2F0EF]">
                                {[
                                    {
                                        to: "/puzzles",
                                        label: "Puzzles",
                                        action: handlePuzzleClick,
                                    },
                                    {
                                        to: "/sprite-book",
                                        label: "Sprite Book",
                                    },
                                    {
                                        to: "/sprites-collection",
                                        label: "Sprites Collection",
                                    },
                                    { to: "/merchant", label: "Merchant" },
                                    { to: "/market", label: "Market" },
                                ].map((item) => (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            onClick={
                                                item.action ||
                                                (() => setOpen(false))
                                            }
                                        >
                                            <Button
                                                className="w-[200px] !text-[#140e02]"
                                                aria-label={`Navigate to ${item.label}`}
                                            >
                                                {item.label}
                                            </Button>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Link
                        to="/home"
                        className="flex flex-row items-center text-2xl sm:text-[24px] font-semibold"
                    >
                        <img
                            src="assets/star.png"
                            alt="Key Icon"
                            className="w-7 h-7 sm:w-[40px] sm:h-[40px] mr-[15px]"
                        />
                        Lycaon
                    </Link>
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

