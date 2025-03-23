import { Link } from "react-router-dom";

const SignInPg = () => {
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6">
            <h1 className="text-center text-5xl sm:text-7xl md:text-6xl font-bold mb-8">
                Suikle
            </h1>
            <section className="w-full sm:max-w-md md:max-w-xl sm:min-w-sm flex flex-col justify-evenly items-center p-6 sm:p-8 rounded-lg shadow-lg bg-[#FBBB26]">
                <input
                    className="w-full p-3 rounded mb-4 text-[18px] bg-white"
                    type="text"
                    placeholder="E-mail Address"
                />
                <input
                    className="w-full p-3 rounded mb-4 text-[18px] bg-white"
                    type="password"
                    placeholder="Password"
                />
                <Link to="/home" className="w-1/3">
                    <button className="w-full px-4 py-3 rounded font-semibold bg-sky-500 hover:bg-sky-600 hover:shadow-lg active:scale-90 active:shadow-inner transition transform duration-200 cursor-pointer">
                        Sign In
                    </button>
                </Link>
            </section>
        </div>
    );
};

export default SignInPg;

