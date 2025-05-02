

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

export let results = {ones: {value: 0, locked: false},twos: {value: 0, locked: false}, onePair: {value: 0, locked: false}};

// const rollButton = document.querySelector('button');
// const turnLabel = document.querySelector('.Turns label');

// const fields = document.querySelectorAll('.Fields input');
export let diceValues = [1,1,1,1,1]; // represent "const fields"

// const ones = document.getElementById('ones');

// const twos = document.getElementById('twos');
// const threes = document.getElementById('threes');
// const fours = document.getElementById('fours');
// const fives = document.getElementById('fives');
// const sixes = document.getElementById('sixes');

// const onePair = document.getElementById('one-pair');


// const twoPair = document.getElementById('two-pair');
export let twoPair;

// const threeSame = document.getElementById('three-same');
export let threeSame;

// const fourSame = document.getElementById('four-same');
export let fourSame;

// const fullHouse = document.getElementById('full-house');
export let fullHouse;

// const smallStraight = document.getElementById('small-straight');
export let smallStraight;

// const largeStraight = document.getElementById('large-straight');
export let largeStraight;

// const chance = document.getElementById('chance');
export let opportunity;

// const yatzy = document.getElementById('yatzy');
export let yatzy;

// const sumField = document.getElementById('sum');
export let sumField;

// const bonusField = document.getElementById('bonus');
export let bonusField;

// const total = document.getElementById('total');
export let total;

// const scoreFields = [ones, twos, threes, fours, fives, sixes, onePair, twoPair, threeSame, fourSame, fullHouse, smallStraight, largeStraight, chance, yatzy];


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

    // twoPairPoints();
    // threeSamePoints();
    // fourSamePoints();
    // fullHousePoints();
    // smallStraightPoints();
    // largeStraightPoints();
    // chancePoints();
    // yatzyPoints();
    
    let sumPoints = 0;
    // [ones, twos, threes, fours, fives, sixes].forEach(field => {
    //     if (field.hasAttribute('locked')) {
    //         sumPoints += parseInt(field.value) || 0;
    //     }
    // });
    
    sumField = sumPoints;
    bonusField = sumPoints >= 63 ? 50 : 0;
    
    let totalPoints = parseInt(bonusField) || 0;
    
    for(const field of Object.values(results)){ 
        if (field.locked) {
            totalPoints += field;
        }
    };
    
    total = totalPoints;
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
    
    // if (!twos.hasAttribute('locked')) {
    //     twos.value = frequency[2] * 2;
    // }
    // if (!threes.hasAttribute('locked')) {
    //     threes.value = frequency[3] * 3;
    // }
    // if (!fours.hasAttribute('locked')) {
    //     fours.value = frequency[4] * 4;
    // }
    // if (!fives.hasAttribute('locked')) {
    //     fives.value = frequency[5] * 5;
    // }
    // if (!sixes.hasAttribute('locked')) {
    //     sixes.value = frequency[6] * 6;
    // }
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
        if (!twoPair.hasAttribute('locked')) {
            twoPair = points;
        }
        return points;
    }
    if (!twoPair.hasAttribute('locked')) {
        twoPair.value = 0;
    }
    return 0;
}

// function threeSamePoints() {
//     let frequency = getFrequency();
//     for (let value = 6; value >= 1; value--) {
//         if (frequency[value] >= 3) {
//             let points = value * 3;
//             if (!threeSame.hasAttribute('locked')) {
//                 threeSame.value = points;
//             }
//             return points;
//         }
//     }
//     if (!threeSame.hasAttribute('locked')) {
//         threeSame.value = 0;
//     }
//     return 0;
// }

// function fourSamePoints() {
//     let frequency = getFrequency();
//     for (let value = 6; value >= 1; value--) {
//         if (frequency[value] >= 4) {
//             let points = value * 4;
//             if (!fourSame.hasAttribute('locked')) {
//                 fourSame.value = points;
//             }
//             return points;
//         }
//     }
//     if (!fourSame.hasAttribute('locked')) {
//         fourSame.value = 0;
//     }
//     return 0;
// }

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
// rollButton.addEventListener('click', throwD);