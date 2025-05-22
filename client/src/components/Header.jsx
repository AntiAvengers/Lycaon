import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getAuth, signOut } from "firebase/auth";
import { app, database } from "../firebase/firebaseConfig.js";
import { ref, onValue, set } from "firebase/database";
import SHA256 from "crypto-js/sha256";
import { useCurrentWallet } from "@mysten/dapp-kit";

import { fetchWithAuth } from "../api/fetchWithAuth";
import { useAuth } from "../context/AuthContext";

import InGameCurrencyTracker from "./headerComp/inGameCurrencyTracker.jsx";
import SuiWallet from "./headerComp/suiWallet.jsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";

const audio = {
    menu_click: new Audio('assets/sounds/header_menu_click.mp3'),
    notification: new Audio('assets/sounds/header_notification.mp3')
}

const Header = () => {
    const { currentWallet, connectionStatus } = useCurrentWallet();

    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken, firebaseStatus, authenticate } = useAuth();

    const [open, setOpen] = useState(false); // menu
    const [profile, setProfile] = useState(false); //logout
    const [message, setMessage] = useState(""); //puzzle message
    const [notifications, setNotifications] = useState([]);
    const [profileName, setProfileName] = useState("");

    const [notificationOpen, setNotificationOpen] = useState(false);

    const menuRef1 = useRef(null); //menu
    const menuRef2 = useRef(null); // logout
    const notificationRef = useRef(null); //notification

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        return async () => {
            if(location.pathname !== "/" && accessToken) {
                await authenticate();
            }
        }
    }, [accessToken]);

    //Updates Notification State
    useEffect(() => {
        if (connectionStatus == "connected" && firebaseStatus) {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const notifications_ref = ref(database, `notifications/${hash}`);
            const users_ref = ref(database, `users/${hash}/profile_name`);

            const profile_name_unsubscribe = onValue(users_ref, (snapshot) => {
                if (
                    !snapshot.exists() ||
                    snapshot.val() == undefined ||
                    snapshot.val() == null
                )
                    return;
                setProfileName(snapshot.val());
            });

            const notifications_unsubscribe = onValue(
                notifications_ref,
                (snapshot) => {
                    let notifications = [];
                    if (
                        !snapshot.exists() ||
                        snapshot.val() == undefined ||
                        snapshot.val() == null
                    )
                        return;
                    const data = snapshot.val();
                    for (const key in data) {
                        const { message, read, timestamp } = data[key];
                        notifications.push({
                            id: key,
                            message,
                            read,
                            timestamp,
                        });
                    }
                    notifications.sort((a, b) =>
                        a.timestamp > b.timestamp ? -1 : 1
                    );
                    const shouldPlaySound = notifications.map(obj=>obj.read).filter(bool=>!bool).length > 0 ? true : false;
                    if(shouldPlaySound) {
                        audio.notification.play();
                    }
                    setNotifications(notifications);
                }
            );

            return () => {
                profile_name_unsubscribe();
                notifications_unsubscribe();
            };
        }
    }, [firebaseStatus, connectionStatus]);

    const playMenuSound = (ignoreCurrent = false) => {
        if(ignoreCurrent) {
            audio.menu_click.currentTime = 0;
        }
        audio.menu_click.play();
    }

    const handleNotification = async (id) => {
        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";

        const URL = API_BASE_URL + "users/stats/set-notification-as-read";
        const request = await fetchWithAuth(
            URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: id,
                }),
                credentials: "include", // to include cookies
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );
    };

    const allRead = notifications.every((n) => n.read);

    //Logout
    const logout = async () => {
        //Delete Refresh Token
        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";

        const URL = API_BASE_URL + "auth/logout/";
        await fetch(URL, { method: "POST", credentials: "include" });

        //Logout of Firebase
        const auth = getAuth(app);
        await signOut(auth);
    };

    // Game Logo directory
    const handleHomeClick = () => {
        playMenuSound();
        navigate("/home");
    };

    // Show the Puzzle Popup or navigate to puzzlePg
    const handlePuzzleClick = (e) => {
        e.preventDefault();
        if (location.pathname === "/puzzle") {
            setMessage("You are already on the Puzzle page!");
            setTimeout(() => setMessage(""), 3000);
        } else {
            navigate("/puzzle");
            window.location.reload();
        }
    };

    //Opens Dropdown
    const toggleDropdown = () => {
        playMenuSound();
        setOpen((prev) => !prev);
        console.log("Dropdown menu header clicked");
    };

    // Opens Logout
    const toggleProfile = () => {
        playMenuSound();
        setProfile((prev) => !prev);
        console.log("Dropdown profile header clicked");
    };

    //Opens Nofifications
    const toggleNotificationDropdown = () => {
        playMenuSound();
        setNotificationOpen((prev) => !prev);
    };

    // Memorized function to prevent unnecessary re-creations
    const handleOutsideClick = useCallback((event) => {
        if (menuRef1.current && !menuRef1.current.contains(event.target)) {
            setOpen(false);
        }
        if (menuRef2.current && !menuRef2.current.contains(event.target)) {
            setProfile(false);
        }
        if (
            notificationRef.current &&
            !notificationRef.current.contains(event.target)
        ) {
            setNotificationOpen(false);
        }
    }, []);

    // Close dropdown when clicked outside of menu
    useEffect(() => {
        document.addEventListener("pointerdown", handleOutsideClick);
        return () =>
            document.removeEventListener("pointerdown", handleOutsideClick);
    }, [handleOutsideClick]);

    // Close dropdown on route change
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    //Navigations for Menu1
    const navItems = [
        { to: "/home", label: "Home" },
        { to: "/puzzle", label: "Puzzle", action: handlePuzzleClick },
        { to: "/fountain", label: "Fountain" },
        { to: "/collection", label: "Collection" },
        { to: "/pantry", label: "Pantry" },
        { to: "/market", label: "Market" },
    ];

    return (
        <header className="sticky top-0 z-50 sm:h-[75px] text-[#FCF4E7] flex justify-center items-center">
            <div className="w-[1255px] max-w-full h-[55px] bg-[#273472] sm:rounded-[79px] py-[10px] px-6 sm:px-[40px] flex flex-row justify-between shadow-md/40 mx-0 md:mx-[10px] sm:mx-0">
                {/* Left Section: Menu and Logo */}
                <section className="flex flex-row justify-between items-center gap-4 sm:gap-[30px]">
                    {/* Menu */}
                    <div ref={menuRef1} className="relative">
                        <img
                            src={`/assets/icons/${
                                open ? "closeBtn" : "openBtn"
                            }.svg`}
                            alt="Toggle Menu"
                            className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] cursor-pointer"
                            onClick={toggleDropdown}
                        />
                        {open && (
                            <ul className="absolute w-[136px] sm:w-[255px] h-auto -left-[24px] sm:left-0 mt-[7px] shadow-xl rounded-b-[10px] px-[10px] pt-[10px] pb-[20px] bg-[#273472]">
                                {navItems.map(({ to, label, action }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={
                                            (action || (() => setOpen(false))) && playMenuSound()
                                        }
                                        className="w-[128px] sm:w-[235px] h-[42px] sm:h-[45px] flex items-center pl-[20px] sm:pl-[36px] pr-[10px] py-[10px] rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200"
                                    >
                                        <li className="text-start text-[26px] text-[#FCF4E7]">
                                            {label}
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Logo + Title */}
                    <button
                        onClick={handleHomeClick}
                        className="flex items-center text-[30px] sm:text-[40px] cursor-pointer"
                        style={{
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        <img
                            src="/assets/star.png"
                            alt="Key Icon"
                            className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] mr-[15px]"
                        />
                        Lycaon
                    </button>
                </section>

                {/* Right Section: Currency, Wallet, UserName, Notification, Logout*/}
                <section className="flex flex-row gap-[15px] items-center">
                    <InGameCurrencyTracker />
                    <SuiWallet />
                    {/* Notification */}
                    <section
                        className="relative flex items-center"
                        ref={notificationRef}
                    >
                        <button
                            onClick={toggleNotificationDropdown}
                            className="rounded-[2px] shadow-[-4px_4px_0_#1A265D] cursor-pointer"
                        >
                            {allRead ? (
                                <img
                                    src="/assets/icons/notification.svg"
                                    alt="noMail"
                                    className="w-[35px] h-[35px] rounded-[2px] shadow-xl"
                                />
                            ) : (
                                <img
                                    src="/assets/icons/notification-popup.svg"
                                    alt="mail"
                                    className="w-[35px] h-[35px] rounded-[2px] shadow-xl"
                                />
                            )}
                        </button>

                        {notificationOpen && (
                            <div className="absolute right-0 top-[38px] mt-[7px] w-[350px] max-w-[350px] max-h-[275px] overflow-y-auto bg-[#273472] rounded-b-[10px] shadow-xl z-50 text-[20px] pt-[10px] pb-[20px] px-[10px]">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-[#FCF4E7]">
                                        No notifications
                                    </div>
                                ) : (
                                    notifications.map((n, index) => (
                                        <div
                                            key={n.id}
                                            onMouseEnter={() => {
                                                if (!n.read) {
                                                    handleNotification(n.id);
                                                    setNotifications((prev) =>
                                                        prev.map((notif, i) =>
                                                            i === index
                                                                ? {
                                                                      ...notif,
                                                                      read: true,
                                                                  }
                                                                : notif
                                                        )
                                                    );
                                                }
                                            }}
                                            className={`pr-[36px] pl-[10px] py-[10px] cursor-pointer transition-hover duration-200 text-wrap text-left ${
                                                n.read
                                                    ? "text-[#FCF4E7]"
                                                    : "text-[#EA1A26]"
                                            }`}
                                        >
                                            {n.message}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </section>
                    <div
                        className="rounded-[2px] shadow-[-4px_4px_0_#1A265D] cursor-pointer"
                        ref={menuRef2}
                        onClick={toggleProfile}
                    >
                        <div className="flex flex-row items-center gap-[10px] px-[10px] shadow-xl">
                            {/* UserName when Set */}
                            {profileName && (
                                <span
                                    className="text-[25px] max-w-[125px] truncate"
                                    style={{
                                        textShadow:
                                            "2px 2px 4px rgba(0, 0, 0, 0.5)",
                                    }}
                                >
                                    {profileName}
                                </span>
                            )}
                            {/* Logout */}
                            <div className="relative">
                                <AccountCircleIcon
                                    sx={{ width: 30, height: 30 }}
                                />
                                {profile && (
                                    <div className="absolute right-0 translate-x-[20px] mt-[7px] w-[136px] sm:w-[255px] h-auto shadow-xl rounded-b-[10px] px-[10px] pt-[10px] pb-[20px] bg-[#273472]">
                                        <Link
                                            to="/"
                                            aria-label="Logs Out back to SignIn"
                                            onClick={() => {
                                                setProfile(false);
                                                logout();
                                            }}
                                            className="w-[128px] sm:w-[235px] h-[42px] sm:h-[45px] flex justify-start items-center pr-[20px] sm:pr-[36px] pl-[10px] py-[10px] rounded-[10px] hover:bg-[#1A265D] hover:shadow-[0_-4px_0_0_rgba(0,0,0,0.45)] active:bg-[#131C46] shadow-none transition-hover duration-200 text-[26px] text-[#FCF4E7]"
                                        >
                                            Log Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Already on PuzzlePg Message */}
                {message && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md text-center text-xl sm:text-[30px]">
                        {message}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

