import { Link } from "react-router-dom";

const ConnectPg = () => {
    return (
        <div className="min-h-screen w-full bg-[#FCF4E7]/10 flex flex-col justify-center items-center px-4 sm:px-6">
            <h1 className="text-[45px] sm:text-[80px] uppercase text-center">Welcom to Lycaon</h1>
            <span className="text-[25px] sm:text-[30px]">Game Requires a Sui Wallet</span>
            <Link to="/home" className="w-[225px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] flex flex-row justify-center items-center">
                <img src="assets/icons/sui-logo.svg" alt="sui-icon" className="w-[25px] h-[25px]"/>
                <span className="text-[25px] text-[#ffffff] pl-[5px]">Connect Sui Wallet</span>
            </Link>
        </div>
    );
};

export default ConnectPg;
