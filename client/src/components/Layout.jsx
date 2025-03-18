import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "./header.jsx";

const Layout = ({ children }) => {
    const location = useLocation();

    // Check if the current route is the SignIn page
    const isSignInPage = location.pathname === "/";

    return (
        <div>
            {!isSignInPage && <Header />}
            <main>{children}</main>
        </div>
    );
};

// Define prop types
Layout.propTypes = {
    children: PropTypes.node.isRequired, // children should be a React node (JSX, string, etc.)
};

export default Layout;

