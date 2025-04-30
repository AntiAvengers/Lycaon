import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// import SignInPg from "./components/signInPg.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import ConnectPg from "./components/connectPg.jsx";
import HomePg from "./components/homePg.jsx";
import PuzzlePg from "./components/puzzelPg.jsx";
import FountainPg from "./components/fountainPg.jsx";
import CollectionPg from "./components/collectionPg.jsx";
import SpritesDetailPg from "./components/spriteDetailPg.jsx";
import PantryPg from "./components/pantryPg.jsx";
import MarketPg from "./components/marketPg.jsx";
import NotFoundPg from "./components/NFP.jsx";
import Layout from './components/layout.jsx';

const { networkConfig } = createNetworkConfig({
	localnet: { url: getFullnodeUrl('localnet') },
	testnet: { url: getFullnodeUrl('testnet') },
    devnet: { url: getFullnodeUrl('devnet') },
	mainnet: { url: getFullnodeUrl('mainnet') },
});

const queryClient = new QueryClient();
const NODE = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' ? 'devnet' : 'testnet';

const App = () => {
    return (
        <div id="app" >
            <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork={NODE}>
            <WalletProvider autoConnect={true} storage={localStorage} storageKey="walletStorage">
            <Router>
                <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout><ConnectPg /></Layout>} />
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/home" element={<Layout><HomePg /></Layout>} />
                        <Route path="/puzzle" element={<Layout><PuzzlePg /></Layout>} />
                        <Route path="/fountain" element={<Layout><FountainPg /></Layout>} />
                        <Route path="/collection" element={<Layout><CollectionPg /></Layout>} />
                        <Route path="/collection/spriteDetail" element={<Layout><SpritesDetailPg /></Layout>} />
                        <Route path="/pantry" element={<Layout><PantryPg /></Layout>} />
                        <Route path="/marketplace" element={<Layout><MarketPg /></Layout>} />
                        <Route path="*" element={<Layout><NotFoundPg /></Layout>} />
                    </Route>
                </Routes>
                </AuthProvider>
            </Router>
            </WalletProvider>
            </SuiClientProvider>
            </QueryClientProvider>
        </div>
    );
};

export default App;

