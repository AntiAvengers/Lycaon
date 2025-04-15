import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import SignInPg from "./components/signInPg.jsx";
import ConnectPg from "./components/connectPg.jsx";
import HomePg from "./components/homePg.jsx";
import PuzzlePg from "./components/puzzelPg.jsx";
import UserProfilePg from "./components/userProfilePg.jsx";
import FountainPg from "./components/fountainPg.jsx";
import CollectionPg from "./components/collectionPg.jsx";
import PantryPg from "./components/pantryPg.jsx";
import MarketPg from "./components/marketPg.jsx";
import NotFoundPg from "./components/NFP.jsx";
import Layout from './components/layout.jsx';

const App = () => {
    return (
        <div id="app" >
            <Router>
                <Routes>
                <Route path="/" element={<Layout><ConnectPg /></Layout>} />
                <Route path="/home" element={<Layout><HomePg /></Layout>} />
                <Route path="/puzzles" element={<Layout><PuzzlePg /></Layout>} />
                <Route path="/user-profile" element={<Layout><UserProfilePg /></Layout>} />
                <Route path="/fountain" element={<Layout><FountainPg /></Layout>} />
                <Route path="/collection" element={<Layout><CollectionPg /></Layout>} />
                <Route path="/pantry" element={<Layout><PantryPg /></Layout>} />
                <Route path="/market" element={<Layout><MarketPg /></Layout>} />
                <Route path="*" element={<Layout><NotFoundPg /></Layout>} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;

