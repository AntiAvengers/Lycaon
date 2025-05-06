import { useState, useEffect, useRef, useCallback } from "react";
import { database } from '../../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

import SHA256 from 'crypto-js/sha256';

import { useCurrentWallet } from '@mysten/dapp-kit';

// const userWallet = { keys: 4, pages: 10, shards: 2000 };

const InGameCurrencyTracker = () => {
    const { currentWallet, connectionStatus } = useCurrentWallet();

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

    //Listening for changes in any of the currencies (Shards, Keys, Pages)
    useEffect(() => {
        if(connectionStatus == 'connected') {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const keys_ref = ref(database, `users/${hash}/keys`);
            const pages_ref = ref(database, `users/${hash}/pages`);
            const shards_ref = ref(database, `users/${hash}/shards`);

            const unsubscribe_keys = onValue(keys_ref, (snapshot) => {
                const num_of_keys = snapshot.val() || 0;
                if(num_of_keys == undefined || num_of_keys == null) {
                    console.error("Internal Error: Keys not displaying properly");
                    return;
                }
                setKeys(num_of_keys)
            });
            const unsubscribe_pages = onValue(pages_ref, (snapshot) => {
                const num_of_pages = snapshot.val() || 0;
                if(num_of_pages == undefined || num_of_pages == null) {
                    console.error("Internal Error: pages not displaying properly");
                    return;
                }
                setPages(num_of_pages)
            });
            const unsubscribe_shards = onValue(shards_ref, (snapshot) => {
                const num_of_shards = snapshot.val() || 0;
                if(num_of_shards == undefined || num_of_shards == null) {
                    console.error("Internal Error: shards not displaying properly");
                    return;
                }
                setShards(num_of_shards)
            });

            return () => {
                unsubscribe_keys();
                unsubscribe_pages();
                unsubscribe_shards();
            }
        }
    }, [connectionStatus])

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
                        {/* {userWallet.keys} */}
                        {keys !== -1 ? keys : '?'}
                        <img
                            src="/assets/icons/key.svg"
                            alt="Key Icon"
                            className="w-[25px] h-[25px] ml-2"
                        />
                    </li>
                    <li className="flex justify-evenly items-center text-[25px]">
                        {pages !== -1 ? pages : '?'}
                        {/* {userWallet.pages} */}
                        <img
                            src="/assets/icons/scroll.svg"
                            alt="Pages Icon"
                            className="w-[25px] h-[25px] ml-2"
                        />
                    </li>
                    <li className="flex justify-evenly items-center text-[25px]">
                        {shards !== -1 ? shards : '?'}
                        {/* {userWallet.shards} */}
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
                    {/* {userWallet.keys} */}
                    {keys !== -1 ? keys : '?'}
                    <img
                        src="/assets/icons/key.svg"
                        alt="Key Icon"
                        className="w-[25px] h-[25px] ml-[5px]"
                    />
                </li>
                <li className="flex items-center">
                    {/* {userWallet.pages} */}
                    {pages !== -1 ? pages : '?'}
                    <img
                        src="/assets/icons/scroll.svg"
                        alt="Pages Icon"
                        className="w-[25px] h-[25px] ml-[5px]"
                    />
                </li>
                <li className="flex items-center">
                    {/* {userWallet.shards} */}
                    {shards !== -1 ? shards : '?'}
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

