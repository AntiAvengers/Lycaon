import { useEffect } from "react";

import UserListing from "./marketComp/user-listing";
import FeaturedSprites from "./marketComp/featured-sprites";
import AllListing from "./marketComp/all-listing";

const MarketPg = () => {
    useEffect(() => {
        document.body.classList.add("market-bg");
        return () => {
            document.body.classList.remove("market-bg");
        };
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-start gap-[15px]">
            <section className="w-[1260px] h-[460px] bg-[url('/assets/bg/market-bg.png')] bg-center bg-no-repeat bg-contain px-[68px] text-[#FEFAF3] flex flex-col justify-center items-start">
                <h1 className="text-[80px] leading-none">Market</h1>
                <p className="w-[495px] text-[25px] leading-tight">
                    Step into the marketplace, where rare and radiant sprites
                    gathered by other adventurers shimmer with possibility.
                    Browse and trade to expand your collection with sprites.
                </p>
            </section>
            <UserListing />
            <FeaturedSprites />
            <AllListing />
        </div>
    );
};

export default MarketPg;

