import PropTypes from "prop-types";

const FoodInventory = ({ foods, onFeed }) => {
    return (
        <ul className="w-[263px] h-[263px] grid grid-cols-2 gap-[25px]">
            {foods.map((food) => (
                <li
                    key={food.label}
                    onClick={() => {
                        if (food.amt > 0) {
                            onFeed(food.value, food.label);
                        }
                    }}
                    className="group bg-[#FFFFFF] rounded-[10px] relative flex items-center justify-center cursor-pointer outline-[5px] outline-transparent transition-all duration-300 hover:outline-[#4A63E4] shadow-md active:inset-shadow-sm active:inset-shadow-[#000000] active:scale-95"
                >
                    <span className="absolute top-0 right-2 text-[25px]">
                        x{food.amt}
                    </span>
                    <img
                        src={food.src}
                        alt={food.label}
                        className="object-contain transform transition duration-300 ease-in-out group-hover:-translate-y-1"
                    />
                </li>
            ))}
        </ul>
    );
};

FoodInventory.propTypes = {
    foods: PropTypes.array.isRequired,
    onFeed: PropTypes.func.isRequired,
};
export default FoodInventory;

