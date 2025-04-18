const foods = [
    { src: "/assets/foods/apple.svg", label: "apple", value: 1, price: 5 },
    { src: "/assets/foods/meat-stick.svg", label: "meat", value: 2, price: 10 },
    { src: "/assets/star.png", label: "pizza", value: 3, price: 25 },
    { src: "/assets/star.png", label: "carrot", value: 4, price: 50 },
];

const PantryPg = () => {
    return (
        <div className="w-[1000px] h-[550px] flex flex-col text-[#FFFFFF]">
            <h1 className="text-start text-[60px]">Pantry</h1>
            <div className="flex-1 flex items-center justify-center">
                <ul className="w-full flex flex-row justify-between">
                    {foods.map((food) => (
                        <li key={food.label} className="flex flex-col gap-2">
                            <section className="w-[200px] h-[200px] bg-[#FFFFFF] rounded-[10px] shadow-md flex justify-center items-center">
                                <img
                                    src={food.src}
                                    alt={food.label}
                                    className="w-[100px] h-[100px]"
                                />
                            </section>
                            <section className="flex flex-col">
                                <span>{food.price} Shards</span>
                                <span>{food.label}</span>{" "}
                            </section>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PantryPg;

