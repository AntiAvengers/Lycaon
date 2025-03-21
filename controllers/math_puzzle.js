function RNG(max) {
    return Math.floor((Math.random() * max) + 1);
}

function generate_puzzle(max_num = 10) {
    const REF_operators = ["+", "-", "*", "/"];
    const all_operators = ["+", "-", "*", "/"];

    const MAX_OPERATORS = 2;
    const MAX_NUMBERS = MAX_OPERATORS + 1;

    const operators = [];
    //generate random operators
    for(let i = 0; i < MAX_OPERATORS; i++) {
        const index = RNG(all_operators.length) - 1;
        operators.push(all_operators[index]);
        all_operators.splice(index, 1);
    }

    const equation = [];
    equation.push(RNG(max_num));
    for(let i = 0; i < operators.length; i++) {
        const num = equation[0];
        if(operators[i] == "/") {
            equation.unshift("/");
            equation.unshift(num * RNG(max_num));
            continue;
        }
        equation.unshift(operators[i]);
        equation.unshift(RNG(max_num));
    }
    
    equation.push(eval(equation.join("")))

    return equation.filter(str => !REF_operators.includes(str));
}

module.exports = function(req, res) {
    try {
        res.status(200).json({ data: generate_puzzle() });
    } catch(err) {
        console.error(err);
    }
}