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
            <section className="w-[343px] h-[409px] bg-[#FEFAF3]/65 rounded-[10px] py-[20px] flex flex-col justify-around items-center">
                <SpritesInfo />
                <button className="w-[189px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#FFFFFF] text-center">
                    Mint Sprite
                </button>
            </section>
        </div>
    );
};

export default SpritesDetailPg;

