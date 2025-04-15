import { useEffect } from "react";


import FoodInventory from "./spriteDetailComp/foodInventory";

const SpritesDetailPg = () => {
    useEffect(() => {
        document.body.classList.add("spriteDetail-bg");
        return () => {
            document.body.classList.remove("spriteDetail-bg")
        }
    }, []);

    return (
        <div className="w-full h-[625px] flex flex-row justify-between items-center">
            <FoodInventory />
            <section>sprite</section>
            <section>Info</section>
        </div>
    );
};

export default SpritesDetailPg;
