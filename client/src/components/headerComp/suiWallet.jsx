import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

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
              coinType: '0x2::sui::SUI', // This is the SUI coin type
            });

            // balance.totalBalance = MIST (1 SUI = 1 Billion Mist)
            const rounded_down = Math.floor(balance.totalBalance / 1_000_000_000 * 100) / 100;
            const formatted = new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(rounded_down);

            setSuiCoins(formatted)
          } catch (error) {
            console.error("Error fetching SUI balance:", error);
          }
        };
      
        fetchBalance();
      }, [account]);

    return (
        <div className="relative h-[32px] bg-[#E0E6FF] rounded-[39px] text-black">
            <section className="hidden h-full sm:flex sm:flex-row items-center px-[17px] gap-[10px]">
                <img
                    src="/assets/icons/sui-icon-bg.svg"
                    alt="Sui Icon"
                    className="w-[24px] h-[24px]"
                />
                <div className="flex items-center h-[25px]">
                    <h1 className="text-[25px]">{suiCoins}</h1>
                </div>
            </section>
        </div>
    );
};

export default SuiWallet;

