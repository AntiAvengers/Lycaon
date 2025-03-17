import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInPg from "./components/signInPg.jsx";
import HomePg from "./components/homePg.jsx";
import PuzzelPg from "./components/puzzelPg.jsx";
import NotFoundPg from "./components/NFP.jsx";
import Layout from './components/Layout.jsx';

const App = () => {
    return (
        <div id="app" >
            <Router>
                <Routes>
                <Route path="/" element={<Layout><SignInPg /></Layout>} />
                <Route path="/home" element={<Layout><HomePg /></Layout>} />
                <Route path="/puzzles" element={<Layout><PuzzelPg /></Layout>} />
                <Route path="*" element={<NotFoundPg />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;

