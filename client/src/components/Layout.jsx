import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "./Header.jsx";
import SoundControl from "./soundControl.jsx";
// import Footer from "./footer.jsx";

const Layout = ({ children }) => {
    const location = useLocation();

    const isSignInPage = location.pathname === "/";
    const isPuzzlePage = location.pathname === "/puzzle";

    return (
        <div className="min-h-screen flex flex-col">
            {!isSignInPage && <Header />}
            <main className="flex flex-grow justify-center items-center">
                {children}
            </main>
            <div className="hidden md:block sticky bottom-0">
                {!isSignInPage && !isPuzzlePage && <SoundControl />}
            </div>
            {/* {!isSignInPage && <Footer />} */}
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;

