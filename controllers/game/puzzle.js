/* 
    1) Picking a random puzzle
    2) Generating a "game session" and storing it on Firebase
    3) Sending the appropriate information into game session, differentiating it from stuff to send to client
    4) Route for universal "valid" answer checker
*/

module.exports = {
    init: function(req, res) {
        //Puzzle Randomizer
        const puzzles = ["WORDS", "MATH"];
        const i = Math.floor(Math.random() * puzzles.length);
        res.status(200).json({ data: puzzles[i] });
    }
}