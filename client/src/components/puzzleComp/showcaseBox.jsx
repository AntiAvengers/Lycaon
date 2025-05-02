import { useEffect, useState } from 'react';
import { database } from '../../firebase/firebaseConfig';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';

import SHA256 from 'crypto-js/sha256';

import { useConnectWallet, useCurrentWallet, useWallets, useSignPersonalMessage } from '@mysten/dapp-kit';

// const showcase = [
//     {
//         src: "/assets/sprites/celestial-sprite.png",
//         label: "creature1",
//     },
//     {
//         src: "/assets/sprites/slime-sprite.gif",
//         label: "creature2",
//     },
//     {
//         src: "/assets/sprites/celestial-sprite.png",
//         label: "creature3",
//     },
// ];

const showcase = [];

const ShowcaseBox = () => {
    const wallets = useWallets();
	const { mutate: connect } = useConnectWallet();
    const { currentWallet, connectionStatus } = useCurrentWallet();

    useEffect(() => {
        if(connectionStatus == 'connected') {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const collections_ref = ref(database, `collections/${hash}`);
            const q = query(collections_ref, orderByChild('favorite'), equalTo(true));
            const unsubscribe = onValue(q, (snapshot) => {
                if(!snapshot.val()) return;

                const data = snapshot.val();
                console.log(data);
                for(const key in data) {
                    const { type } = data[key];
                    //There's a better way but for now
                    const src = type.toLowerCase() == 'slime' 
                        ? '/assets/sprites/slime-sprite.gif'
                        : '/assets/sprites/celestial-sprite.png'
                    showcase.push({ src: src, label: type });
                }
            });

            return () => unsubscribe();
        }
    }, []);

    return (
        <div className="w-full h-[253.06px] bg-[url('/assets/bg/grassBtmShowcase.svg')] bg-no-repeat bg-contain bg-bottom">
            <ul className="h-full flex flex-row justify-between items-end pb-[8px]">
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

