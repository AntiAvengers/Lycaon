import PropTypes from "prop-types";

const FoodInventory = ({ foods, onFeed, disabled }) => {
    return (
        <ul className="w-[263px] h-[263px] grid grid-cols-2 gap-[25px]">
            {foods.map((food) => (
                <li
                    key={food.label}
                    disabled={disabled}
                    onClick={() => {
                        if (food.amt > 0) {
                            onFeed(food.label);
                        }
                    }}
                    // onClick={() => {
                    //     if (!disabled && food.amt > 0) {
                    //         onFeed(food.label);
                    //     }
                    // }}
                    className={`group bg-[#FFFFFF] rounded-[10px] relative flex items-center justify-center outline-[1px] outline-[#CFCFCF] shadow-[4px_4px_0_#CFCFCF]
                        transition-all duration-300 ${
                            // disabled || food.amt === 0
                            food.amt > 0
                                ? "cursor-pointer hover:outline-[#FBBB26] hover:outline-[3px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[-4px_-4px_0_#FBBB26] active:inset-shadow-sm active:inset-shadow-[#000000] active:scale-95"
                                : "cursor-not-allowed opacity-50"
                        }`}
                >
                    <span className="absolute top-0 right-2 text-[25px]">
                        x{food.amt}
                    </span>
                    <img
                        src={food.src}
                        alt={food.label}
                        className={`w-[84px] object-contain transform transition duration-300 ease-in-out ${
                            food.amt > 0 ? "hover:-translate-y-1" : ""
                        }`}
                    />
                </li>
            ))}
        </ul>
    );
};

FoodInventory.propTypes = {
    foods: PropTypes.array.isRequired,
    onFeed: PropTypes.func.isRequired,
    // disabled: PropTypes.bool,
};
export default FoodInventory;

