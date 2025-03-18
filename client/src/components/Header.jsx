import { useState } from "react";
import { Link } from "react-router-dom";
import InGameCurrencyTracker from "./inGameCurrencyTracker.jsx";
import SuiWallet from "./SuiWallet.jsx";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button } from "@mui/material";

const Header = () => {
    const [open, setOpen] = useState("false");

    const handleClick = () => {
        setOpen((prev) => !prev);
        console.log("Dropdown toggled");
    };

    return (
        <header className="sticky top-0 w-full bg-white py-4 px-6 z-50 flex flex-row justify-between">
            <section className="flex flex-row justify-between items-center">
                <div className="relative">
                    <MenuIcon
                        style={{ marginRight: "16px" }}
                        fontSize="large"
                        className="cursor-pointer"
                        edge="start"
                        onClick={handleClick}
                        aria-label="Open Menu"
                    />
                    {open && (
                        <ul className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg p-4 space-y-2">
                            <li>
                                <Link>
                                    <Button>Random1</Button>
                                </Link>
                            </li>
                            <li>
                                <Link>
                                    <Button>Random2</Button>
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
                <Link
                    to="/home"
                    className="flex flex-row items-center text-3xl font-semibold"
                >
                    <img
                        src="assets/star.png"
                        alt="Key Icon"
                        className="w-8 h-8 mr-3"
                    />
                    Suikle
                </Link>
            </section>
            <section className="w-2/6 flex flex-row justify-between items-center">
                <InGameCurrencyTracker />
                <SuiWallet />
                <Link to="/userProfile" aria-label="Go to User Profile">
                    <AccountCircleIcon fontSize="large" />
                </Link>
            </section>
        </header>
    );
};

export default Header;

