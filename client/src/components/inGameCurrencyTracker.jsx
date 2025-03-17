const InGameCurrencyTracker = () => {
    return (
        <div>
            <ul className="flex space-x-6">
                <li className="flex items-center">
                    Key
                    <img
                        src="assets/star.png"
                        alt="Key Icon"
                        className="w-6 h-6 ml-2"
                    />
                </li>
                <li className="flex items-center">
                    Pages{" "}
                    <img
                        src="assets/star.png"
                        alt="Pages Icon"
                        className="w-6 h-6 ml-2"
                    />
                </li>
                <li className="flex items-center">
                    Shards{" "}
                    <img
                        src="assets/star.png"
                        alt="Shards Icon"
                        className="w-6 h-6 ml-2"
                    />
                </li>
            </ul>
        </div>
    );
};

export default InGameCurrencyTracker;

