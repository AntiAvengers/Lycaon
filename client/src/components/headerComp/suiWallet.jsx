import { useState, useEffect, useRef, useCallback } from "react";
import PaidIcon from "@mui/icons-material/Paid";

const SuiWallet = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null); // Reference for the menu

    const handleToggle = () => {
        setOpen((prev) => !prev);
        console.log("Dropdown in-game currency clicked");
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

    return (
        <div
            ref={menuRef}
            className="relative sm:h-[32px] sm:bg-[#E0E6FF] sm:rounded-[39px] sm:text-black"
        >
            {/* Display Text on Larger Screens */}
            <section className="hidden h-full sm:flex sm:flex-row items-center px-[17px] gap-[10px]">
                <img
                    src="assets/icons/Sui.png"
                    alt="Key Icon"
                    className="w-[25px] h-[25px]"
                />
                <div className="flex items-center h-[25px]">
                    <h1 className="text-[21px]">1000 SUI</h1>
                </div>
            </section>

            {/* Button for Mobile */}
            <button
                className="sm:hidden"
                onClick={handleToggle}
                aria-label="Toggle SUI Wallet"
            >
                <PaidIcon sx={{ width: 24, height: 24 }} />
            </button>

            {open && (
                <section className="absolute right-0 top-full mt-2 bg-[#F2F0EF] shadow-lg rounded-lg p-4 w-34 sm:hidden text-black flex items-center gap-[10px]">
                    <img
                        src="assets/star.png"
                        alt="Key Icon"
                        className="w-[25px] h-[25px]"
                    />
                    <h1>1000 SUI</h1>
                </section>
            )}
        </div>
    );
};

export default SuiWallet;

