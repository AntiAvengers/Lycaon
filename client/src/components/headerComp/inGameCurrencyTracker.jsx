import { useState, useEffect, useRef, useCallback } from "react";
import { database } from "../../firebase/firebaseConfig";
import { ref, onValue } from "firebase/database";

import SHA256 from "crypto-js/sha256";

import { useCurrentWallet } from "@mysten/dapp-kit";
import { useAuth } from "../../context/AuthContext";

const InGameCurrencyTracker = () => {
    const { currentWallet, connectionStatus } = useCurrentWallet();

    //Access Token (JWT)
    const { accessToken, authenticate, firebaseStatus } = useAuth();

    const [open, setOpen] = useState(false); // Opens Menu for Mobile
    const menuRef = useRef(null); // Menu for Mobile

    //Currencies
    const [keys, setKeys] = useState(-1);
    const [pages, setPages] = useState(-1);
    const [shards, setShards] = useState(-1);

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

    useEffect(() => {
        return async () => {
            if(location.pathname !== "/" && accessToken) {
                await authenticate();
            }
        }
    }, [accessToken]);

    //Listening for changes in any of the currencies (Shards, Keys, Pages)
    useEffect(() => {
        if (connectionStatus == "connected" && firebaseStatus) {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const keys_ref = ref(database, `users/${hash}/keys`);
            const pages_ref = ref(database, `users/${hash}/pages`);
            const shards_ref = ref(database, `users/${hash}/shards`);

            const unsubscribe_keys = onValue(keys_ref, (snapshot) => {
                const num_of_keys = snapshot.val() || 0;
                if (num_of_keys == undefined || num_of_keys == null) {
                    console.error(
                        "Internal Error: Keys not displaying properly"
                    );
                    return;
                }
                setKeys(num_of_keys);
            });
            const unsubscribe_pages = onValue(pages_ref, (snapshot) => {
                const num_of_pages = snapshot.val() || 0;
                if (num_of_pages == undefined || num_of_pages == null) {
                    console.error(
                        "Internal Error: pages not displaying properly"
                    );
                    return;
                }
                setPages(num_of_pages);
            });
            const unsubscribe_shards = onValue(shards_ref, (snapshot) => {
                const num_of_shards = snapshot.val() || 0;
                if (num_of_shards == undefined || num_of_shards == null) {
                    console.error(
                        "Internal Error: shards not displaying properly"
                    );
                    return;
                }
                setShards(num_of_shards);
            });

            return () => {
                unsubscribe_keys();
                unsubscribe_pages();
                unsubscribe_shards();
            };
        }
    }, [firebaseStatus, connectionStatus]);
    // }, [location.pathname, connectionStatus]);

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
                        {keys !== -1 ? keys : "?"}
                        <img
                            src="/assets/icons/key.svg"
                            alt="Key Icon"
                            className="w-[25px] h-[25px] ml-2"
                        />
                    </li>
                    <li className="flex justify-evenly items-center text-[25px]">
                        {pages !== -1 ? pages : "?"}
                        <img
                            src="/assets/icons/scroll.svg"
                            alt="Pages Icon"
                            className="w-[25px] h-[25px] ml-2"
                        />
                    </li>
                    <li className="flex justify-evenly items-center text-[25px]">
                        {shards !== -1 ? shards : "?"}
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
            <ul
                className="hidden md:flex gap-[15px] text-[25px]"
                style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                }}
            >
                <li className="flex items-center">
                    {keys !== -1 ? keys : "?"}
                    <img
                        src="/assets/icons/key.svg"
                        alt="Key Icon"
                        className="w-[25px] h-[25px] ml-[5px] drop-shadow-md/25"
                    />
                </li>
                <li className="flex items-center">
                    {pages !== -1 ? pages : "?"}
                    <img
                        src="/assets/icons/scroll.svg"
                        alt="Pages Icon"
                        className="w-[25px] h-[25px] ml-[5px] drop-shadow-md/25"
                    />
                </li>
                <li className="flex items-center">
                    {shards !== -1 ? shards : "?"}
                    <img
                        src="/assets/icons/shard.svg"
                        alt="Shards Icon"
                        className="w-[25px] h-[25px] ml-[5px]  drop-shadow-md/25"
                    />
                </li>
            </ul>
        </div>
    );
};

export default InGameCurrencyTracker;

