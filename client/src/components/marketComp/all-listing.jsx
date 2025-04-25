import { useState, useMemo } from "react";

const creaturesList = [
    {
        src: "/assets/sprites/celestial-sprite.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature1",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        stage: "Egg",
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
    {
        src: "/assets/sprites/celestial-sprite.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature3",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        stage: "Adult",
        mint: true,
        marketplace: true,
        price: 1500,
    },
    {
        src: "/assets/star.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature4",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        stage: "Egg",
        mint: true,
        marketplace: true,
        price: 900,
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature5",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        stage: "Adult",
        mint: true,
        marketplace: true,
        price: 2000,
    },
    {
        src: "/assets/star.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature6",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        stage: "Basic",
        mint: true,
        marketplace: true,
        price: 900,
    },
    {
        src: "/assets/star.png",
        still: "/assets/stillSprites/still-slime.svg",
        label: "creature7",
        to: "/collection/spriteDetail",
        rank: "Elite",
        name: "Nemo",
        stage: "Egg",
        mint: true,
        marketplace: true,
        price: 900,
    },
];

const AllListing = () => {
    const [filter, setFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState("asc");

    // const filteredCreatures = creaturesList
    //     .filter((creature) =>
    //         filter === "all" ? true : creature.rank === filter
    //     )
    //     .sort((a, b) =>
    //         sortOrder === "asc" ? a.price - b.price : b.price - a.price
    //     );

    const filteredCreatures = useMemo(() => {
        return creaturesList
            .filter((creature) => filter === "all" || creature.rank === filter)
            .sort((a, b) =>
                sortOrder === "asc" ? a.price - b.price : b.price - a.price
            );
    }, [filter, sortOrder]);

    return (
        <div className="w-[1267px]">
            {creaturesList.length === 0 && (
                <div className="h-[50dvh] flex items-center justify-center text-[50px] text-[#FEFAF3] tracking-[2px]">
                    <h1>No listing on the market yet . . .</h1>
                </div>
            )}

            {creaturesList.length > 0 && (
                <div className="flex flex-col items-start justify-start mt-[10px] gap-[25px] relative">
                    <div className="w-full flex justify-end">
                        <button
                            onClick={() => setShowFilters((prev) => !prev)}
                            className="w-[57px] h-[35px] rounded-[66px] bg-[#FFFFFF] flex items-center justify-center cursor-pointer shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75"
                        >
                            <img
                                src="/assets/icons/filter.svg"
                                alt="filterIcon"
                                className="w-[20px] h-[25px]"
                            />
                        </button>
                    </div>

                    {showFilters && (
                        <div className="absolute top-[45px] right-0 bg-white border border-gray-300 rounded-lg shadow-md p-2 z-10 w-[150px]">
                            <button
                                className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                                onClick={() => {
                                    setFilter("all");
                                    setShowFilters(false);
                                }}
                            >
                                All
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                                onClick={() => {
                                    setFilter("Elite");
                                    setShowFilters(false);
                                }}
                            >
                                Elite
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                                onClick={() => {
                                    setFilter("Littles");
                                    setShowFilters(false);
                                }}
                            >
                                Littles
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                                onClick={() => {
                                    setSortOrder("asc"), setShowFilters(false);
                                }}
                            >
                                Price ↑
                            </button>
                            <button
                                className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                                onClick={() => {
                                    setSortOrder("desc"), setShowFilters(false);
                                }}
                            >
                                Price ↓
                            </button>
                        </div>
                    )}

                    <ul className="w-full flex flex-wrap gap-x-[105px] gap-y-[50px] max-w-max">
                        {filteredCreatures.map((creature) => (
                            <li key={creature.label} className="w-[238px]">
                                <img
                                    src={creature.still}
                                    alt={creature.label}
                                    className="w-full object-contain bg-[#E9E9E9]"
                                />
                                <section className="flex flex-col leading-none gap-[5px] mt-[5px] text-[#FEFAF3]">
                                    <span className="flex flex-row items-center gap-[10px] text-[25px]">
                                        <img
                                            src="/assets/icons/sui-icon-bg.svg"
                                            alt="suiIcon"
                                            className="w-[17px]"
                                        />
                                        {creature.price}
                                    </span>
                                    <span className="text-[20px]">
                                        {creature.stage} {creature.rank}
                                    </span>
                                    <span className="text-[30px] text-wrap">
                                        {creature.name}
                                    </span>
                                    <button className="w-[110px] h-[35px] bg-[#FBBB26] rounded-[66px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#000000] cursor-pointer">
                                        Buy Now
                                    </button>
                                </section>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AllListing;

