import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";

const SuiWallet = () => {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();

    const [suiCoins, setSuiCoins] = useState(-1);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!account?.address) return;

            try {
                const balance = await suiClient.getBalance({
                    owner: account.address,
                    coinType: "0x2::sui::SUI", // This is the SUI coin type
                });

                // balance.totalBalance = MIST (1 SUI = 1 Billion Mist)
                const rounded_down =
                    Math.floor((balance.totalBalance / 1_000_000_000) * 100) /
                    100;
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(rounded_down);

                setSuiCoins(formatted);
            } catch (error) {
                console.error("Error fetching SUI balance:", error);
            }
        };

        fetchBalance();

        const interval = setInterval(async () => {
            await fetchBalance();
        }, 1000);

        return () => clearInterval(interval);
    }, [account]);

    return (
        <div className="relative w-fit h-[32px] flex flex-row items-center gap-[10px] text-[#FEFAF3]">
            <section className="flex items-center h-[25px]">
                <h1
                    className="text-[25px]"
                    style={{
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    {suiCoins}
                </h1>
            </section>
            <img
                src="/assets/icons/sui-icon-bg.svg"
                alt="Sui Icon"
                className="w-[24px] h-[24px] drop-shadow-md/25"
            />
        </div>
    );
};

export default SuiWallet;

