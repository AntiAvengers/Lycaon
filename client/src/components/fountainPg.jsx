import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api/fetchWithAuth";
import { database } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../context/AuthContext';

import SHA256 from 'crypto-js/sha256';

import { useCurrentWallet } from '@mysten/dapp-kit';

// let rates = [
//     { name: "Littles", percentage: 0.52 },
//     { name: "Familiar", percentage: 0.31 },
//     { name: "Noble", percentage: 0.12 },
//     { name: "Elite", percentage: 0.045 },
//     { name: "Mythic", percentage: 0.005 },
// ];

const sprite = {
    name: "Slime",
    rank: "Elite",
    src: "/assets/sprites/slime-sprite.gif",
    still: "/assets/stillSprites/still-slime.svg",
    details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus libero sit amet egestas accumsan. Sed massa sem, convallis et fringilla lacinia, faucibus sed augue.",
};

const FountainPg = () => {
    const [showRate, setShowRate] = useState(false);
    const [pulledSprites, setPulledSprites] = useState([]);
    const [pages, setPages] = useState(-1);
    const [rates, setRates] = useState([]);
    const [showError, setShowError] = useState(false);

    const { currentWallet, connectionStatus } = useCurrentWallet();

    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    //For Rate Btn
    const closeRate = () => setShowRate(false);
    const handleRate = () => setShowRate(true);

    //Popup message for Pull Btns
    const handlePull = async (amount) => {
        const ten_pull = amount == 1 ? false : true;
        const API_BASE_URL = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' 
            ? import.meta.env.VITE_DEV_URL
            : '';
        const URL = API_BASE_URL + "game/fountain/pull";
        const request = await fetchWithAuth(
            URL, 
            { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ ten_pull: ten_pull }),
            }, 
            accessToken, 
            refreshAccessToken, 
            setAccessToken
        );

        const res = await request.json();
        if(res.error) {
            setShowError(true);
            console.log(res.error);
            return;
        }

        const pulls = res.response.map(obj => {
            //Better way once more we have more assets
            const src = obj.type == 'slime' ? '/assets/sprites/slime-sprite.gif' 
                : '/assets/sprites/celestial-sprite.png';

            const still = obj.type == 'slime' ? '/assets/stillSprites/still-slime.svg'
                : '/assets/sprites/celestial-sprite.png';

            const output = {
                id: crypto.randomUUID(),
                name: obj.type,
                rank: obj.rarity,
                src: src,
                still: still,
                details:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus libero sit amet egestas accumsan. Sed massa sem, convallis et fringilla lacinia, faucibus sed augue.",
            }
            return output;
        })

        // const pulls = Array.from({ length: amount }, () => ({
        //     ...sprite,
        //     id: crypto.randomUUID(), // ensure unique key for React
        // }));

        setPulledSprites(pulls);
    };

    //Closes Pull Popup
    const closePullPopup = () => setPulledSprites([]);
    const closeErrorPopup = () => setShowError(false);

    //Setting pull rates from server
    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' 
            ? import.meta.env.VITE_DEV_URL
            : '';
        const URL = API_BASE_URL + "game/fountain/get-pull-rates";
        const response = 
            fetchWithAuth(URL, { method: 'POST' }, accessToken, refreshAccessToken, setAccessToken)
            .then((reponse) => {
                reponse.json().then((data) => {
                    setRates(data.response);
                })
            })
    }, []);

    //Setting number of pages player has
    useEffect(() => {
        if(connectionStatus == 'connected') {
            const address = currentWallet.accounts[0].address;
            const hash = SHA256(address).toString();
            const users_ref = ref(database, `users/${hash}/pages`);
            const unsubscribe = onValue(users_ref, (snapshot) => {
                const num_of_pages = snapshot.val() || -1;
                if(num_of_pages == undefined || num_of_pages == null) {
                    console.error("Internal Error: Pages not displaying properly");
                    return;
                }
                setPages(num_of_pages);
            });

            return () => unsubscribe();
        }
    }, [pages, connectionStatus])

    useEffect(() => {
        document.body.classList.add("fountain-bg");
        return () => {
            document.body.classList.remove("fountain-bg");
        };
    }, []);

    return (
        <div>
            {/* Pull Area */}
            <div className="w-[619px] h-[447px] bg-[#FFFFFF]/60 fixed top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[10px]">
                <section className="h-[390px] flex flex-col items-center justify-evenly">
                    <div className="flex flex-col items-center justify-start">
                        <img
                            src="/assets/icons/scroll.svg"
                            alt="spritePull"
                            className="w-[150px] h-[150px]"
                        />
                        <p className="text-[80px]">{pages >= 0 ? `${pages} Page${pages == 1 ? '': 's'}` : `0 Pages`}</p>
                    </div>

                    {/* Pulling Btns */}
                    <div className="w-[65%] flex flex-row justify-between">
                        <button
                            onClick={() => handlePull(1)}
                            className="w-[174px] h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none text-[25px] text-[#FFFFFF] cursor-pointer"
                        >
                            1 Page
                        </button>
                        <button
                            onClick={() => handlePull(10)}
                            className="w-[174px] h-[35px] rounded-[4px] text-[25px] text-center transition-all duration-75 px-[20px] bg-[#4A63E4] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none text-[25px] text-[#FFFFFF] cursor-pointer"
                        >
                            10 Pages
                        </button>
                    </div>
                </section>

                {/* Rate Detail Popup */}
                <button
                    onClick={handleRate}
                    className="absolute right-[25px] bottom-[10px] underline text-[25px] cursor-pointer"
                >
                    Rate Details
                </button>

                {/* Rate Popup  */}
                {showRate && (
                    <div className="w-[407px] h-[304px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 bg-[#FBBB26] z-50 rounded-[10px] p-[10px] flex flex-col items-center justify-between">
                        <img
                            src="/assets/icons/closeBtn.svg"
                            alt="closeBtn"
                            onClick={closeRate}
                            className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                        />
                        <h1 className="text-[40px]">Sprite Rates</h1>
                        <section className="h-[75%] flex flex-col items-center justify-between text-[25px]">
                            <p>Each sprite rarity have their own rates.</p>
                            <div>
                                {rates.map((rate) => (
                                    <ul
                                        key={rate.name}
                                        className="leading-tight"
                                    >
                                        <li>
                                            {rate.name} = {rate.percentage * 100}%
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* Not Enough Pages Popup */}
            {showError && (
                <div className="w-[331px] h-[434px] max-h-[234px] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 bg-[#FBBB26] z-50 rounded-[10px] p-[20px] flex flex-col items-center">
                    <img
                        src="/assets/icons/closeBtn.svg"
                        alt="closeError"
                        onClick={closeErrorPopup}
                        className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                    />
                    <div className="flex flex-col items-center mt-4">
                        <h2 className="text-[40px] font-bold mt-[30px] mb-[10px] text-center">
                            You don't have enough pages!
                        </h2>
                    </div>
                </div>
            )}

            {/* Pull Popup  */}
            {pulledSprites.length > 0 && (
                <div className="w-[331px] h-[434px] max-h-[434px] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 bg-[#FBBB26] z-50 rounded-[10px] p-[20px] flex flex-col items-center">
                    <img
                        src="/assets/icons/closeBtn.svg"
                        alt="closeBtn"
                        onClick={closePullPopup}
                        className="absolute top-[15px] right-[10px] cursor-pointer w-[40px] h-[40px]"
                    />
                    <h2 className="text-[40px] font-bold mt-[30px] mb-[10px]">
                        You just pulled . . .
                    </h2>
                    {pulledSprites.length === 1 ? (
                        <div className="flex flex-col items-center mt-4">
                            <img
                                src={pulledSprites[0].still}
                                alt={pulledSprites[0].name}
                                className="w-[150px] h-[150px] mb-2"
                            />
                            <p className="text-[35px]">
                                {pulledSprites[0].name}
                            </p>
                            <p className="text-[25px]">
                                {pulledSprites[0].rank}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {pulledSprites.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex flex-col items-center"
                                >
                                    <img
                                        src={s.still}
                                        alt={s.name}
                                        className="w-[80px] h-[80px]"
                                    />
                                    <p className="text-[20px] font-semibold">
                                        {s.name}
                                    </p>
                                    <p className="text-[16px]">{s.rank}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default FountainPg;

