import { Link } from "react-router-dom";

const SignInPg = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-center" style={{ fontSize: "5rem" }}>
                Suikle
            </h1>
            <section 
            style={{backgroundColor:"#FBBB26"}}
            className="h-1/3 flex flex-col justify-evenly items-center p-3 rounded">
                <input
                    className="p-3 rounded"
                    style={{ fontSize: "18px" }}
                    type="text"
                    placeholder="E-mail Address"
                />
                <input
                    className="p-3 rounded"
                    style={{ fontSize: "18px" }}
                    type="password"
                    placeholder="Password"
                />
                <Link to="/home">
                    <button
                        style={{ backgroundColor: "#76D8FF" }}
                        className="px-4 py-2 rounded"
                    >
                        Sign In
                    </button>
                </Link>
            </section>
        </div>
    );
};

export default SignInPg;

