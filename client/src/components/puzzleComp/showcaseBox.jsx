const ShowcaseBox = () => {
    return (
        <div className="w-full h-[253.06px] p-1 bg-[#FCF4E7]/10 rounded">
            <ul className="h-full flex flex-row justify-evenly items-end pb-[10px]">
                {[
                    { src: "assets/star.png", label: "creature1" },
                    { src: "assets/sprites/slime-sprite.gif", label: "creature2" },
                    { src: "assets/star.png", label: "creature3" },
                ].map((creature) => (
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

