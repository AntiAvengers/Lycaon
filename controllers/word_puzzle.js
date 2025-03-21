const dictionary = require('../utils/dictionary')
    .load_dictionary();

module.exports = function(req, res) {
    try {
        res.status(200).json({ data: dictionary[0] });
    } catch(err) {
        console.error(err);
    }
}