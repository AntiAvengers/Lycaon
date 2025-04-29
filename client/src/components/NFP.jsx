import { Link } from "react-router-dom";

//Not Found Page
const NFP = () => {
    return (
        <div className="w-[80vw] h-[80vh] flex flex-col justify-center items-center gap-5 bg-[#FCF4E7] rounded-[50px]">
            <h1 className="text-[50px] sm:text-[75px] leading-none m-0 p-0 font-bold">
                Congratulations! 🎉
            </h1>
            <p className="text-[30px] sm:text-[45px] leading-none m-0 p-0 text-center">
                You found a page that doesn’t exist.
            </p>
            <p className="text-[30px] sm:text-[45px] leading-none m-0 p-0 text-center">
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

