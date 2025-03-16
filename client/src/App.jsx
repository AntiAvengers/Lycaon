import { useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInPg from "./components/signInPg.jsx";
import HomePg from "./components/homePg.jsx";
import PuzzelPg from "./components/puzzelPg.jsx";
import NotFoundPg from "./components/NFP.jsx";

const App = () => {
    return (
        <div id="app">
            <Router>
                <Routes>
                    <Route path="/" element={<HomePg />} />
                    <Route path="/home" element={<HomePg />} />
                    <Route path="/signIn" element={<SignInPg />} />
                    <Route path="/puzzles" element={<PuzzelPg />} />
                    <Route path="*" element={<NotFoundPg />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;

