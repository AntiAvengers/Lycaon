const user = { highscore: 10 };

const HighscoreBox = () => {
    return (
        <div className="w-full h-[81px] pt-[5px] bg-[url('/assets/bg/highscore-border.svg')] bg-cover bg-center flex flex-col justify-between items-center ">
            <h1 className="text-[25px] leading-none m-0 p-0">
                Your High Score
            </h1>
            <span className="text-[50px] leading-none m-0 p-0">
                {user.highscore} Words
            </span>
        </div>
    );
};

export default HighscoreBox;

