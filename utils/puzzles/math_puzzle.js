function RNG(max) {
    return Math.floor((Math.random() * max) + 1);
}

function generate(max_num = 10) {
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

    const output = {
        data: {
            LHS: equation.filter(str => !REF_operators.includes(str)),
            RHS:  eval(equation.join(""))
        },
        validate_on_client: true, //Client will check answers / solutions
    }

    return output;
}

function generate_puzzle(num = 20) {
    const data = [];

    for(let i = 0; i < num; i++) {
        const chunk = generate()
        data.push(chunk.data);
    }

    const output = {
        data,
        validate_on_client: true
    }

    return output;
}

export {
    generate,
    generate_puzzle
}