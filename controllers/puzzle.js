module.exports = {
    init: function(req, res) {
        //Puzzle Randomizer
        const puzzles = ["WORDS", "MATH"];
        const i = Math.floor(Math.random() * puzzles.length);
        res.status(200).json({ data: puzzles[i] });
    }
}