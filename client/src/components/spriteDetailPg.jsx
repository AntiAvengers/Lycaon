import { useEffect } from "react";

import FoodInventory from "./spriteDetailComp/foodInventory";
import SpritesInfo from "./spriteDetailComp/spriteInfo";
import FoodMeter from "./spriteDetailComp/foodMeter";

const SpritesDetailPg = () => {
    useEffect(() => {
        document.body.classList.add("spriteDetail-bg");
        return () => {
            document.body.classList.remove("spriteDetail-bg");
        };
    }, []);

    return (
        <div className="w-full h-[625px] flex flex-row justify-evenly items-center">
            <FoodInventory />
            <section className="w-[496px] h-[543px]  rounded-[10px] p-[15px] relative flex items-end justify-center">
                <FoodMeter hunger={5} />
                <img
                    src="/assets/sprites/slime-sprite.gif"
                    alt="sprite"
                    className="min-w-[50%]"
                />
            </section>
            <SpritesInfo />
        </div>
    );
};

export default SpritesDetailPg;

