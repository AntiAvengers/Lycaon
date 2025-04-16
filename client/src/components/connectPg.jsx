import { Link } from "react-router-dom";

const ConnectPg = () => {
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6">
            <h1 className="text-[45px] sm:text-[80px] uppercase text-center">
                Welcome to Lycaon
            </h1>
            <span className="text-[25px] sm:text-[30px]">
                Game Requires a Sui Wallet
            </span>
            <Link
                to="/home"
                className="w-[225px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 flex flex-row justify-center items-center"
            >
                <img
                    src="assets/icons/sui-logo.svg"
                    alt="sui-icon"
                    className="w-[25px] h-[25px]"
                />
                <span className="text-[25px] text-white pl-[5px]">
                    Connect Sui Wallet
                </span>
            </Link>
        </div>
    );
};

export default ConnectPg;

