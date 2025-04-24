const featuredSprites = [
    {
        src: "/assets/sprites/celestial-sprite.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature1",
        to: "/collection/spriteDetail",
        rank: "Elite",
        stage: "Egg",
        name: "Alexanders Maximillian Theodore",
        mint: true,
        marketplace: true,
        price: 900,
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature2",
        to: "/collection/spriteDetail",
        rank: "Littles",
        name: "Slimey",
        stage: "Basic",
        mint: true,
        marketplace: true,
        price: 1000,
    },
];

const FeaturedSprites = () => {
    return (
        <div className="w-full h-[421px] bg-[#4A63E4] flex justify-center items-center">
            {featuredSprites.length === 0 && (
                <div className="text-[50px] text-[#FEFAF3] tracking-[2px]">
                    <h1>Sorry no featured sprites available . . .</h1>
                </div>
            )}

            {featuredSprites.length > 0 && (
                <ul className="w-[1182px] h-[322px] flex flex-row items-center justify-between">
                    {featuredSprites.slice(0, 2).map((feature) => (
                        <li
                            key={feature.label}
                            className="w-[581px] flex flex-row items-center gap-[20px]"
                        >
                            <img
                                src={feature.still}
                                alt={feature.label}
                                className="w-[322px] object-contain bg-[#E9E9E9]"
                            />
                            <section className="w-[239px] flex flex-col justify-start gap-[5px] leading-none">
                                <span className="text-[25px]">
                                    {feature.stage} {feature.rank}
                                </span>
                                <span className="text-[50px] text-wrap">
                                    {feature.name}
                                </span>
                                <span className="flex flex-row items-center gap-[10px] text-[40px]">
                                    <img
                                        src="/assets/icons/sui-icon-bg.svg"
                                        alt="suiIcon"
                                        className="w-[29px]"
                                    />
                                    {feature.price}
                                </span>
                                <button className="w-[110px] h-[35px] bg-[#FBBB26] rounded-[66px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] cursor-pointer">
                                    Buy Now
                                </button>
                            </section>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FeaturedSprites;

