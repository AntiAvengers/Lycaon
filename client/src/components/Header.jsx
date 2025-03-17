import InGameCurrencyTracker from "./inGameCurrencyTracker.jsx";

const Header = () => {
    return (
        <header className="sticky top-0 w-full bg-white p-4 z-50 flex flex-row justify-between">
            <h1>Suikle</h1>
            <InGameCurrencyTracker />
        </header>
    );
};

export default Header;

