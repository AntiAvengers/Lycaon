import { Link } from "react-router-dom";

const SignInPg = () => {
    return (
        <div>
            <h1 style={{ fontSize: '5rem' }}>Suikle</h1>
            <div>
                <Link to="/home">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded">
                        SignIn
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default SignInPg;

