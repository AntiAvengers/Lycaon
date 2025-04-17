import PropTypes from "prop-types";

const MintPg = ({ onClose }) => {
    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#273472] rounded-[10px] shadow-lg p-[30px] z-50 w-[331px] h-[434px]">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-black"
            >
                ✕
            </button>
            <h1>Mint this Sprite</h1>
        </div>
    );
};

MintPg.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default MintPg;

