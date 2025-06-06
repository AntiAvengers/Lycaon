const AboutPg = () => {
    return (
        <div className="w-full h-auto bg-[##091031] flex flex-col">
            {/* Synopsis of Game */}
            <section className="relative bg-[url('/assets/landing/Lycaon-landing.jpg')] bg-center bg-no-repeat bg-contain w-[1440px] h-[830px] mx-auto">
                <img
                    src="/assets/landing/arrow-down.svg"
                    alt="arrow-down"
                    className="absolute w-auto top-[17px] left-[50%] translate-x-[-50%] animate-[float_3s_ease-in-out_infinite]"
                    style={{
                        animationName: "float",
                        animationTimingFunction: "ease-in-out",
                        animationDuration: "3s",
                        animationIterationCount: "infinite",
                    }}
                />
                <div className="absolute top-0 left-0 w-[525px] h-[235px] bg-[#140E28] text-[#FEFAF3] flex items-center justify-center">
                    <p className="w-[464px] h-[150px] text-[25px] text-start leading-none">
                        Lycaon, a powerful summoner, created the Codex Bestiarum
                        to control all beasts but was trapped inside it by a
                        forbidden ritual. Now, the Codex tempts new readers with
                        power, guiding them toward the same fate. Whispers say
                        Lycaon’s spirit still waits within. Will you finish the
                        summoning—or become its next prisoner?
                    </p>
                </div>
                <img
                    src="/assets/landing/book-landing.png"
                    alt="book-landing"
                    className="absolute bottom-[-315px] z-10"
                />
            </section>
            {/* Game Preview */}
            <section className="relative bg-[url('/assets/landing/game-landing.png')] bg-center bg-no-repeat bg-contain w-[1440px] h-[892px] mx-auto">
                <img
                    src="/assets/landing/game-preview.gif"
                    alt="gameGif"
                    className="absolute bottom-[130px] left-[122px] w-[695px] h-[512px]"
                />
                <img
                    src="/assets/landing/scroll-plaque.jpg"
                    alt="scroll-landing"
                    className="absolute right-[136px] top-[250px] w-[391px] h-[291px]"
                />
                <p className="absolute top-[93px] right-[305px] w-[686px] h-[106px] bg-[#3E2895] rounded-[10px] text-center text-[50px] text-[#FEFAF3] leading-none flex items-center">
                    Embark on a quest to solve the ancient puzzles found in
                    Codex Bestiarum
                </p>
                <p className="absolute bottom-[130px] right-[83px] w-[500px] h-[149px] bg-[#3E2895] rounded-[10px] text-center text-[50px] text-[#FEFAF3] leading-none flex items-center">
                    Each puzzle solved reveals a sacred page,fragments of the
                    summoning scroll.
                </p>
            </section>
            {/* Eggs Area */}
            <section className="relative bg-[#3E2895] w-[1440px] h-[304px] flex items-center justify-center mx-auto">
                <img
                    src="/assets/landing/noble-landing.png"
                    alt="nobleLanding"
                    className="absolute left-0 top-[-150px] w-[260px] z-10 animate-[float_2.5s_ease-in-out_infinite]"
                    style={{
                        animationName: "float",
                        animationTimingFunction: "ease-in-out",
                        animationDuration: "2.5s",
                        animationIterationCount: "infinite",
                    }}
                />
                <img
                    src="/assets/landing/mythic-landing.png"
                    alt="eliteLanding"
                    className="absolute left-[60px] top-[-60px] w-[380px] z-10 animate-[float_3s_ease-in-out_infinite]"
                    style={{
                        animationName: "float",
                        animationTimingFunction: "ease-in-out",
                        animationDuration: "3s",
                        animationIterationCount: "infinite",
                    }}
                />
                <img
                    src="/assets/landing/elite-landing.png"
                    alt="nobleLanding"
                    className="absolute left-0 bottom-[-105px] w-[238px] z-10 animate-[float_2.75s_ease-in-out_infinite]"
                    style={{
                        animationName: "float",
                        animationTimingFunction: "ease-in-out",
                        animationDuration: "2.75s",
                        animationIterationCount: "infinite",
                    }}
                />
                <p className="w-[740px] h-[149px] text-[50px] text-[#FEFAF3] text-center leading-none ml-[12px]">
                    Gather enough pages and approach the Wishing Fountain... if
                    you dare to summon the forbidden sprites eggs.
                </p>
            </section>
            {/* Fountain Area */}
            <section className="relative bg-[url('/assets/landing/fountain-landing.jpg')] bg-center bg-no-repeat bg-contain w-[1440px] h-[1524px] mx-auto">
                <img
                    src="/assets/landing/pearlDragon-landing.png"
                    alt="pearlDrag-landing"
                    className="absolute top-[-120px] right-0 w-[758px] h-[758px]"
                />
                <img
                    src="/assets/landing/wolf-landing.png"
                    alt="pearlDrag-landing"
                    className="absolute bottom-[300px] left-[50px] w-[526px] h-[526px]"
                />
                <p className="absolute bottom-[76px] left-[76px] w-[490px] h-[149px] bg-[#3E2895] rounded-[10px] flex items-center w-[444px] text-[50px] text-[#FEFAF3] text-center leading-none">
                    Venture into the market, where coveted sprites from fellow
                    seekers await.
                </p>

                <div className="absolute bottom-[82px] right-[449px] w-[304px] h-[335px] bg-[#273472] rounded-[20px] shadow-[10px_10px_0_rgba(0,0,0,0.25)] flex flex-col items-center justify-start text-[#FEFAF3]">
                    <section className="w-[209px] h-[208px] bg-[#F7F7F7] rounded-[10px] flex justify-center mt-[22px]">
                        <img
                            src="/assets/sprite-gif/slime.gif"
                            alt="slime-gif"
                            className="w-[150px] h-[200px]"
                        />
                    </section>
                    <section className="flex flex-col justify-start w-[209px] h-[70px] leading-none pt-[14px]">
                        <div className="flex flex-row items-center pb-[10px]">
                            <img
                                src="/assets/icons/sui-icon-bg.svg"
                                alt="sui-icon"
                                className="w-[17px] h-[17px] mr-[5px]"
                            />
                            <span className="text-[25px]">900</span>
                        </div>
                        <span className="text-[15px]">LITTLES</span>
                        <span className="text-[25px]">Slime</span>
                    </section>
                </div>
            </section>
            {/* Story of Game */}
            <section className="w-[1440px] h-[680px] bg-[#E8E8E8] flex items-center pl-[172px] mx-auto">
                <div className="w-[953px] h-[557px] flex flex-col justify-between">
                    <h1 className="text-[50px]">Read the lore</h1>
                    <div className="flex flex-row justify-between text-[25px] flex flex-row leading-none">
                        <section className="w-[438px]">
                            Long ago, Lycaon was a brilliant summoner who sought
                            to catalog and control every creature that walked
                            between worlds. His obsession led him to craft the
                            Codex Bestiarum, a living spellbook that could
                            summon beasts from the mundane to the divine.
                            <div className="h-[20px]" />
                            But in his hunger for mastery, Lycaon attempted the
                            Forbidden Summoning—a ritual to call forth an entity
                            beyond mortal comprehension. The spell backfired,
                            twisting reality and sealing him within the Codex
                            itself. His name was erased from history, his
                            existence reduced to whispers in the margins of
                            forgotten tomes.
                            <div className="h-[20px]" />
                            Scholars and warlocks who have reached the final
                            pages of the Codex speak of a great warning, written
                            in a tongue older than the gods themselves. It tells
                            of a beast that even Lycaon dared not name—a
                            summoning so vast and catastrophic that the very ink
                            of the Codex recoils from its presence.
                        </section>
                        <section className="w-[438px]">
                            Some believe that the Codex was never meant to be
                            completed, that its final pages are a trap—a lure
                            for the greedy and the foolish. And yet, the book
                            still calls to those who would dare seek its truths.
                            <div className="h-[20px]" />
                            Now, the Codex shifts and tests those who dare open
                            it, offering power to those who solve its
                            riddles—but always guiding them toward the same
                            fate. Some say Lycaon’s spirit lingers, watching,
                            waiting, hoping that one day, someone will complete
                            the final summoning and set him free, or replace
                            him.
                            <div className="h-[20px]" />
                            Will you decipher the riddles, summon creatures of
                            legend, and claim the power of the forgotten beasts?
                            <div className="h-[20px]" />
                            Or will you unlock a secret that should have
                            remained lost forever?
                        </section>
                    </div>
                </div>
            </section>
            {/* GitHub */}
            <section className="w-[1440px] pl-[172px] py-[10px] bg-[#091031] mx-auto">
                <p className="w-auto text-[#FEFAF3] text-[25px]">
                    Created by Anti-Avengers -{" "}
                    <a
                        href="https://github.com/AntiAvengers/Lycaon"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-[1px] underline-offset-3 hover:text-[#FBBB26]"
                    >
                        Github Link
                    </a>
                </p>
            </section>
        </div>
    );
};

export default AboutPg;

