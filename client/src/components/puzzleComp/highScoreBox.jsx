const HighscoreBox = () => {
    return (
        <div
            className="w-full h-36 border-2 border-solid p-1 flex flex-col justify-center items-center gap-2"
            style={{ backgroundColor: "#F2F0EF" }}
        >
            <h1 className="text-2xl">Your High Score</h1>
            <span className="text-5xl font-semibold">Score</span>
        </div>
    );
};

export default HighscoreBox;

