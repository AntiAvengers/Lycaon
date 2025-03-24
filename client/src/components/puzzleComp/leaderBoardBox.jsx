const LeaderboardBox = () => {
    return (
        <div
            className="w-full h-64 bg-[#76D8FF] p-1 flex flex-col items-center"
        >
            <h1 className="text-2xl my-3">Leaderboard</h1>
            <ul className="flex flex-col gap-2">
                {[
                    { name: "Random", score: 10 },
                    { name: "Random2", score: 6 },
                    { name: "Random3", score: 2 },
                ].map((highScorer, index) => (
                    <li key={highScorer.name}>
                        <ul className="flex flex-row gap-20">
                            <div className="flex flex-row gap-4">
                                <li>{index + 1}</li>
                                <li>{highScorer.name}</li>
                            </div>
                            <li>{highScorer.score} Words</li>
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeaderboardBox;

