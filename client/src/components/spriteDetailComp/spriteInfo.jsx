import { useState } from "react";
import PropTypes from "prop-types";

const SpritesInfo = ({ sprite }) => {
    const [name, setName] = useState(sprite.name);
    const [isEditing, setIsEditing] = useState(false);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setName(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setIsEditing(false);
        }
    };

    return (
        <div className="w-[305px] h-[252.5px] leading-none">
            {isEditing ? (
                <input
                    className="text-[50px] w-full h-[50px] bg-transparent border-b border-black/50 focus:outline-none"
                    type="text"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                <h1
                    className="text-[50px] cursor-pointer"
                    onDoubleClick={handleDoubleClick}
                >
                    {name}
                </h1>
            )}
            <p className="text-[25px] pb-[3px]">{sprite.age} days old</p>
            <section className="flex flex-row justify-between">
                <p className="text-[25px]">
                    {sprite.personality.map((trait, index) => (
                        <span key={index}>
                            {trait}
                            {index < sprite.personality.length - 1 && (
                                <span className="mx-2">&nbsp;</span>
                            )}
                        </span>
                    ))}
                </p>
                {sprite.evo && (
                    <button className="w-contain h-[35px] bg-[#4A63E4] px-[15px] hover:bg-[#1D329F] rounded-[4px] shadow-[4px_4px_0_rgba(0,0,0,0.25)] active:bg-[#1D329F] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75 text-[25px] text-[#FFFFFF] text-center">
                        Evolve
                    </button>
                )}
            </section>
            <hr className="my-[15px] border-t-[1px] border-black/30" />
            <p className="text-[25px]">{sprite.details}</p>
        </div>
    );
};

SpritesInfo.propTypes = {
    sprite: PropTypes.shape({
        name: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        personality: PropTypes.arrayOf(PropTypes.string).isRequired,
        details: PropTypes.string.isRequired,
        evo: PropTypes.bool.isRequired,
    }).isRequired,
};

export default SpritesInfo;

