const LeaderboardBox = () => {
    return (
        <div className="w-full h-[280px] p-1 bg-[#FCF4E7]/45 border-1 border-[#FCF4E7] flex justify-center items-center">
            <div className="w-[337.02px] h-[234px] flex flex-col items-center px-[22px] gap-[13px]">
                <h1 className="text-[21px]">Leaderboard</h1>
                <ul className="w-[250px] flex flex-col gap-[10px] text-[18px]">
                    {[
                        { name: "Random", score: 10 },
                        { name: "Random2", score: 6 },
                        { name: "Random3", score: 2 },
                    ].map((highScorer, index) => (
                        <li key={highScorer.name}>
                            <ul className="flex flex-row justify-between">
                                <li className="w-[117px] flex flex-row items-start gap-[19px]">
                                    <p>{index + 1}</p>
                                    <p className="w-[84px]">
                                        {highScorer.name}
                                    </p>
                                </li>
                                <li className="w-[90px] flex flex-row justify-between text-[35px]">
                                    <p className="w-[25px] text-center">
                                        {highScorer.score}
                                    </p>
                                    <p>Words</p>
                                </li>
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LeaderboardBox;

