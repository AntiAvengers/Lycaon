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
            <section className="w-[1261px] h-[460px] bg-[#FFFFFF] leading-none px-[100px] pt-[100px]">
                <h1 className="text-[80px]">Market</h1>
                <p className="w-[495px] text-[25px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    maximus libero sit amet egestas accumsan. Sed massa sem,
                    convallis et fringilla lacinia, faucibus sed augue.
                </p>
            </section>
            <UserListing />
            <FeaturedSprites />
            <AllListing />
        </div>
    );
};

export default MarketPg;

