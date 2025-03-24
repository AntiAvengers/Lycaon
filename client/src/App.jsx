import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInPg from "./components/signInPg.jsx";
import HomePg from "./components/homePg.jsx";
import PuzzlePg from "./components/puzzelPg.jsx";
import UserProfilePg from "./components/userProfilePg.jsx";
import SpriteBookPg from "./components/spriteBookPg.jsx";
import SpritesCollectionPg from "./components/spritesCollectionPg.jsx";
import MerchantPg from "./components/merchantPg.jsx";
import MarketPg from "./components/marketPg.jsx";
import NotFoundPg from "./components/NFP.jsx";
import Layout from './components/layout.jsx';

const App = () => {
    return (
        <div id="app" >
            <Router>
                <Routes>
                <Route path="/" element={<Layout><SignInPg /></Layout>} />
                <Route path="/home" element={<Layout><HomePg /></Layout>} />
                <Route path="/puzzles" element={<Layout><PuzzlePg /></Layout>} />
                <Route path="/user-profile" element={<Layout><UserProfilePg /></Layout>} />
                <Route path="/sprite-book" element={<Layout><SpriteBookPg /></Layout>} />
                <Route path="/sprites-collection" element={<Layout><SpritesCollectionPg /></Layout>} />
                <Route path="/merchant" element={<Layout><MerchantPg /></Layout>} />
                <Route path="/market" element={<Layout><MarketPg /></Layout>} />
                <Route path="*" element={<Layout><NotFoundPg /></Layout>} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;

