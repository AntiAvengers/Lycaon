const HighscoreBox = () => {
    return (
        <div className="w-full h-[81px] p-1 bg-[url('/assets/bg/leaderboard-border.svg')] bg-cover bg-center flex flex-col justify-between items-center ">
            <h1 className="text-[25px] leading-none m-0 p-0">
                Your High Score
            </h1>
            <span className="text-[50px] leading-none m-0 p-0">Score</span>
        </div>
    );
};

export default HighscoreBox;

