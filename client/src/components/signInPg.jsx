import { Link } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import WalletIcon from "@mui/icons-material/Wallet";

const SignInPg = () => {
    return (
        <form className="min-h-screen w-full flex justify-center items-center px-4 sm:px-6">
            <section className="min-w-full sm:max-w-md md:max-w-xl sm:min-w-sm flex flex-col justify-evenly items-center p-6 sm:p-8 gap-4 rounded-lg shadow-lg bg-[#F8F9FA]">
                <h1 className="text-center text-4xl sm:text-6xl md:text-5xl font-medium">
                    Suikle
                </h1>
                <Link
                    to="/home"
                    className="w-full flex flex-row justify-center items-center gap-3 bg-[#4285F4] rounded px-4 py-3 text-white hover:shadow-lg active:scale-90 active:shadow-innertransition transform duration-200 cursor-pointer"
                >
                    <GoogleIcon />
                    <button>Continue with Google</button>
                </Link>
                <Link
                    to="/home"
                    className="w-full flex flex-row justify-center items-center gap-3 bg-[#4285F4] rounded px-4 py-3 text-white hover:shadow-lg active:scale-90 active:shadow-innertransition transform duration-200 cursor-pointer"
                >
                    <WalletIcon />
                    <button>Connect Wallet</button>
                </Link>
                <div className="w-full flex items-center my-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <input
                    className="w-full p-3 rounded border-1 border-gray-300 shadow-sm text-[18px] bg-white"
                    type="text"
                    placeholder="E-mail Address"
                />
                <input
                    className="w-full p-3 rounded border-1 border-gray-300 shadow-sm text-[18px] bg-white"
                    type="password"
                    placeholder="Password"
                />
                <Link
                    to="/home"
                    className="px-4 py-3 rounded text-white bg-[#4285F4] hover:shadow-lg active:scale-90 active:shadow-innertransition transform duration-200 cursor-pointer"
                >
                    <button>Sign In</button>
                </Link>
                <p>
                    {"Don't have an account? "}
                    <Link className="text-[#4285F4] hover:underline">
                        Sign-Up
                    </Link>
                </p>{" "}
            </section>
        </form>
    );
};

export default SignInPg;

