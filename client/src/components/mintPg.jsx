import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const MintPg = ({ onClose, sprite, onMint, onSell }) => {
    const [mintStatus, setMintStatus] = useState("idle"); // 'idle' | 'minting' | 'success'
    const [postMintAction, setPostMintAction] = useState("none"); // "none" | "readyToSell" | "confirm"

    const navigate = useNavigate();
    const location = useLocation();

    const handleMint = () => {
        setMintStatus("minting");

        setTimeout(() => {
            setMintStatus("success");
            onMint();
        }, 4000);
    };

    const handleConfirmSell = () => {
        // Do something to confirm the listing
        console.log("Confirmed listing on marketplace!");
        onSell();
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
                        <p className="leading-tight">
                            Confirm to sell this sprite in the marketplace.
                        </p>
                    ) : postMintAction === "confirming" ? (
                        <div className="leading-tight">
                            <p>Listing confirmed.</p>
                            <p>Your sprite is now on the marketplace!</p>
                        </div>
                    ) : (
                        <div className="leading-none">
                            <p>{sprite.name} minted successfully!</p>
                            <p>Do you want to sell it on the marketplace?</p>
                        </div>
                    )
                ) : (
                    <p>
                        {mintStatus === "minting"
                            ? `Minting ${sprite.name}...`
                            : `Mint ${sprite.name} on the blockchain`}
                    </p>
                )}
            </section>

            <button
                disabled={mintStatus === "minting"}
                onClick={() => {
                    if (
                        mintStatus === "success" &&
                        postMintAction === "confirming" &&
                        location.pathname !== "/marketplace"
                    ) {
                        navigate("/marketplace");
                    } else if (mintStatus === "idle") {
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
                className={`w-fit h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] cursor-pointer ${
                    mintStatus === "minting" ||
                    (mintStatus === "success" &&
                        postMintAction === "confirming" &&
                        location.pathname === "/marketplace")
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
                        ? "View Marketplace"
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
        mint: PropTypes.bool.isRequired,
        marketplace: PropTypes.bool.isRequired,
    }).isRequired,
    onMint: PropTypes.func.isRequired,
    onSell: PropTypes.func.isRequired,
};

export default MintPg;

