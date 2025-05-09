let holdStatus = [false, false, false, false, false];
let turnNumber = 0;
let totalTurns = 1;
const maxRollsPerTurn = 3;
const maxTotalTurns = 15;
let mustSelectScore = false;
let gameEnded = false;

const diceImages = [
    "images/dice-six-faces-one.svg",
    "images/dice-six-faces-two.svg",
    "images/dice-six-faces-three.svg",
    "images/dice-six-faces-four.svg",
    "images/dice-six-faces-five.svg",
    "images/dice-six-faces-six.svg"
];

export let diceValues = [1, 1, 1, 1, 1]; // represent "const fields"

export let results = {
    one: { value: 0, locked: false, beregner: () => getFrequency()[1] * 1 },   two: { value: 0, locked: false, beregner: () => getFrequency()[2] * 2 },
    three: { value: 0, locked: false, beregner: () => getFrequency()[3] * 3 }, four: { value: 0, locked: false, beregner: () => getFrequency()[4] * 4 },
    five: { value: 0, locked: false, beregner: () => getFrequency()[5] * 5 },  six: { value: 0, locked: false, beregner: () => getFrequency()[6] * 6 },

    onePair: { value: 0, locked: false, beregner: onePairPoints },     twoPair: { value: 0, locked: false, beregner: twoPairPoints },
    threeSame: { value: 0, locked: false, beregner: threeSamePoints }, fourSame: { value: 0, locked: false, beregner: fourSamePoints },

    fullHouse: { value: 0, locked: false, beregner: fullHousePoints },         smallStraight: { value: 0, locked: false, beregner: smallStraightPoints },
    largeStraight: { value: 0, locked: false, beregner: largeStraightPoints }, chance: { value: 0, locked: false, beregner: chancePoints },
    yatzy: { value: 0, locked: false, beregner: yatzyPoints },

    sumField: { value: 0 },
    bonusField: { value: 0 },
    total: { value: 0 },

};



export function throwD() { // export betyder at serveren (server.mjs) kan bruge metoden
    if (mustSelectScore || gameEnded) {
        return;
    }
    if (turnNumber < maxRollsPerTurn) {
        for (let i = 0; i < diceValues.length; i++) {
            if (!holdStatus[i]) {
                const value = Math.trunc(Math.random() * 6) + 1;
                diceValues[i] = value;
                // fields[i].style.backgroundImage = `url(${diceImages[value - 1]})`;
                // fields[i].value = '';  
                // fields[i].dataset.value = value;
            }
        }
        updateScores();
        turnNumber++;
        // updateTurnLabel();

        if (turnNumber === maxRollsPerTurn) {
            mustSelectScore = true;
            // rollButton.disabled = true;
        }
    }
}


function updateScores() {
    //updateNumberScores();

    Object.keys(results).forEach(keys => {
        if (results[keys].locked == false) {
            results[keys].value = results[keys].beregner();
        }
    })

    total_Sum_Bonus();


}

// function updateTurnLabel() {
//     turnLabel.textContent = `Turn: ${turnNumber}`;
// }

function getFrequency() {
    let frequency = Array(7).fill(0);
    for (let i of diceValues) {
        let value = i || 0;
        if (value >= 1 && value <= 6) {
            frequency[value]++;
        }
    }
    return frequency;
}


// function updateNumberScores() {
//     let frequency = getFrequency();
//     results.one.value = getFrequency()[1] * 1;
//     results.two.value = getFrequency()[2] * 2;
//     results.three.value = getFrequency()[3] * 3;
//     results.four.value = getFrequency()[4] * 4;
//     results.five.value = getFrequency()[5] * 5;
//     results.six.value = getFrequency()[6] * 6;

// }

export function getResults() {
    return results;
}

function onePairPoints() {
    let frequency = getFrequency();
    for (let value = 6; value >= 1; value--) {
        if (frequency[value] >= 2) {
            let points = value * 2;

            return points;
        }
    }

    return 0;
}

function twoPairPoints() {
    let frequency = getFrequency();
    let pairs = [];
    for (let value = 6; value >= 1; value--) {
        if (frequency[value] >= 2) {
            pairs.push(value * 2);
        }
    }
    if (pairs.length === 2) {
        let points = pairs[0] + pairs[1];
        return points;
    }

    return 0;
}

function threeSamePoints() {
    let frequency = getFrequency();
    for (let value = 6; value >= 1; value--) {
        if (frequency[value] >= 3) {
            let points = value * 3;
            return points;
        }
    }


    return 0;
}



function fourSamePoints() {
    let frequency = getFrequency();
    for (let value = 6; value >= 1; value--) {
        if (frequency[value] >= 4) {
            let points = value * 4;

            return points;
        }
    }

    return 0;
}

function fullHousePoints() {
    let frequency = getFrequency();
    let three = false;
    let two = false;

    for (let value = 1; value <= 6; value++) {
        if (frequency[value] === 3) {
            three = true;
        }
        if (frequency[value] === 2) {
            two = true;
        }
    }


    if (three && two) {
        if (results.fullHouse.locked == false) {
            results.fullHouse.value = 25;
        }
        return 25;
    }
    if (results.fullHouse.locked == false) {
        results.fullHouse.value = 0;
    }
    return 0;
}

function smallStraightPoints() {
    let frequency = getFrequency();
    if (frequency[1] >= 1 && frequency[2] >= 1 && frequency[3] >= 1 &&
        frequency[4] >= 1 && frequency[5] >= 1) {
        if (results.smallStraight.locked == false) {
            results.smallStraight.value = 15;
        }
        return 15;
    }
    if (results.smallStraight.locked == false) {
        results.smallStraight.value = 0;
    }
    return 0;
}

function largeStraightPoints() {
    let frequency = getFrequency();
    if (frequency[2] >= 1 && frequency[3] >= 1 && frequency[4] >= 1 &&
        frequency[5] >= 1 && frequency[6] >= 1) {
        if (results.largeStraight.locked == false) {
            results.largeStraight.value = 20;
        }
        return 20;
    }
    if (results.largeStraight.locked == false) {
        results.largeStraight.value = 0;
    }
    return 0;
}

function chancePoints() {
    let sum = 0;
    diceValues.forEach(d => {
        sum += d;
    })

    if (results.chance.locked == false) {
        results.chance.value = sum;
    }
    return sum;
}

function yatzyPoints() {
    let frequency = getFrequency();
    for (let value = 1; value <= 6; value++) {
        if (frequency[value] === 5) {
            if (results.yatzy.locked == false) {
                results.yatzy.value = 50;
            }
            return 50;
        }
    }
    if (results.yatzy.locked == false) {
        results.yatzy.value = 0;
    }
    return 0;
}

function total_Sum_Bonus() {
    let sumPoints = 0;
    const fields = ["one", "two", "three", "four", "five", "six"];

    for (let f of fields) {
        let res = results[f];
        if (res.locked == false) {
            sumPoints += res.value;
        }
    }

    results.sumField.value = sumPoints;
    results.bonusField.value = sumPoints > 63 ? 50 : 0;


    let totalPoints = results.bonusField.value;
    for (let f of fields) {
        let res = results[f];
        if (res.locked == false) {
            totalPoints += res.value;
        }
    }

    results.total.value = totalPoints;
}


export function selectScore(field) {
    if (turnNumber === 0 || gameEnded) {
        return;
    }
    if (results[field].locked == true) {
        return;
    }

    results[field].locked = true;

    // field.setAttribute('locked', 'true');
    // field.style.backgroundColor = '#d3d3d3';
    // field.style.fontWeight = 'bold';
    // field.style.cursor = 'not-allowed';
    //rollButton.disabled = false;
    mustSelectScore = false;
    resetForNextTurn();
}

// function isGameOver() {
//     return scoreFields.every(field => field.hasAttribute('locked'));
// }

function resetForNextTurn() {
    turnNumber = 0;
    totalTurns++;
    holdStatus.fill(false);
    // fields.forEach(field => {
    //     field.style.backgroundColor = 'white';
    //     field.value = '';
    // });
    diceValues.fill(1);

    //rollButton.disabled = false;
    //turnLabel.textContent = `Turn: ${turnNumber}`;
    updateScores();

    // if (isGameOver()) {
    //     endGame();
    // }
}

function endGame() {
    gameEnded = true;
    // rollButton.disabled = true;
    // turnLabel.textContent = 'Game Over!';
    //displayFinalScore();
}

// function displayFinalScore() {
//     const finalScore = total.value;
//     const bonus = bonusField.value;
//     alert(`Game Over!\nFinal Score: ${finalScore}\n${bonus > 0 ? 'Bonus Achieved! (+50)' : 'No Bonus'}`);
// }

// fields.forEach((field, index) => {
//     field.addEventListener('click', () => {
//         if (!gameEnded && turnNumber > 0 && turnNumber <= maxRollsPerTurn) {
//             holdStatus[index] = !holdStatus[index];
//             field.style.backgroundColor = holdStatus[index] ? '#e0e0e0' : 'white';
//         }
//     });
// });

// scoreFields.forEach(field => field.addEventListener('click', () => selectScore(field)));

