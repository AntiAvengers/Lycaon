import { Link } from "react-router-dom";

const SpritesCollectionPg = () => {
    return (
        <div className="w-full flex flex-col items-center justify-start">
            <h1 className="text-[80px] text-center">Sprites Collection</h1>
            <section className="w-[702px] h-[441px] p-1 bg-[#FCF4E7]/10 rounded"></section>
            <Link to="/collection/spriteDetail">btn to sprite detail</Link>
        </div>
    );
};

export default SpritesCollectionPg;

