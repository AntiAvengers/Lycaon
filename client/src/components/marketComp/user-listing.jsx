import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MintPg from "../mintPg";
import { getAge } from "../../utils/getAge";

import { database } from '../../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

import SHA256 from 'crypto-js/sha256';

import { fetchWithAuth } from "../../api/fetchWithAuth";
import { useAuth } from "../../context/AuthContext";

import { useCurrentWallet, useSignTransaction } from '@mysten/dapp-kit';

import { getCreatureImage, getCreatureStillImage } from "../../utils/getCreatureAsset";

// const creaturesList = [
//     {
//         src: "/assets/sprites/celestial-sprite.png",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature1",
//         to: "/collection/spriteDetail",
//         rank: "Elite",
//         stage: "Egg",
//         name: "Nemo",
//         mint: false,
//         marketplace: false,
//     },
//     {
//         src: "/assets/sprites/slime-sprite.gif",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature2",
//         to: "/collection/spriteDetail",
//         rank: "Littles",
//         stage: "Basic",
//         name: "Slimey",
//         mint: false,
//         marketplace: false,
//     },
//     {
//         src: "/assets/sprites/celestial-sprite.png",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature3",
//         to: "/collection/spriteDetail",
//         rank: "Elite",
//         stage: "Adult",
//         name: "Nemo",
//         mint: false,
//         marketplace: false,
//     },
//     {
//         src: "/assets/star.png",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature4",
//         to: "/collection/spriteDetail",
//         rank: "Elite",
//         stage: "Egg",
//         name: "Nemo",
//         mint: false,
//         marketplace: false,
//     },
//     {
//         src: "/assets/sprites/slime-sprite.gif",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature5",
//         to: "/collection/spriteDetail",
//         rank: "Elite",
//         stage: "Egg",
//         name: "Nemo",
//         mint: false,
//         marketplace: false,
//     },
//     {
//         src: "/assets/star.png",
//         still: "/assets/stillSprites/still-slime.svg",
//         label: "creature6",
//         to: "/collection/spriteDetail",
//         rank: "Elite",
//         stage: "Egg",
//         name: "Nemo",
//         mint: false,
//         marketplace: false,
//     },
// ];

const UserListing = () => {
    const { currentWallet, connectionStatus } = useCurrentWallet();

    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    const { mutateAsync: signTransaction } = useSignTransaction();

    const [showMint, setShowMint] = useState(false);
    const [sprite, setSprites] = useState([]);
    const [selectedSprite, setSelectedSprite] = useState(null);
    const [cancelPopup, setCancelPopup] = useState(null);
    const [disableButton, setDisableButton] = useState(false);

    useEffect(() => {       
        if(connectionStatus == 'connected') {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const collections_ref = ref(database, `collections/${hash}`);

            const unsubscribe_collections = onValue(collections_ref, (snapshot) => {
                //Initial State of "creatures" is set to [],
                if(!snapshot.val()) return;

                //Otherwise iterate through collection and update creatures state
                const collections = snapshot.val();

                // const updated_likes = [...likedList];
                const updated_creatures = [];
                
                for(const key in collections) {
                    const { date_of_birth, minted_ID, rarity, type, stage, on_marketplace, nickname, can_evolve } = collections[key];

                    const info = {
                        id: key,
                        age: getAge(date_of_birth),
                        name: nickname.length > 0 ? nickname : type,
                        src: getCreatureImage(type, stage),
                        still: getCreatureStillImage(type, stage),
                        label: key, //UUID
                        to: "/collection/spriteDetail",
                        rank: rarity,
                        stage: stage == 0 ? 'Egg' : stage == 1 ? 'Basic?' : 'Adult?',
                        mint: minted_ID,
                        marketplace: on_marketplace,
                        evo: can_evolve
                    }

                    updated_creatures.push(info);
                }
                setSprites(updated_creatures);
            });

            return () => unsubscribe_collections();
        }
    }, [connectionStatus]);

    const handleMintClick = (clickedSprite) => {
        setSelectedSprite(clickedSprite);
        setShowMint(true);
    };

    const closeMint = () => {
        setShowMint(false);
        setSelectedSprite(null);
    };

    const handleMint = async () => {
        const API_BASE_URL = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' 
            ? import.meta.env.VITE_DEV_URL
            : '';
        const REQUEST_URL = API_BASE_URL + "users/sprites/request_mint_tx";
        const mint_tx = await fetchWithAuth(
            REQUEST_URL, 
            { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedSprite.id }),
                credentials: 'include'
            }, 
            accessToken, 
            refreshAccessToken, 
            setAccessToken
        );

        const tx = await mint_tx.json();

        if(tx.error) {
            console.error(tx.error);
            return;
        }

        const { transactionBlock } = tx;

        const { bytes, signature, reportTransactionEffects } = await signTransaction({
            transaction: transactionBlock,
            chain: `sui:${import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' ? 'devnet' : 'testnet'}`,
        });
        
        const EXECUTE_URL = API_BASE_URL + "users/sprites/execute_mint_tx";

        const exec_mint_tx = await fetchWithAuth(
            EXECUTE_URL, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bytes, signature, id: selectedSprite.id }),
                credentials: 'include'
            },
            accessToken, 
            refreshAccessToken, 
            setAccessToken
        );

        const results = await exec_mint_tx.json();
        const { rawEffects } = results.response;

        if(rawEffects) {
            // setMinted(true);
            closeMint();
            reportTransactionEffects(rawEffects);
            return true;
        }

        // setSprites((prev) =>
        //     prev.map((s) =>
        //         s.label === selectedSprite.label ? { ...s, mint: true } : s
        //     )
        // );
        // setSelectedSprite((prev) => ({ ...prev, mint: true }));
    };

    const handleSell = async (asking_price) => {
        console.log('Running handleSell() on spriteDetailPg');
        const API_BASE_URL = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' 
            ? import.meta.env.VITE_DEV_URL
            : '';
        const REQUEST_URL = API_BASE_URL + "marketplace/listings/request_listing_tx";
        const mint_tx = await fetchWithAuth(
            REQUEST_URL, 
            { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedSprite.id, asking_price: asking_price }),
                credentials: 'include'
            }, 
            accessToken, 
            refreshAccessToken, 
            setAccessToken
        );

        const tx = await mint_tx.json();
        console.log(tx);

        if(tx.error) {
            console.error(tx.error);
            return;
        }
    
        const { transactionBlock } = tx;

        const { bytes, signature, reportTransactionEffects } = await signTransaction({
            transaction: transactionBlock,
            chain: `sui:${import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' ? 'devnet' : 'testnet'}`,
        });
        
        const EXECUTE_URL = API_BASE_URL + "marketplace/listings/execute_listing_tx";

        const exec_mint_tx = await fetchWithAuth(
            EXECUTE_URL, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bytes, signature, id: selectedSprite.id, asking_price: asking_price }),
                credentials: 'include'
            },
            accessToken, 
            refreshAccessToken, 
            setAccessToken
        );

        const results = await exec_mint_tx.json();
        const { rawEffects } = results.response;

        if(rawEffects) {
            closeMint();
            console.log('rawEffects True: for handleSell');
            reportTransactionEffects(rawEffects);
            // setMarket(true);
            return true;
        }

        // setSprites((prev) =>
        //     prev.map((s) =>
        //         s.label === selectedSprite.label
        //             ? { ...s, marketplace: true }
        //             : s
        //     )
        // );
        // setSelectedSprite((prev) => ({ ...prev, marketplace: true }));
    };

    // Cancel marketplace listing
    const handleCancelListing = async (label) => {
        try {
            setDisableButton(true);
            const API_BASE_URL = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' 
                ? import.meta.env.VITE_DEV_URL
                : '';
            const REQUEST_URL = API_BASE_URL + "marketplace/listings/request_cancel_tx";
    
            const cancel_tx = await fetchWithAuth(
                REQUEST_URL, 
                { 
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: label }),
                    credentials: 'include'
                }, 
                accessToken, 
                refreshAccessToken, 
                setAccessToken
            );
    
            const tx = await cancel_tx.json();
            console.log(tx);
    
            if(tx.error) {
                console.error(tx.error);
                return;
            }
        
            const { transactionBlock } = tx;
    
            const { bytes, signature, reportTransactionEffects } = await signTransaction({
                transaction: transactionBlock,
                chain: `sui:${import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' ? 'devnet' : 'testnet'}`,
            });
            
            const EXECUTE_URL = API_BASE_URL + "marketplace/listings/execute_cancel_tx";
    
            const exec_cancel_tx = await fetchWithAuth(
                EXECUTE_URL, 
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bytes, signature, id: label }),
                    credentials: 'include'
                },
                accessToken, 
                refreshAccessToken, 
                setAccessToken
            );
    
            const results = await exec_cancel_tx.json();
            const { rawEffects } = results.response;
    
            if(rawEffects) {
                reportTransactionEffects(rawEffects);
                setCancelPopup(null);
                setDisableButton(false);
                return true;
            }
        } catch(err) {
            console.log(err);
            if(err.shape.message.includes("User rejected the request")) {
                setDisableButton(false);
            }
        }

        // setSprites((prev) =>
        //     prev.map((s) =>
        //         s.label === label ? { ...s, marketplace: false } : s
        //     )
        // );

        // // Also update selectedSprite if it's the one being canceled
        // setSelectedSprite((prev) =>
        //     prev && prev.label === label
        //         ? { ...prev, marketplace: false }
        //         : prev
        // );

        // setCancelPopup(null);
    };

    return (
        <div className="w-[1261px] h-[337px] bg-[#FEFAF4] rounded-[10px]">
            {sprite.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center leading-none">
                    <section className="text-center text-[#000000] text-[37px] pb-[20px]">
                        <p>You do not have any sprites!</p>
                        <p>
                            Play some games and earn pages to pull for sprites!
                        </p>
                    </section>
                    <Link
                        to="/puzzle"
                        className="w-[189px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#FFFFFF] cursor-pointer flex items-center justify-center"
                    >
                        Play the puzzle!
                    </Link>
                </div>
            )}
            {sprite.length > 0 && (
                <div className="h-full px-[80px] py-[10px] flex flex-col justify-around">
                    <h1 className="text-[40px]">Your Sprites</h1>
                    <ul className="flex flex-row items-center justify-between">
                        {sprite.slice(0, 3).map((sprite) => (
                            <li
                                key={sprite.label}
                                className="flex flex-row items-center gap-[20px]"
                            >
                                <img
                                    src={sprite.still}
                                    alt={sprite.label}
                                    className="object-contain bg-[#E9E9E9]"
                                />
                                <section className="flex flex-col items-start text-[25px]">
                                    <span>
                                        {sprite.stage} {sprite.rank}
                                    </span>
                                    <span>{sprite.name}</span>
                                    <button
                                        onClick={() => {
                                            if (!sprite.mint) {
                                                handleMintClick(sprite);
                                            } else if (
                                                sprite.mint &&
                                                !sprite.marketplace
                                            ) {
                                                // btnSell(sprite);
                                                handleMintClick(sprite);
                                            }
                                        }}
                                        disabled={sprite.marketplace}
                                        className={`underline cursor-pointer hover:text-[#FBBB26] ${
                                            sprite.marketplace
                                                ? "text-gray-400 pointer-events-none cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {sprite.mint
                                            ? sprite.marketplace
                                                ? "On Marketplace"
                                                : "Sell on Marketplace"
                                            : "Start Minting"}
                                    </button>
                                    {sprite.marketplace && (
                                        <button
                                            onClick={() =>
                                                setCancelPopup(sprite)
                                            }
                                            className="underline cursor-pointer hover:text-[#FBBB26]"
                                        >
                                            Cancel?
                                        </button>
                                    )}
                                </section>
                            </li>
                        ))}
                    </ul>
                    <Link to="/collection" className="underline text-[25px]">
                        View your collection
                    </Link>

                    {cancelPopup && (
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg z-50 w-[331px] h-[434px] flex flex-col items-center justify-center gap-[20px] text-white leading-none">
                            <img
                                src="/assets/icons/closeBtn.svg"
                                alt="closeBtn"
                                onClick={() => setCancelPopup(null)}
                                className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                            />
                            <img
                                src={cancelPopup.still}
                                alt={cancelPopup.label}
                                className="object-contain max-h-[150px]"
                            />
                            <span className="text-[25px]">
                                {cancelPopup.name}
                            </span>
                            <p className="text-[25px] text-center">
                                Would you like to take it off the marketplace?
                            </p>
                            <button
                                onClick={() =>
                                    handleCancelListing(cancelPopup.label)
                                }
                                className={`w-fit h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] bg-[#FEFAF3] text-[#273472] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer
                                    ${disableButton ? "bg-gray-400 text-white shadow-none cursor-not-allowed pointer-events-none" : "bg-[#FEFAF3] text-[#273472] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"}`}
                            >
                                Confirm
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Minting Comp Popup */}
            {showMint && selectedSprite && (
                <div className="fixed inset-0 bg-[#140E28]/60 z-50 flex items-center justify-center">
                    <MintPg
                        onClose={closeMint}
                        sprite={selectedSprite}
                        onMint={handleMint}
                        onSell={handleSell}
                    />
                </div>
            )}
        </div>
    );
};

export default UserListing;

