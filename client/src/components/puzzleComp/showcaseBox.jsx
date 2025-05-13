import { useEffect, useState } from 'react';
import { database } from '../../firebase/firebaseConfig';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';

import SHA256 from 'crypto-js/sha256';

import { useConnectWallet, useCurrentWallet, useWallets, useSignPersonalMessage } from '@mysten/dapp-kit';

import { getCreatureImage, getCreatureStillImage } from "../../utils/getCreatureAsset";

const ShowcaseBox = () => {
    const wallets = useWallets();
	const { mutate: connect } = useConnectWallet();
    const { currentWallet, connectionStatus } = useCurrentWallet();

    const [showcase, setShowcase] = useState([]);

    useEffect(() => {
        const array = [];
        if(connectionStatus == 'connected') {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const collections_ref = ref(database, `collections/${hash}`);
            const q = query(collections_ref, orderByChild('favorite'), equalTo(true));
            const unsubscribe = onValue(q, (snapshot) => {
                if(!snapshot.val()) return;

                const data = snapshot.val();
                for(const key in data) {
                    const { type, stage } = data[key];
                    array.push({ src: getCreatureImage(type, stage), label: type });
                }
                setShowcase(array);
            });

            return () => unsubscribe();
        }
    }, [connectionStatus]);

    return (
        <div className="w-full h-[253px] bg-[url('/assets/bg/grassBtmShowcase.svg')] bg-no-repeat bg-contain bg-bottom">
            <ul className="h-full flex flex-row justify-evenly items-end pb-[8px]">
                {showcase.length > 0 && showcase.map((creature) => (
                    <li key={creature.label}>
                        <img
                            src={creature.src}
                            alt={creature.label}
                            className="object-contain"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShowcaseBox;

