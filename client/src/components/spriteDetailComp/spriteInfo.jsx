import { useState } from "react";
import PropTypes from "prop-types";
import { fetchWithAuth } from "../../api/fetchWithAuth";
import { useAuth } from "../../context/AuthContext";

const SpritesInfo = ({ sprite }) => {
    const [name, setName] = useState(sprite.name);
    const [isEditing, setIsEditing] = useState(false);
    const [disableButton, setDisableButton] = useState(false);

    //Access Token (JWT)
    const { accessToken, refreshAccessToken, setAccessToken } = useAuth();

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = async (e) => {
        setName(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            const API_BASE_URL = import.meta.env.VITE_APP_MODE == 'DEVELOPMENT' 
            ? import.meta.env.VITE_DEV_URL
            : '/';

            const URL = API_BASE_URL + "users/sprites/update_sprite";

            console.log(sprite);
            console.log(sprite.id, e.target.value);

            const request = await fetchWithAuth(
                URL,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: sprite.id, nickname: e.target.value }),
                    credentials: 'include', // to include cookies
                },
                accessToken,
                refreshAccessToken,
                setAccessToken
            );

            const res = await request.json();
            setIsEditing(false);
        }
    };

    const handleEvolution = async () => {
        const API_BASE_URL =
                import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                    ? import.meta.env.VITE_DEV_URL
                    : "/";
        const REQUEST_URL =
            API_BASE_URL + "users/sprites/evolve-sprite";

        const buy_tx = await fetchWithAuth(
            REQUEST_URL,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: sprite.id,
                }),
                credentials: "include",
            },
            accessToken,
            refreshAccessToken,
            setAccessToken
        );

        const tx = await buy_tx.json();
    }

    return (
        <div className="w-[305px] pr-[20px] leading-none">
            {isEditing ? (
                <input
                    className="w-[287px] text-[50px] h-[50px] bg-transparent border-b border-black/50 focus:outline-none"
                    type="text"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    maxLength={30}
                    autoFocus
                />
            ) : (
                <h1
                    className="w-[287px] text-[50px] cursor-pointer truncate"
                    onDoubleClick={handleDoubleClick}
                >
                    {name}
                    {/* {sprite.name} */}
                </h1>
            )}
            <p className="text-[25px] pb-[3px]">{sprite.age}</p>
            <section className="flex flex-row justify-between">
                <p className="text-[25px] mt-1">
                    {sprite.personality.length > 0 ? sprite.personality.map((trait, index) => (
                        <span key={index}>
                            {trait}
                            {index < sprite.personality.length - 1 && (
                                <span className="mx-2">&nbsp;</span>
                            )}
                        </span>
                    )) : "No Traits Available"}
                </p>
                {/* Added !sprite.mint because once a sprite is minted, it's locked in? */}
                {sprite.stage !== 2 && <button className={
                    sprite.evo
                        ? "w-contain h-[35px] bg-[#4A63E4] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] px-[15px] hover:bg-[#1D329F] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#FFFFFF] text-center"
                        : "w-contain h-[35px] bg-[#808080] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] px-[15px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#000000] text-white shadow-none cursor-not-allowed pointer-events-none text-center"
                }
                    onClick={() => handleEvolution()}
                >
                    Evolve
                </button>}
            </section>
            <hr className="my-[15px] border-t-[1px] border-black/30" />
            <p className="text-[25px]">{sprite.details}</p>
        </div>
    );
};

SpritesInfo.propTypes = {
    sprite: PropTypes.shape({
        name: PropTypes.string.isRequired,
        age: PropTypes.string.isRequired,
        personality: PropTypes.arrayOf(PropTypes.string).isRequired,
        details: PropTypes.string.isRequired,
        evo: PropTypes.bool.isRequired,
    }).isRequired,
};

export default SpritesInfo;

