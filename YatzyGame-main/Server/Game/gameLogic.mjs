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

export let diceValues = [1,1,1,1,1]; // represent "const fields"

export let results = {ones: {value: 0, locked: false}, twos: {value: 0, locked: false}, 
                      three: {value: 0, locked: false}, four: {value: 0, locked: false}, 
                      five: {value: 0, locked: false}, six: {value: 0, locked: false},
                      onePair: {value: 0, locked: false}, twoPair: {value: 0, locked: false}, 
                      threePair: {value: 0, locked: false}, fourPair: {value: 0, locked: false}, 
                      fivePair: {value: 0, locked: false}, sixPair: {value: 0, locked: false}};


export function throwD()  { // export betyder at serveren (server.mjs) kan bruge metoden
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
    updateNumberScores();
    
    if (results.onePair.locked == false) {
        results.onePair.value = onePairPoints();
        }

    if (results.twoPair.locked == false) {
            results.twoPair.value = twoPairPoints();
        }

    if (results.threePair.locked == false) {
            results.threePair.value = threeSamePoints();
        }

    if (results.fourPair.locked == false) {
            results.fourPair.value = fourSamePoints();
        }

    // TODO:
    // if (results.fivePair.locked == false) {
    //         results.fourPair.value = ???;
    //     }
    
    // if (results.sixPair.locked == false) {
    //         results.fourPair.value = ???;
    //     }

    
    //let sumPoints = 0;
 
    //sumField = sumPoints;
    //bonusField = sumPoints >= 63 ? 50 : 0;
    
    //let totalPoints = parseInt(bonusField) || 0;
    
    // for(const field of Object.values(results)){ 
    //     if (field.locked) {
    //         totalPoints += field;
    //     }
    // };
    
    // total = totalPoints;
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


function updateNumberScores() {
    let frequency = getFrequency();
    results.ones.value = frequency[1] * 1;
    results.twos.value = frequency[2] * 2;
    results.three.value = frequency[3] * 3;
    results.four.value = frequency[4] * 4;
    
    // TODO:
    // results.five.value = frequency[5] * 5;
    // results.six.value = frequency[5] * 5;
    
}

export function getResults(){
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

// function fullHousePoints() {
//     let frequency = getFrequency();
//     let three = false;
//     let two = false;

//     for (let value = 1; value <= 6; value++) {
//         if (frequency[value] === 3) {
//             three = true;
//         }
//         if (frequency[value] === 2) {
//             two = true;
//         }
//     }
    
//     if (three && two) {
//         if (!fullHouse.hasAttribute('locked')) {
//             fullHouse.value = 25;
//         }
//         return 25;
//     }
//     if (!fullHouse.hasAttribute('locked')) {
//         fullHouse.value = 0;
//     }
//     return 0;
// }

// function smallStraightPoints() {
//     let frequency = getFrequency();
//     if (frequency[1] >= 1 && frequency[2] >= 1 && frequency[3] >= 1 && 
//         frequency[4] >= 1 && frequency[5] >= 1) {
//         if (!smallStraight.hasAttribute('locked')) {
//             smallStraight.value = 15;
//         }
//         return 15;
//     }
//     if (!smallStraight.hasAttribute('locked')) {
//         smallStraight.value = 0;
//     }
//     return 0;
// }

// function largeStraightPoints() {
//     let frequency = getFrequency();
//     if (frequency[2] >= 1 && frequency[3] >= 1 && frequency[4] >= 1 && 
//         frequency[5] >= 1 && frequency[6] >= 1) {
//         if (!largeStraight.hasAttribute('locked')) {
//             largeStraight.value = 20;
//         }
//         return 20;
//     }
//     if (!largeStraight.hasAttribute('locked')) {
//         largeStraight.value = 0;
//     }
//     return 0;
// }

// function chancePoints() {
//     let sum = 0;
//     fields.forEach(field => {
//         sum += parseInt(field.dataset.value) || 0;
//     });
//     if (!chance.hasAttribute('locked')) {
//         chance.value = sum;
//     }
//     return sum;
// }

// function yatzyPoints() {
//     let frequency = getFrequency();
//     for (let value = 1; value <= 6; value++) {
//         if (frequency[value] === 5) {
//             if (!yatzy.hasAttribute('locked')) {
//                 yatzy.value = 50;
//             }
//             return 50;
//         }
//     }
//     if (!yatzy.hasAttribute('locked')) {
//         yatzy.value = 0;
//     }
//     return 0;
// }

// function selectScore(field) {
//     if (turnNumber === 0 || gameEnded) {
//         return;
//     }
//     if (field.hasAttribute('locked')) {
//         return;
//     }
    
//     field.setAttribute('locked', 'true');
//     field.style.backgroundColor = '#d3d3d3';
//     field.style.fontWeight = 'bold';
//     field.style.cursor = 'not-allowed';
    
//     mustSelectScore = false;
//     rollButton.disabled = false;
//     resetForNextTurn();
// }

// function isGameOver() {
//     return scoreFields.every(field => field.hasAttribute('locked'));
// }

// function resetForNextTurn() {
//     turnNumber = 0;
//     totalTurns++;
//     holdStatus.fill(false);
//     fields.forEach(field => {
//         field.style.backgroundColor = 'white';
//         field.value = '';
//     });
//     rollButton.disabled = false;
//     updateTurnLabel();
//     updateScores();

//     if (isGameOver()) {
//         endGame();
//     }
// }

// function endGame() {
//     gameEnded = true;
//     rollButton.disabled = true;
//     turnLabel.textContent = 'Game Over!';
//     displayFinalScore();
// }

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
