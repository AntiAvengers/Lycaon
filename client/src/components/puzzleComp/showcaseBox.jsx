const showcase = [
    {
        src: "/assets/sprites/celestial-sprite.png",
        label: "creature1",
    },
    {
        src: "/assets/sprites/slime-sprite.gif",
        label: "creature2",
    },
    {
        src: "/assets/sprites/celestial-sprite.png",
        label: "creature3",
    },
];

const ShowcaseBox = () => {
    return (
        <div className="w-full h-[253.06px] bg-[url('/assets/bg/grassBtmShowcase.svg')] bg-no-repeat bg-contain bg-bottom">
            <ul className="h-full flex flex-row justify-between items-end pb-[8px]">
                {showcase.map((creature) => (
                    <li key={creature.label}>
                        <img
                            src={creature.src}
                            alt={creature.label}
                            className="object-contain"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShowcaseBox;

