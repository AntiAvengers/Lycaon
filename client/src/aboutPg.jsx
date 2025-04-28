const aboutImg = [
    { text: "Obtain the sprites by solving the puzzles", width: "w-[675px]" },
    { text: "Puzzles grant you pages", width: "w-[591px]" },
    {
        text: "With enough pages, make a wish at the fountain",
        width: "w-[675px]",
    },
    { text: "And obtain the Sprites", width: "w-[591px]" },
    { text: "Collect, feed, and trade your Sprites!", width: "w-[675px]" },
];

const AboutPg = () => {
    return (
        <div className="w-full bg-[#FFFFFF] flex flex-col px-[100px] py-[50px] gap-[50px]">
            {/* Synopsis of Game */}
            <p className="w-[722px] text-[25px]">
                Lycaon, a powerful summoner, created the Codex Bestiarum to
                control all beasts but was trapped inside it by a forbidden
                ritual. Now, the Codex tempts new readers with power, guiding
                them toward the same fate. Whispers say Lycaon’s spirit still
                waits within. Will you finish the summoning—or become its next
                prisoner?
            </p>

            {/* Pic Section About Game */}
            <section className="text-[37px] flex flex-col gap-[40px]">
                {aboutImg.map((about, index) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center ${
                            index % 2 === 0 ? "items-start" : "items-end"
                        } w-full`}
                    >
                        <h1 className="mb-2">
                            {about.text}
                        </h1>
                        <div
                            className={`${about.width} h-[377px] border border-[#FFFFFF] bg-[#CFCFCF]`}
                        />
                    </div>
                ))}
            </section>
            {/* Story of Game */}
            <section className="w-[977px]">
                <h1 className="text-[37px]">Read the lore</h1>
                <p className="text-[25px]">
                    Long ago, Lycaon was a brilliant summoner who sought to
                    catalog and control every creature that walked between
                    worlds. His obsession led him to craft the Codex Bestiarum,
                    a living spellbook that could summon beasts from the mundane
                    to the divine.
                    <div className="h-[15px]" />
                    But in his hunger for mastery, Lycaon attempted the
                    Forbidden Summoning—a ritual to call forth an entity beyond
                    mortal comprehension. The spell backfired, twisting reality
                    and sealing him within the Codex itself. His name was erased
                    from history, his existence reduced to whispers in the
                    margins of forgotten tomes.
                    <div className="h-[15px]" />
                    Scholars and warlocks who have reached the final pages of
                    the Codex speak of a great warning, written in a tongue
                    older than the gods themselves. It tells of a beast that
                    even Lycaon dared not name—a summoning so vast and
                    catastrophic that the very ink of the Codex recoils from its
                    presence. Some believe that the Codex was never meant to be
                    completed, that its final pages are a trap—a lure for the
                    greedy and the foolish. And yet, the book still calls to
                    those who would dare seek its truths.
                    <div className="h-[15px]" />
                    Now, the Codex shifts and tests those who dare open it,
                    offering power to those who solve its riddles—but always
                    guiding them toward the same fate. Some say Lycaon’s spirit
                    lingers, watching, waiting, hoping that one day, someone
                    will complete the final summoning and set him free, or
                    replace him.
                    <div className="h-[15px]" />
                    Will you decipher the riddles, summon creatures of legend,
                    and claim the power of the forgotten beasts?
                    <div className="h-[15px]" />
                    Or will you unlock a secret that should have remained lost
                    forever?
                </p>
            </section>
        </div>
    );
};

export default AboutPg;

