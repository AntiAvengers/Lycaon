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
                    className="text-[50px] w-full bg-transparent border-b border-black/50 focus:outline-none"
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
    }).isRequired,
};

export default SpritesInfo;

