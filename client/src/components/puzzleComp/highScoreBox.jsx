import { useEffect, useState } from 'react';
import { database } from '../../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

import SHA256 from 'crypto-js/sha256';

import { useConnectWallet, useCurrentWallet, useWallets, useSignPersonalMessage } from '@mysten/dapp-kit';

// const user = { highscore: -1 };

const HighscoreBox = () => {
        const wallets = useWallets();
        const { mutate: connect } = useConnectWallet();
        const { currentWallet, connectionStatus } = useCurrentWallet();

        const [highscore, setHighScore] = useState(-1);
    
        useEffect(() => {
            if(connectionStatus == 'connected') {
                const address = currentWallet.accounts[0].address;
                const hash = SHA256(address).toString();
                const users_ref = ref(database, `users/${hash}/highest_score/word_puzzle`);
                const unsubscribe = onValue(users_ref, (snapshot) => {
                    if(!snapshot.val()) return;
                    const score = snapshot.val();
                    setHighScore(score);
                });
    
                return () => unsubscribe();
            }
        }, []);

    return (
        <div className="w-full h-[81px] pt-[5px] bg-[url('/assets/bg/highscore-border.svg')] bg-cover bg-center flex flex-col justify-between items-center ">
            <h1 className="text-[25px] leading-none m-0 p-0">
                Your High Score
            </h1>
            <span className="text-[50px] leading-none m-0 p-0">
                {highscore} Words
            </span>
        </div>
    );
};

export default HighscoreBox;

