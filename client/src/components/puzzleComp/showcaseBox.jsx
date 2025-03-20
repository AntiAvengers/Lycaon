const ShowcaseBox = () => {
    return (
        <div className="w-full h-64 border-2 border-solid p-1">
            <ul
                className="h-full flex flex-row justify-evenly items-center"
                style={{ backgroundColor: "#F2F0EF" }}
            >
                {[
                    { src: "assets/star.png", label: "creature1" },
                    { src: "assets/star.png", label: "creature2" },
                    { src: "assets/star.png", label: "creature3" },
                ].map((creature) => (
                    <li key={creature.label}>
                        <img
                            src="assets/star.png"
                            alt={creature.label}
                            style={{width:"10vw", height:"10vw"}}
                            className="max-w-16 max-h-16 min-w-10 min-h-10 object-contain"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShowcaseBox;

