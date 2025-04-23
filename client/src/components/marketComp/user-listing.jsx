import { Link } from "react-router-dom";

const creaturesList = [
    // {
    //     src: "/assets/sprites/celestial-sprite.png",
    //     still: "/assets/stillSprites/still-slime.svg",
    //     label: "creature1",
    //     to: "/collection/spriteDetail",
    //     rank: "Elite",
    //     name: "Nemo",
    // },
    // {
    //     src: "/assets/sprites/slime-sprite.gif",
    //     still: "/assets/stillSprites/still-slime.svg",
    //     label: "creature2",
    //     to: "/collection/spriteDetail",
    //     rank: "Littles",
    //     name: "Slimey",
    // },
    // {
    //     src: "/assets/sprites/celestial-sprite.png",
    //     still: "/assets/stillSprites/still-slime.svg",
    //     label: "creature3",
    //     to: "/collection/spriteDetail",
    //     rank: "Elite",
    //     name: "Nemo",
    // },
    // {
    //     src: "/assets/star.png",
    //     still: "/assets/stillSprites/still-slime.svg",
    //     label: "creature4",
    //     to: "/collection/spriteDetail",
    //     rank: "Elite",
    //     name: "Nemo",
    // },
    // {
    //     src: "/assets/sprites/slime-sprite.gif",
    //     still: "/assets/stillSprites/still-slime.svg",
    //     label: "creature5",
    //     to: "/collection/spriteDetail",
    //     rank: "Elite",
    //     name: "Nemo",
    // },
    // {
    //     src: "/assets/star.png",
    //     still: "/assets/stillSprites/still-slime.svg",
    //     label: "creature6",
    //     to: "/collection/spriteDetail",
    //     rank: "Elite",
    //     name: "Nemo",
    // },
];

const UserListing = () => {
    return (
        <div className="w-[1261px] h-[337px] bg-[#FEFAF4] rounded-[10px]">
            {creaturesList.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center leading-none">
                    <section className="text-center text-[#000000] text-[37px] pb-[20px]">
                        <p>You do not have any sprites!</p>
                        <p>
                            Play some games and earn pages to pull for sprites!
                        </p>
                    </section>
                    <Link
                        to="/puzzle"
                        className="w-[189px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#FFFFFF] cursor-pointer flex items-center justify-center"
                    >
                        Play the puzzle!
                    </Link>
                </div>
            )}
            {creaturesList.length > 0 && (
                <>
                    <h1>Your Sprites</h1>
                </>
            )}
        </div>
    );
};

export default UserListing;

