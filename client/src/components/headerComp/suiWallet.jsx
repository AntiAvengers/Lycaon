const SuiWallet = () => {
    return (
        <div className="relative h-[32px] bg-[#E0E6FF] rounded-[39px] text-black">
            <section className="hidden h-full sm:flex sm:flex-row items-center px-[17px] gap-[10px]">
                <img
                    src="/assets/icons/sui-icon-bg.svg"
                    alt="Sui Icon"
                    className="w-[24px] h-[24px]"
                />
                <div className="flex items-center h-[25px]">
                    <h1 className="text-[25px]">1000</h1>
                </div>
            </section>
        </div>
    );
};

export default SuiWallet;

