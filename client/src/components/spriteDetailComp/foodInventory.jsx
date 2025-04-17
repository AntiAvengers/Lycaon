const foodList = [
    { src: "/assets/star.png", label: "apple", amt: 4 },
    { src: "/assets/star.png", label: "meat", amt: 56 },
    { src: "/assets/star.png", label: "pizza", amt: 100 },
    { src: "/assets/star.png", label: "carrot", amt: 10 },
];

const FoodInventory = () => {
    return (
        <ul className="w-[263px] h-[263px] grid grid-cols-2 gap-[25px]">
            {foodList.map((food) => (
                <li
                    key={food.label}
                    className="group bg-[#FFFFFF] rounded-[10px] relative flex items-center justify-center outline-[5px] outline-transparent transition-all duration-300 hover:outline-[#4A63E4] shadow-md active:inset-shadow-sm active:inset-shadow-[#000000] active:scale-95"
                >
                    <span className="absolute top-0 right-2 text-[25px]">
                        x{food.amt}
                    </span>
                    <button className="cursor-pointer">
                        <img
                            src={food.src}
                            alt={food.label}
                            className="object-contain transform transition duration-300 ease-in-out group-hover:-translate-y-1"
                        />
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default FoodInventory;

