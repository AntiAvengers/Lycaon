import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import InGameCurrencyTracker from "./headerComp/inGameCurrencyTracker.jsx";
import SuiWallet from "./headerComp/suiWallet.jsx";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button } from "@mui/material";

const Header = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation(); // Track the current route
    const menuRef = useRef(null); // Reference for the menu

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
            <section className="flex flex-row justify-between items-center">
                <div ref={menuRef} className="relative">
                    <MenuIcon
                        style={{ marginRight: "16px" }}
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
                                { to: "/puzzles", label: "Puzzles" },
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
                                        onClick={() => setOpen(false)}
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
            <section style={{width:"38%"}} className="max-w-md flex flex-row justify-between items-center">
                <InGameCurrencyTracker />
                <SuiWallet />
                <Link to="/user-profile" aria-label="Go to User Profile">
                    <AccountCircleIcon fontSize="large" />
                </Link>
            </section>
        </header>
    );
};

export default Header;

