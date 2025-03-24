import { Link } from "react-router-dom";

const NFP = () => {
    return (
        <div className="w-full flex flex-col justify-center items-center gap-5">
            <h1 className="text-4xl sm:text-5xl font-bold">
                Congratulations! 🎉
            </h1>
            <p className="text-2xl sm:text-3xl text-center">
                You found a page that doesn’t exist.
            </p>
            <p className="text-2xl sm:text-3xl text-center">
                As a reward, enjoy this exclusive link back to{" "}
                <Link to="/home" className="text-[#EA1A26] hover:underline">
                    safety (a.k.a. home)
                </Link>
                .
            </p>
            <p></p>
        </div>
    );
};

export default NFP;

