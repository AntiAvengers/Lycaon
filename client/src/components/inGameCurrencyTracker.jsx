import { useState, useEffect, useRef, useCallback } from "react";

const InGameCurrencyTracker = () => {
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
        <div ref={menuRef} className="relative">
            {/* Dropdown Toggle Button on Mobile */}
            <button
                className="md:hidden flex items-center"
                onClick={handleToggle}
                aria-label="Toggle Currency Tracker"
            >
                <img
                    src="assets/star.png"
                    alt="Currency Icon"
                    className="w-6 h-6"
                />
            </button>

            {/* Dropdown Menu (Mobile) */}
            {open && (
                <ul
                    className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg p-4 space-y-2 w-40 md:hidden"
                    style={{ backgroundColor: "#F2F0EF" }}
                >
                    <li className="flex justify-center items-center">
                        Key
                        <img
                            src="assets/star.png"
                            alt="Key Icon"
                            className="w-6 h-6 ml-2"
                        />
                    </li>
                    <li className="flex justify-center items-center">
                        Pages
                        <img
                            src="assets/star.png"
                            alt="Pages Icon"
                            className="w-6 h-6 ml-2"
                        />
                    </li>
                    <li className="flex  justify-center items-center">
                        Shards
                        <img
                            src="assets/star.png"
                            alt="Shards Icon"
                            className="w-6 h-6 ml-2"
                        />
                    </li>
                </ul>
            )}

            {/* Visible List (Desktop & Larger) */}
            <ul className="hidden md:flex space-x-6">
                <li className="flex items-center">
                    Key
                    <img
                        src="assets/star.png"
                        alt="Key Icon"
                        className="w-6 h-6 ml-2"
                    />
                </li>
                <li className="flex items-center">
                    Pages
                    <img
                        src="assets/star.png"
                        alt="Pages Icon"
                        className="w-6 h-6 ml-2"
                    />
                </li>
                <li className="flex items-center">
                    Shards
                    <img
                        src="assets/star.png"
                        alt="Shards Icon"
                        className="w-6 h-6 ml-2"
                    />
                </li>
            </ul>
        </div>
    );
};

export default InGameCurrencyTracker;

