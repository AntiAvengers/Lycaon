// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import PropTypes from "prop-types";

// const MintPg = ({ onClose, sprite, onMint, onSell }) => {
//     const [mintStatus, setMintStatus] = useState("idle"); // 'idle' | 'minting' | 'success'
//     const [postMintAction, setPostMintAction] = useState("none"); // "none" | "readyToSell" | "confirm"
//     const [salePrice, setSalePrice] = useState("");

//     const navigate = useNavigate();
//     const location = useLocation();

//     const handleMint = () => {
//         setMintStatus("minting");

//         setTimeout(() => {
//             setMintStatus("success");
//             onMint();
//         }, 4000);
//     };

//     const handleConfirmSell = () => {
//         // Do something to confirm the listing
//         console.log("Confirmed listing on marketplace!");
//         onSell();
//         // After confirming, you might reset postMintAction or mintStatus depending on your flow
//     };

//     return (
//         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg z-50 w-[331px] h-[434px] flex flex-col items-center justify-evenly">
//             <img
//                 src="/assets/icons/closeBtn.svg"
//                 alt="closeBtn"
//                 onClick={onClose}
//                 className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
//             />
//             <h1 className="text-[35px] text-[#FCF4EF] leading-none">
//                 Mint {sprite.name}
//             </h1>

//             {/* Sprite Image */}
//             {mintStatus === "success" ? (
//                 <img
//                     src={sprite.still}
//                     alt={sprite.name}
//                     className="w-[160px] h-[160px]"
//                 />
//             ) : mintStatus === "minting" ? (
//                 <div className="relative">
//                     <img
//                         src="/assets/bg/minting.gif"
//                         alt="mintingGif"
//                         className="absolute top-0 left-0 z-50"
//                     />
//                     <img
//                         src={sprite.still}
//                         alt={sprite.name}
//                         className="w-[160px] h-[160px] relative"
//                     />
//                 </div>
//             ) : (
//                 <img
//                     src={sprite.still}
//                     alt={sprite.name}
//                     className="w-[160px] h-[160px]"
//                 />
//             )}

//             {/* Text Area */}
//             <section className="w-full h-[101px] bg-[#242C53] flex flex-col items-center justify-center text-[#FCF4EF] text-[25px] text-center px-4">
//                 {mintStatus === "success" ? (
//                     postMintAction === "readyToSell" ? (
//                         <div className="flex flex-col items-center">
//                             <p className="leading-tight">
//                                 Set market price for {sprite.name}!
//                             </p>
//                             <section className="flex flex-row items-center gap-2">
//                                 <label className="text-white">Amount</label>
//                                 <img
//                                     src="/assets/icons/sui-icon-bg.svg"
//                                     alt="Sui Icon"
//                                     className="w-[15px] h-[15px]"
//                                 />
//                                 <input
//                                     type="number"
//                                     min="1"
//                                     value={salePrice}
//                                     onChange={(e) =>
//                                         setSalePrice(e.target.value)
//                                     }
//                                     placeholder="Min 1"
//                                     className="no-spinner w-[50px] h-[25px] border-b-[1px] border-white outline-none bg-transparent text-end text-white"
//                                 />
//                             </section>{" "}
//                             {salePrice !== "" && Number(salePrice) <= 0 && (
//                                 <p className="text-red-400 text-sm mt-1">
//                                     Price must be greater than 0!
//                                 </p>
//                             )}
//                         </div>
//                     ) : postMintAction === "confirming" ? (
//                         <div className="leading-tight">
//                             <p>{sprite.name} is now listed!</p>
//                             <p>View it in the marketplace.</p>
//                         </div>
//                     ) : (
//                         <div className="leading-none">
//                             <p>{sprite.name} minted successfully!</p>
//                             <p>Do you want to sell it on the marketplace?</p>
//                         </div>
//                     )
//                 ) : (
//                     <p>
//                         {mintStatus === "minting"
//                             ? `Minting ${sprite.name}...`
//                             : `Mint ${sprite.name} on the blockchain`}
//                     </p>
//                 )}
//             </section>

//             {/* Action Button */}
//             <button
//                 disabled={
//                     mintStatus === "minting" ||
//                     (postMintAction === "readyToSell" &&
//                         (salePrice === "" || Number(salePrice) <= 0)) ||
//                     (postMintAction === "confirming" &&
//                         location.pathname === "/marketplace")
//                 }
//                 onClick={() => {
//                     if (
//                         mintStatus === "success" &&
//                         postMintAction === "confirming" &&
//                         location.pathname !== "/marketplace"
//                     ) {
//                         navigate("/marketplace");
//                     } else if (mintStatus === "idle") {
//                         handleMint();
//                     } else if (
//                         mintStatus === "success" &&
//                         postMintAction === "none"
//                     ) {
//                         setPostMintAction("readyToSell");
//                     } else if (
//                         mintStatus === "success" &&
//                         postMintAction === "readyToSell"
//                     ) {
//                         handleConfirmSell();
//                         setPostMintAction("confirming");
//                     }
//                 }}
//                 className={`w-fit h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] cursor-pointer ${
//                     mintStatus === "minting" ||
//                     (postMintAction === "readyToSell" && salePrice === "") ||
//                     (postMintAction === "confirming" &&
//                         location.pathname === "/marketplace")
//                         ? "bg-gray-400 text-white shadow-none cursor-not-allowed pointer-events-none"
//                         : "bg-[#FEFAF3] text-[#273472] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
//                 }`}
//             >
//                 {mintStatus === "minting"
//                     ? "Minting"
//                     : mintStatus === "success"
//                     ? postMintAction === "readyToSell"
//                         ? "Confirm"
//                         : postMintAction === "confirming"
//                         ? "View Marketplace"
//                         : "Sell on marketplace"
//                     : "Mint"}
//             </button>
//         </div>
//     );
// };

// MintPg.propTypes = {
//     onClose: PropTypes.func.isRequired,
//     sprite: PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         still: PropTypes.string.isRequired,
//         mint: PropTypes.bool.isRequired,
//         marketplace: PropTypes.bool.isRequired,
//     }).isRequired,
//     onMint: PropTypes.func.isRequired,
//     onSell: PropTypes.func.isRequired,
// };

// export default MintPg;

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const MintPg = ({ onClose, sprite, onMint, onSell, minted, market }) => {
    const [isMinting, setIsMinting] = useState(false);
    const [putOnMarket, setPutOnMarket] = useState(false);
    const [salePrice, setSalePrice] = useState("");
    const [onMarket, setOnMarket] = useState(false);
    const [disableButton, setDisableButton] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleMint = async () => {
        try {
            setDisableButton(true);

            const mint_tx = await onMint();
            console.log(mint_tx);
            if(!mint_tx) return;
            setIsMinting(true);
    
            setTimeout(() => {
                setIsMinting(false);
                setDisableButton(false);
            }, 4000);
        } catch(err) {
            if(err.shape.message.includes("User rejected the request")) {
                setDisableButton(false);
            }
        }
        
        //ORIGINAL
        // setIsMinting(true);

        // setTimeout(() => {
        //     setIsMinting(false);
        //     onMint(); // <-- this updates sprite.mint to true
        // }, 4000);
    };

    const handleConfirmSell = async() => {
        try {
            setDisableButton(true);

            // Handle confirming the sale
            console.log('I just clicked confirm sell at mintPg.jsx');
            const listing_tx = await onSell(salePrice);
            //This is console logging "undefined"....interesting
            console.log(listing_tx);
            if(!listing_tx) return;
            setOnMarket(true);
            setDisableButton(false);
            console.log("Confirmed listing on marketplace!");
        } catch(err) {
            if(err.shape.message.includes("User rejected the request")) {
                setDisableButton(false);
            }
        }
        
    };

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg z-50 w-[331px] h-[434px] flex flex-col items-center justify-evenly">
            <img
                src="/assets/icons/closeBtn.svg"
                alt="closeBtn"
                onClick={onClose}
                className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
            />
            <h1 className="text-[35px] text-[#FCF4EF] leading-none">
                {/* Mint {sprite.name} */}
                {sprite.name}
            </h1>

            {/* Sprite Image */}
            {!isMinting ? (
                <img
                    src={sprite.still}
                    alt={sprite.name}
                    className="w-[160px] h-[160px]"
                />
            ) : (
                <div className="relative">
                    <img
                        src="/assets/bg/minting.gif"
                        alt="mintingGif"
                        className="absolute top-0 left-0 z-50"
                    />
                    <img
                        src={sprite.still}
                        alt={sprite.name}
                        className="w-[160px] h-[160px] relative"
                    />
                </div>
            )}

            {/* Text Area */}
            <section className="w-full h-[101px] bg-[#242C53] flex flex-col items-center justify-center text-[#FCF4EF] text-[25px] text-center px-4">
                {!(minted || sprite.mint) || isMinting ? (
                    <p>
                        {isMinting
                            ? `Minting ${sprite.name}...`
                            : `Mint ${sprite.name} on the blockchain`}
                    </p>
                ) : !(market || sprite.marketplace) ? (
                    putOnMarket ? (
                        <div className="flex flex-col items-center">
                            <p className="leading-tight">
                                Set market price for {sprite.name}!
                            </p>
                            <section className="flex flex-row items-center gap-2">
                                <label className="text-white">Amount</label>
                                <img
                                    src="/assets/icons/sui-icon-bg.svg"
                                    alt="Sui Icon"
                                    className="w-[15px] h-[15px]"
                                />
                                <input
                                    type="number"
                                    min="1"
                                    value={salePrice}
                                    onChange={(e) =>
                                        setSalePrice(e.target.value)
                                    }
                                    placeholder="Min 1"
                                    className="no-spinner w-[50px] h-[25px] border-b-[1px] border-white outline-none bg-transparent text-end text-white"
                                />
                            </section>
                            {salePrice !== "" && Number(salePrice) <= 0 && (
                                <p className="text-red-400 text-sm mt-1">
                                    Price must be greater than 0!
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="leading-none">
                            <p>{sprite.name} minted successfully!</p>
                            <p>Do you want to sell it on the market?</p>
                        </div>
                    )
                ) : (
                    <div className="leading-tight">
                        <p>{sprite.name} is now listed!</p>
                        <p>View it in the market.</p>
                    </div>
                )}
            </section>

            {/* Action Button */}
            <button
                disabled={
                    isMinting ||
                    ((minted || sprite.mint) &&
                        !(market || sprite.marketplace) &&
                        putOnMarket &&
                        (salePrice === "" || Number(salePrice) <= 0 || onMarket))
                }
                onClick={() => {
                    if (
                        !(minted || sprite.mint) &&
                        !(market || sprite.marketplace)
                    ) {
                        handleMint();
                        return;
                    } else if (
                        (minted || sprite.mint) &&
                        !(market || sprite.marketplace) &&
                        !putOnMarket
                    ) {
                        setPutOnMarket(true);
                    } else if (
                        (minted || sprite.mint) &&
                        !(market || sprite.marketplace) &&
                        putOnMarket
                    ) {
                        handleConfirmSell();
                    } else if (
                        (minted || sprite.mint) &&
                        (market || sprite.marketplace) &&
                        location.pathname !== "/market"
                    ) {
                        navigate("/market");
                    }
                }}
                className={`w-fit h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] cursor-pointer ${
                    isMinting || disableButton ||
                    ((minted || sprite.mint) &&
                        !(market || sprite.marketplace) &&
                        putOnMarket &&
                        (salePrice === "" || Number(salePrice) <= 0 || disableButton)) ||
                    (location.pathname == "/market" &&
                        (market || sprite.marketplace))
                        ? "bg-gray-400 text-white shadow-none cursor-not-allowed pointer-events-none"
                        : "bg-[#FEFAF3] text-[#273472] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
                }`}
            >
                {minted || sprite.mint
                    ? market || sprite.marketplace
                        ? "View Market"
                        : putOnMarket
                        ? "Confirm"
                        : "Sell on Market"
                    : isMinting
                    ? "Minting"
                    : "Mint"}
            </button>
        </div>
    );
};

MintPg.propTypes = {
    onClose: PropTypes.func.isRequired,
    sprite: PropTypes.shape({
        name: PropTypes.string.isRequired,
        still: PropTypes.string.isRequired,
        mint: PropTypes.bool.isRequired, // Indicates if sprite is minted
        marketplace: PropTypes.bool.isRequired, // Indicates if sprite is listed for sale
    }).isRequired,
    onMint: PropTypes.func.isRequired,
    onSell: PropTypes.func.isRequired,
    minted: PropTypes.bool,
    market: PropTypes.bool,
};

export default MintPg;

