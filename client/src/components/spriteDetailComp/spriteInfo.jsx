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
        if (e.key === "Enter" && e.target.value) {
            const API_BASE_URL =
                import.meta.env.VITE_APP_MODE == "DEVELOPMENT"
                    ? import.meta.env.VITE_DEV_URL
                    : "/";

            const URL = API_BASE_URL + "users/sprites/update_sprite";

            console.log(sprite);
            console.log(sprite.id, e.target.value);

            const request = await fetchWithAuth(
                URL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: sprite.id,
                        nickname: e.target.value,
                    }),
                    credentials: "include", // to include cookies
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
        const REQUEST_URL = API_BASE_URL + "users/sprites/evolve-sprite";

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
    };

    const getEvolveButtonText = (sprite) => {
        if (!sprite) return "";
        if (sprite.evo) return "Evolve";
        if ((sprite.experience ?? 0) >= 28) return "Almost ready!";
        if ((sprite.experience ?? 0) >= 14) return "Making progress!";
        return "Not ready . . .";
    };

    console.log(sprite);

    return (
        <div className="w-[263px] h-[275px] max-h-[275px] leading-none">
            {isEditing ? (
                <input
                    className="w-full text-[50px] h-[50px] bg-transparent border-b border-black/50 focus:outline-none"
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
                    className="w-full text-[50px] cursor-pointer truncate"
                    onDoubleClick={handleDoubleClick}
                >
                    {name}
                    {/* {sprite.name} */}
                </h1>
            )}
            <p className="h-[30px] text-[25px] flex items-center">
                {sprite.personality.length > 0
                    ? sprite.personality.map((trait, index) => (
                          <span key={index}>
                              {trait}
                              {index < sprite.personality.length - 1 && (
                                  <span className="mx-[10px]">&nbsp;</span>
                              )}
                          </span>
                      ))
                    : "No Traits Available"}
            </p>
            <section className="h-[35px] flex flex-row items-center justify-between">
                {sprite.stage === 0 ? (
                    <p className="h-[25px] text-[25px]">{sprite.age}</p>
                ) : (
                    <p className="h-[25px] text-[25px]">Stage {sprite.stage}</p>
                )}
                {/* <p className="h-[25px] text-[25px]">{sprite.age}</p> */}
                {/* Added !sprite.mint because once a sprite is minted, it's locked in? */}
                {sprite.stage !== 2 && (
                    <button
                        className={
                            sprite.evo
                                ? "w-contain h-[35px] bg-[#4A63E4] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] px-[15px] hover:bg-[#1D329F] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#FFFFFF] text-center"
                                : "w-contain h-[35px] bg-[#808080] rounded-[4px] shadow-none px-[15px] text-[25px] text-[#FFFFFF] cursor-not-allowed pointer-events-none text-center"
                        }
                        onClick={() => handleEvolution()}
                    >
                        {getEvolveButtonText(sprite)}
                    </button>
                )}
            </section>
            <hr className="my-[10px] border-t-[1px] border-black/30" />
            <p className="h-[138px] text-wrap overflow-y-auto text-[25px]">
                {sprite.details}
            </p>
        </div>
    );
};

SpritesInfo.propTypes = {
    sprite: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        age: PropTypes.string.isRequired,
        personality: PropTypes.arrayOf(PropTypes.string).isRequired,
        details: PropTypes.string.isRequired,
        evo: PropTypes.bool.isRequired,
        stage: PropTypes.number.isRequired,
        experience: PropTypes.number.isRequired,
    }).isRequired,
};

export default SpritesInfo;

