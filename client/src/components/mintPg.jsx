import { useState } from "react";
import PropTypes from "prop-types";

const MintPg = ({ onClose, sprite }) => {
    const [price, setPrice] = useState("");
    const [mintStatus, setMintStatus] = useState("idle"); // 'idle' | 'minting' | 'success'
    const [priceError, setPriceError] = useState(false);
    const [postMintAction, setPostMintAction] = useState("none"); // "none" | "readyToSell" | "confirm"

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleMint = () => {
        const priceValue = parseFloat(price);

        if (!price || isNaN(priceValue) || priceValue <= 0) {
            setPriceError(true);
            return;
        }

        setMintStatus("minting");

        setTimeout(() => {
            setMintStatus("success");
        }, 4000);
    };

    const handleConfirmSell = () => {
        // Do something to confirm the listing
        console.log("Confirmed listing on marketplace!");
        // After confirming, you might reset postMintAction or mintStatus depending on your flow
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
                Mint {sprite.name}
            </h1>
            {mintStatus === "success" ? (
                <img
                    src={sprite.still}
                    alt={sprite.name}
                    className="w-[160px] h-[160px]"
                />
            ) : mintStatus === "minting" ? (
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
            ) : (
                <img
                    src={sprite.still}
                    alt={sprite.name}
                    className="w-[160px] h-[160px]"
                />
            )}
            <section className="w-full h-[101px] bg-[#242C53] flex flex-col items-center justify-center text-[#FCF4EF] text-[25px] text-center px-4">
                {mintStatus === "success" ? (
                    postMintAction === "readyToSell" ? (
                        <>
                            <p className="leading-tight">
                                Confirm to sell this sprite in the marketplace.
                            </p>
                        </>
                    ) : postMintAction === "confirming" ? (
                        <>
                            <p className="leading-tight">
                                Listing confirmed. Your sprite is now on the
                                marketplace!
                            </p>
                        </>
                    ) : (
                        <div className="leading-none">
                            <p>{sprite.name} minted successfully!</p>
                            <p>Do you want to sell it on the marketplace?</p>
                        </div>
                    )
                ) : (
                    <>
                        <p>
                            {mintStatus === "minting"
                                ? `Minting ${sprite.name}...`
                                : `Mint ${sprite.name} on the blockchain`}
                        </p>
                        <div className="w-[50%] flex flex-row justify-between items-center mt-2">
                            <p>Total Price</p>
                            <div className="flex flex-row justify-center items-center">
                                <img
                                    src="/assets/icons/sui-icon-bg.svg"
                                    alt="Sui Icon"
                                    className="w-[15px] h-[15px] mr-[5px]"
                                />
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => {
                                        handlePriceChange(e);
                                        if (
                                            e.target.value &&
                                            parseFloat(e.target.value) > 0
                                        ) {
                                            setPriceError(false);
                                        }
                                    }}
                                    placeholder="0.00"
                                    className="no-spinner w-[35px] h-[20px] border-b-[1px] border-white outline-none bg-transparent text-end"
                                />
                            </div>
                        </div>
                        {priceError && (
                            <p className="text-red-400 text-[15px] leading-none mt-1">
                                * Price is required
                            </p>
                        )}
                    </>
                )}
            </section>

            <button
                disabled={
                    (mintStatus !== "idle" && mintStatus !== "success") ||
                    (mintStatus === "success" &&
                        postMintAction === "confirming")
                }
                onClick={() => {
                    if (mintStatus === "idle") {
                        handleMint();
                    } else if (
                        mintStatus === "success" &&
                        postMintAction === "none"
                    ) {
                        setPostMintAction("readyToSell");
                    } else if (
                        mintStatus === "success" &&
                        postMintAction === "readyToSell"
                    ) {
                        handleConfirmSell();
                        setPostMintAction("confirming");
                    }
                }}
                className={`w-fit h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] ${
                    mintStatus === "minting" ||
                    (mintStatus === "success" &&
                        postMintAction === "confirming")
                        ? "bg-gray-400 text-white shadow-none cursor-not-allowed"
                        : "bg-[#FEFAF3] text-[#273472] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                }`}
            >
                {mintStatus === "minting"
                    ? "Minting"
                    : mintStatus === "success"
                    ? postMintAction === "readyToSell"
                        ? "Confirm"
                        : postMintAction === "confirming"
                        ? "Done"
                        : "Sell on marketplace"
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
    }).isRequired,
};

export default MintPg;

