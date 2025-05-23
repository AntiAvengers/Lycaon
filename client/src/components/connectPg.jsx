import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    useConnectWallet,
    useCurrentWallet,
    useWallets,
    useSignPersonalMessage,
} from "@mysten/dapp-kit";

import { useAuth } from "../context/AuthContext";
import AboutPg from "../aboutPg";

const audio = {
    menu_click: new Audio('assets/sounds/header_menu_click.mp3'),
}

const ConnectPg = () => {
    //React Navigation to different pages of our app
    const navigate = useNavigate();

    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    //Sui Requirements
    const wallets = useWallets();
    const { mutate: connect } = useConnectWallet();
    const { currentWallet, connectionStatus } = useCurrentWallet();
    const { mutate: signPersonalMessage } = useSignPersonalMessage();

    //Changes the title of the web page to "Lycaon"
    useEffect(() => {
        document.title = "Lycaon";
    }, []);

    const Handle_Login = async (event) => {
        audio.menu_click.play();
        const API_BASE_URL =
            import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                ? import.meta.env.VITE_DEV_URL
                : "/";
        const response = await fetch(API_BASE_URL + `auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                address: currentWallet.accounts[0].address,
            }),
            credentials: "include", // to include cookies
        });
        const { UUID } = await response.json();
        const message_to_sign =
            "Please sign the following randomly generated message to confirm your wallet ownership\n\n" +
            UUID;

        signPersonalMessage(
            { message: new TextEncoder().encode(message_to_sign) },
            {
                onSuccess: async (result) => {
                    const loginResponse = await fetch(
                        API_BASE_URL + "auth/login/verify_signature",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                address: currentWallet.accounts[0].address,
                                bytes: result.bytes,
                                message: message_to_sign,
                                UUID: UUID,
                                signature: result.signature,
                            }),
                            credentials: "include", // to include cookies
                        }
                    );

                    //😅 Did you know .json() is an async function and thats why it requires await? because I didn't ...
                    // console.log(await loginResponse.json());

                    const { accessToken } = await loginResponse.json();
                    setAccessToken(accessToken);

                    if (loginResponse.status == 200) {
                        navigate("/home");
                    }
                },
                onError: (err) => console.log(err),
            }
        );
    };

    const Sui_Connect_Wallet = async (wallet) => {
        audio.menu_click.play();
        if (!currentWallet) {
            connect(
                { wallet },
                { onSuccess: console.log("Connected Sui Wallet!") }
            );
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center">
            {/* Sigin Area */}
            <section className="relative w-full h-[95vh] bg-[#ECECEC] flex items-center justify-center">
                <div className="h-[65%] w-[1440px] flex flex-col items-center justify-between">
                    <video
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        src="/assets/landing/connect-video.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    <h1 className="text-[80px] uppercase text-center z-10">
                        Welcome to Lycaon
                    </h1>
                    <section className="flex flex-col items-center justify center gap-[20px] z-10">
                        <span className="text-[25px] sm:text-[30px]">
                            Game Requires the Slush desktop Chrome Extension
                        </span>
                        {connectionStatus === "connected" ||
                        connectionStatus === "connecting" ? (
                            <Link
                                // to={"/home"}
                                state={{ from: "/" }}
                                className="w-[225px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 flex flex-row justify-center items-center"
                                onClick={Handle_Login}
                            >
                                <img
                                    src="assets/icons/sui-logo.svg"
                                    alt="sui-icon"
                                    className="w-[25px] h-[25px]"
                                />
                                <span className="text-[25px] text-[#FFFFFF] pl-[5px]">
                                    Login
                                </span>
                            </Link>
                        ) : (
                            <ul>
                                {wallets.length > 0 &&
                                wallets
                                    .map((wallet) => wallet.name.toLowerCase())
                                    .includes("slush") ? (
                                    wallets.map((wallet) => (
                                        <li key={wallet.name}>
                                            <Link
                                                // to={"/home"}
                                                state={{ from: "/" }}
                                                className="w-[225px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 flex flex-row justify-center items-center"
                                                onClick={() =>
                                                    Sui_Connect_Wallet(wallet)
                                                }
                                            >
                                                <img
                                                    src="assets/icons/sui-logo.svg"
                                                    alt="sui-icon"
                                                    className="w-[25px] h-[25px]"
                                                />
                                                <span className="text-[25px] text-[#FFFFFF] pl-[5px]">
                                                    Connect Sui Wallet
                                                </span>
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <a
                                        href="https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-[225px] h-[35px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 flex flex-row justify-center items-center"
                                    >
                                        <img
                                            src="assets/icons/sui-logo.svg"
                                            alt="sui-icon"
                                            className="w-[25px] h-[25px]"
                                        />
                                        <span className="text-[25px] text-[#FFFFFF] pl-[5px]">
                                            Get Slush Extension
                                        </span>
                                    </a>
                                )}
                            </ul>
                        )}
                    </section>
                </div>
                <div className="absolute bottom-[5px] text-[20px] text-[#000000] text-center">
                    Please note: This application does not utilize real SUI
                    tokens and operates solely on the SUI testnet environment.
                    All transactions and assets are for testing purposes only
                    and hold no real-world value.
                </div>
            </section>
            {/* About Description - Photos of Game */}
            <AboutPg />
        </div>
    );
};

export default ConnectPg;

