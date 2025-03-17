import { Link } from "react-router-dom";
import InGameCurrencyTracker from "./inGameCurrencyTracker.jsx";
import SuiWallet from "./SuiWallet.jsx";

const Header = () => {
    return (
        <header className="sticky top-0 w-full bg-white p-4 z-50 flex flex-row justify-between">
            <h1>Suikle</h1>
            <section className="w-2/6 flex flex-row justify-between items-center">
                <InGameCurrencyTracker />
                <SuiWallet />
                <Link to="/userProfile" className="w-8 h-8">
                    <img
                        src="assets/userProfile.png"
                        alt="User Profile Icon"
                        className="w-full h-full"
                    />
                </Link>
            </section>
        </header>
    );
};

export default Header;

