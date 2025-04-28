import { useState, useEffect, useRef, useCallback } from "react";

const userWallet = { keys: 4, pages: 10, shards: 2000 };

const InGameCurrencyTracker = () => {
    const [open, setOpen] = useState(false); // Opens Menu for Mobile
    const menuRef = useRef(null); // Menu for Mobile

    //Dropdown for mobile
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

    // Close dropdown when clicked outside of menu
    useEffect(() => {
        document.addEventListener("pointerdown", handleOutsideClick);
        return () =>
            document.removeEventListener("pointerdown", handleOutsideClick);
    }, [handleOutsideClick]);

    return (
        <div ref={menuRef} className="relative">
            {/* Dropdown Toggle Button for Mobile */}
            <button
                className="md:hidden flex items-center"
                onClick={handleToggle}
                aria-label="Toggle Currency Tracker"
            >
                <img
                    src="assets/star.png"
                    alt="Currency Icon"
                    className="w-[30px] h-[30px]"
                />
            </button>

            {/* Dropdown Menu Mobile */}
            {open && (
                <ul className="absolute right-0 top-full mt-2 bg-[#273472] text-[#FCF4E7] shadow-lg rounded-lg p-[20px] space-y-2 w-[136px] md:hidden">
                    <li className="flex justify-evenly items-center text-[25px]">
                        {userWallet.keys}
                        <img
                            src="/assets/icons/key.svg"
                            alt="Key Icon"
                            className="w-[25px] h-[25px] ml-2"
                        />
                    </li>
                    <li className="flex justify-evenly items-center text-[25px]">
                        {userWallet.pages}
                        <img
                            src="/assets/icons/scroll.svg"
                            alt="Pages Icon"
                            className="w-[25px] h-[25px] ml-2"
                        />
                    </li>
                    <li className="flex justify-evenly items-center text-[25px]">
                        {userWallet.shards}
                        <img
                            src="/assets/icons/shard.svg"
                            alt="Shards Icon"
                            className="w-[25px] h-[25px] ml-2"
                        />
                    </li>
                    <li className="flex justify-evenly items-center text-[25px]">
                        1000
                        <img
                            src="/assets/icons/sui-logo.svg"
                            alt="Shards Icon"
                            className="w-[25px] h-[25px] ml-2"
                        />
                    </li>
                </ul>
            )}

            {/* Visible List (Desktop & Larger) */}
            <ul className="hidden md:flex space-x-[10px] text-[25px]">
                <li className="flex items-center">
                    {userWallet.keys}
                    <img
                        src="/assets/icons/key.svg"
                        alt="Key Icon"
                        className="w-[25px] h-[25px] ml-[5px]"
                    />
                </li>
                <li className="flex items-center">
                    {userWallet.pages}
                    <img
                        src="/assets/icons/scroll.svg"
                        alt="Pages Icon"
                        className="w-[25px] h-[25px] ml-[5px]"
                    />
                </li>
                <li className="flex items-center">
                    {userWallet.shards}
                    <img
                        src="/assets/icons/shard.svg"
                        alt="Shards Icon"
                        className="w-[25px] h-[25px] ml-[5px]"
                    />
                </li>
            </ul>
        </div>
    );
};

export default InGameCurrencyTracker;

