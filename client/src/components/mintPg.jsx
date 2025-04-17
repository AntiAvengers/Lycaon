import { useState } from "react";
import PropTypes from "prop-types";

const MintPg = ({ onClose, sprite }) => {
    const [price, setPrice] = useState("");

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
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
            <img
                src={sprite.still}
                alt={sprite.name}
                className="w-[160px] h-[160px]"
            />
            <section className="w-full h-[101px] bg-[#242C53] flex flex-col items-center justify-center text-[#FCF4EF] text-[25px]">
                <p>Mint {sprite.name} on the blockchain</p>
                <div className="w-[50%] flex flex-row justify-between items-center">
                    <p>Total Price</p>
                    <div className="flex flex-row justify-center items-center">
                        <img
                            src="/assets/icons/sui-icon-bg.svg"
                            alt="Sui Icon"
                            className="w-[15px] h-[15px] mr-[5px]"
                        />
                        <input
                            type="number"
                            value={price}
                            onChange={handlePriceChange}
                            placeholder="0.00"
                            className="no-spinner w-[35px] h-[20px] border-b-[1px] border-white outline-none bg-transparent text-end"
                        />
                    </div>
                </div>
            </section>
            <button className="w-[72px] h-[35px] bg-[#FEFAF3] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#273472] text-center">
                Mint
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

