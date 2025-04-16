import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const sprite = {
    name: "Sprite",
    age: 5,
    personality: ["Happy", "Adventurous"],
    details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus libero sit amet egestas accumsan. Sed massa sem, convallis et fringilla lacinia, faucibus sed augue. ",
};

const SpritesInfo = () => {
    const [liked, setLiked] = useState(false);

    const handleLiked = () => {
        setLiked((prev) => !prev);
    };

    return (
        <div className="w-[343px] h-[409px] bg-[#FEFAF3]/65 rounded-[10px]">
            {/* {sprite.map((sprite) => )} */}
            <button
                onClick={() => handleLiked()}
                aria-label="favorite"
                className="cursor-pointer"
            >
                {liked ? (
                    <FavoriteIcon style={{ color: "#EA1A26" }} />
                ) : (
                    <FavoriteBorderIcon />
                )}
            </button>
            <h1>Nickname</h1>
            <span></span>
        </div>
    );
};

export default SpritesInfo;

