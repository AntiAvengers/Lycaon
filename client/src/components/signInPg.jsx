import { Link } from "react-router-dom";

const SignInPg = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6">
            <h1
                className="text-center sm:text-6xl md:text-7xl font-bold mb-8"
                style={{ fontSize: "5rem" }}
            >
                Suikle
            </h1>
            <section
                style={{ backgroundColor: "#FBBB26" }}
                className="w-full max-w-md md:max-w-xl sm:w-1/3 sm:max-w-lg flex flex-col justify-evenly items-center p-6 sm:p-8 rounded-lg shadow-lg"
            >
                <input
                    className="w-full p-3 rounded mb-4"
                    style={{ fontSize: "18px" }}
                    type="text"
                    placeholder="E-mail Address"
                />
                <input
                    className="w-full p-3 rounded mb-4"
                    style={{ fontSize: "18px" }}
                    type="password"
                    placeholder="Password"
                />
                <Link to="/home" className="w-1/3">
                    <button
                        style={{
                            backgroundColor: "#76D8FF",
                        }}
                        className="w-full px-4 py-3 rounded font-semibold"
                    >
                        Sign In
                    </button>
                </Link>
            </section>
        </div>
    );
};

export default SignInPg;

