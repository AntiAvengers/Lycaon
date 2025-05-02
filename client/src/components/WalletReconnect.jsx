import { useEffect } from 'react';
import { useConnectWallet, useCurrentWallet } from '@mysten/dapp-kit';

const WalletReconnect = () => {
    const { mutate: connect } = useConnectWallet();
    const { connectionStatus, currentWallet } = useCurrentWallet();

    useEffect(() => {
        const storedWallet = localStorage.getItem('sui'); // or your custom storageKey
        if (connectionStatus === 'disconnected' && storedWallet) {
            try {
                connect();  // Will attempt to reconnect to the last known wallet
            } catch (e) {
                console.error('Failed to reconnect wallet:', e);
            }
        }
        console.log('WalletReconnect:', connectionStatus);
    }, [connectionStatus]);

    return null; // Or conditionally render children
};

export default WalletReconnect;
