const LeaderboardBox = () => {
    return (
        <div className="w-full h-[280px] p-1 bg-[url('/assets/bg/leaderboard-border.svg')] bg-cover bg-center flex justify-center items-center ">
            <div className="w-[337.02px] h-[234px] flex flex-col items-center px-[22px] gap-[13px]">
                <h1 className="leading-none m-0 p-0 text-[40px]">Leaderboard</h1>
                <ul className="w-[250px] leading-none m-0 p-0 flex flex-col text-[35px]">
                    {[
                        { name: "Random", score: 10 },
                        { name: "Random2", score: 6 },
                        { name: "Random3", score: 5 },
                        { name: "Random4", score: 3 },
                        { name: "Random5", score: 1 },
                    ].map((highScorer, index) => (
                        <li key={highScorer.name}>
                            <ul className="flex flex-row justify-between">
                                <li className="w-[117px] flex flex-row items-start gap-[19px]">
                                    <p>{index + 1}</p>
                                    <p className="w-[84px]">
                                        {highScorer.name}
                                    </p>
                                </li>
                                <li className="w-[90px] flex flex-row justify-between">
                                    <p className="text-center">
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

