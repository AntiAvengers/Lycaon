import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InGameCurrencyTracker from "./headerComp/inGameCurrencyTracker.jsx";
import SuiWallet from "./headerComp/suiWallet.jsx";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button } from "@mui/material";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
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
            setShowPopup(true);
        }
    };

    // Confirm navigation to the Puzzle Page
    const confirmNavigation = () => {
        setShowPopup(false);
        navigate("/puzzles");
    };

    // Close the Popup
    const closePopup = () => {
        setShowPopup(false);
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
        <header className="sticky top-0 w-full bg-white py-4 px-6 z-50 flex flex-row justify-between shadow-md">
            {/* Left Section: Menu and Logo */}
            <section className="flex flex-row justify-center gap-4 items-center">
                <div ref={menuRef} className="relative">
                    <MenuIcon
                        fontSize="large"
                        className="cursor-pointer"
                        edge="start"
                        onClick={handleClick}
                        aria-label="Open Menu"
                    />
                    {open && (
                        <ul
                            className="absolute left-0 mt-2 shadow-lg rounded-lg p-4 space-y-2"
                            style={{ backgroundColor: "#F2F0EF" }}
                        >
                            {[
                                {
                                    to: "/puzzles",
                                    label: "Puzzles",
                                    action: handlePuzzleClick,
                                },
                                { to: "/sprite-book", label: "Sprite Book" },
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
                                            style={{
                                                width: "200px",
                                                color: "#140e28",
                                            }}
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
                    className="flex flex-row items-center text-2xl sm:text-3xl font-semibold"
                >
                    <img
                        src="assets/star.png"
                        alt="Key Icon"
                        className="w-7 h-7 sm:w-8 sm:h-8 mr-3"
                    />
                    Suikle
                </Link>
            </section>

            {/* Right Section: Currency, Wallet, Profile */}
            <section
                className="max-w-md flex flex-row justify-center gap-4 items-center"
            >
                <InGameCurrencyTracker />
                <SuiWallet />
                <Link to="/user-profile" aria-label="Go to User Profile">
                    <AccountCircleIcon fontSize="large" />
                </Link>
            </section>

            {/* Popup for Puzzle Link Confirmation */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
                        <h2 className="text-xl font-semibold mb-4">
                            Are you sure you want to start the puzzle?
                        </h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 text-xl sm:text-base">
                            <button
                                onClick={confirmNavigation}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Yes, Start Puzzle
                            </button>
                            <button
                                onClick={closePopup}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                No, Stay Here
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Already on PuzzlePage Message */}
            {message && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm">
                    {message}
                </div>
            )}
        </header>
    );
};

export default Header;

