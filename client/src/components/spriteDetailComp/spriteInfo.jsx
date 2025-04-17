const sprite = {
    name: "Sprite",
    age: 5,
    personality: ["Happy", "Adventurous"],
    details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed maximus libero sit amet egestas accumsan. Sed massa sem, convallis et fringilla lacinia, faucibus sed augue.",
};

const SpritesInfo = () => {
    return (
        <div className="w-[305px] h-[252.5px] leading-none">
            <h1 className="text-[50px]">{sprite.name}</h1>
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

export default SpritesInfo;

