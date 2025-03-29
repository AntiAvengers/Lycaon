const ShowcaseBox = () => {
    return (
        <div className="w-full h-[253.06px] p-1 bg-[#FCF4E7]/45 border-1 border-[#FCF4E7]">
            <ul className="h-full flex flex-row justify-evenly items-center">
                {[
                    { src: "assets/star.png", label: "creature1" },
                    { src: "assets/star.png", label: "creature2" },
                    { src: "assets/star.png", label: "creature3" },
                ].map((creature) => (
                    <li key={creature.label}>
                        <img
                            src="assets/star.png"
                            alt={creature.label}
                            className="w-[10vw] h-[10vh] max-w-16 max-h-16 min-w-10 min-h-10 object-contain"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShowcaseBox;

