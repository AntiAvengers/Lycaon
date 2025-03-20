const ShowcaseBox = () => {
    return (
        <div className="w-full h-32 border-2 border-solid p-1">
            <ul className="h-full" style={{ backgroundColor: "#F2F0EF" }}>
                {[
                    { src: "assets/star.png", label: "creature1" },
                    { src: "assets/star.png", label: "creature2" },
                    { src: "assets/star.png", label: "creature3" },
                ].map((creature) => (
                    <li key={creature.label}>
                        <img
                            src="assets/star.png"
                            alt="Creature Pic"
                            className="w-7 h-7 sm:w-8 sm:h-8 mr-3"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShowcaseBox;

