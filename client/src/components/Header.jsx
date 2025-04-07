import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InGameCurrencyTracker from "./headerComp/inGameCurrencyTracker.jsx";
import SuiWallet from "./headerComp/suiWallet.jsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const menuRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/home");
        window.location.reload();
    };

    // Show the confirmation popup or message
    const handlePuzzleClick = (e) => {
        e.preventDefault();
        if (location.pathname === "/puzzles") {
            setMessage("You are already on the Puzzles page!");
            setTimeout(() => setMessage(""), 3000);
        } else {
            navigate("/puzzles");
        }
    };

    const toggleDropdown = () => {
        setOpen((prev) => !prev);
        console.log("Dropdown menu header clicked");
    };

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

    // Close dropdown on route change
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    const navItems = [
        { to: "/home", label: "Home" },
        { to: "/puzzles", label: "Puzzles", action: handlePuzzleClick },
        { to: "/fountain", label: "Fountain" },
        { to: "/collection", label: "Collection" },
        { to: "/trove", label: "Trove" },
        { to: "/market", label: "Market" },
    ];

    return (
        <header className="sticky top-0 z-50 sm:h-[75px] text-[#FCF4E7] flex justify-center items-center">
            <div className="w-[1255px] max-w-full h-[55px] bg-[#273472] sm:rounded-[79px] py-[10px] px-6 sm:px-[40px] flex flex-row justify-between shadow-md mx-0 md:mx-[10px] sm:mx-0">
                {/* Left Section: Menu and Logo */}
                <section className="flex flex-row justify-between items-center gap-4 sm:gap-[30px]">
                    <div ref={menuRef} className="relative">
                        <img
                            src={`assets/icons/${
                                open ? "closeBtn" : "openBtn"
                            }.svg`}
                            alt="Toggle Menu"
                            className="w-[40px] h-[40px] cursor-pointer"
                            onClick={toggleDropdown}
                        />
                        {open && (
                            <ul className="absolute w-[136px] sm:w-[255px] h-auto -left-[24px] sm:left-0 mt-[7px] shadow-xl rounded-b-[10px] px-[10px] pt-[10px] pb-[20px] bg-[#273472]">
                                {navItems.map(({ to, label, action }) => (
                                    <li
                                        key={to}
                                        className="w-[128px] sm:w-[235px] h-[42px] sm:h-[45px] flex items-center pl-[20px] sm:pl-[36px] pr-[10px] py-[10px] rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:shadow-none transition-hover duration-200"
                                    >
                                        <Link
                                            to={to}
                                            className="text-start text-[26px] text-[#FCF4E7]"
                                            onClick={
                                                action || (() => setOpen(false))
                                            }
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button
                        onClick={handleHomeClick}
                        className="flex items-center text-[24px] sm:text-[40px] cursor-pointer"
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
                <section className="flex flex-row gap-[9px] sm:gap-[14px] items-center">
                    <InGameCurrencyTracker />
                    <SuiWallet />
                    <Link to="/user-profile" aria-label="Go to User Profile">
                        <AccountCircleIcon sx={{ width: 30, height: 30 }} />
                    </Link>
                </section>

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

