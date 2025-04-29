const leaderboard = [
    { name: "Max", highscore: 10 },
    { name: "Jason", highscore: 6 },
    { name: "Sammi", highscore: 5 },
    { name: "CC", highscore: 3 },
    { name: "David", highscore: 1 },
];

const LeaderboardBox = () => {
    return (
        <div className="w-full h-[280px] p-1 bg-[url('/assets/bg/leaderboard-border.svg')] bg-cover bg-center flex justify-center items-center ">
            <div className="w-[337.02px] h-[234px] flex flex-col items-center px-[22px] gap-[13px]">
                <h1 className="leading-none m-0 p-0 text-[40px]">
                    Leaderboard
                </h1>
                <ul className="w-[250px] leading-none m-0 p-0 flex flex-col text-[35px]">
                    {leaderboard.map((highScorer, index) => (
                        <li
                            key={highScorer.name}
                            className="flex flex-row justify-between"
                        >
                            <section className="flex flex-row gap-[10px]">
                                <p className="w-[20px]">{index + 1}</p>
                                <p className="w-[100px] truncate">
                                    {highScorer.name}
                                </p>
                            </section>
                            <p>{highScorer.highscore} Words</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LeaderboardBox;

