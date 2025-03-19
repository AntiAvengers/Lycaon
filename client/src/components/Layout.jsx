import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "./header.jsx";
import Footer from "./footer.jsx";

const Layout = ({ children }) => {
    const location = useLocation();

    // Check if the current route is the SignIn page
    const isSignInPage = location.pathname === "/";

    return (
        <div className="min-h-screen flex flex-col">
            {!isSignInPage && <Header />}
            <main className="flex flex-grow">{children}</main>
            {!isSignInPage && <Footer />}
        </div>
    );
};

// Define prop types
Layout.propTypes = {
    children: PropTypes.node.isRequired, // children should be a React node (JSX, string, etc.)
};

export default Layout;

