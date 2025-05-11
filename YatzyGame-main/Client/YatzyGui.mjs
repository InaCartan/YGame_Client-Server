const rollButton = document.querySelector('button');
const fields = document.querySelectorAll('.Fields input');

const one = document.getElementById('one');
const two = document.getElementById('two')
const three = document.getElementById('three')
const four = document.getElementById('four');
const five = document.getElementById('five');
const six = document.getElementById('six');

const onePair = document.getElementById('one-pair');
const twoPair = document.getElementById('two-pair');
const threeSame = document.getElementById('three-same');
const fourSame = document.getElementById('four-same');

const fullHouse = document.getElementById('full-house');
const smallStraight = document.getElementById('small-straight');
const largeStraight = document.getElementById('large-straight');

const chance = document.getElementById('chance');
const yatzy = document.getElementById('yatzy');

const sumField = document.getElementById('sum');
const bonusField = document.getElementById('bonus');
const total = document.getElementById('total');

let holdStatus = [false, false, false, false, false];
let turnNumber = 0;
let totalTurns = 1;
const maxRollsPerTurn = 3;
const maxTotalTurns = 15;
let mustSelectScore = false;
let gameEnded = false;

const scoreFields = [one, two, three, four, five, six, onePair, twoPair, threeSame, fourSame, fullHouse, smallStraight, largeStraight, chance, yatzy];

let path = 'http://localhost:8000'

async function get(url) {
    const respons = await fetch(url);
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}

async function post(url, objekt) {
    const respons = await fetch(url, {
        method: "POST",
        body: JSON.stringify(objekt),
        headers: { 'Content-Type': 'application/json' }
    });
    if (respons.status !== 201) 
        throw new Error(respons.status);
    return await respons.text();
}

// post = hvis man vil ændre på serveren
// get  = hvis man vil have noget fra serveren

async function showD() {
    let diceValues = await get(path + '/diceValues');
    for(let i = 0; i < fields.length; i++) {
        const value = diceValues[i];
        if (!holdStatus[i]) {  
            fields[i].value = value;
            fields[i].style.backgroundImage = value > 0 ? `url(images/dice-six-faces-${value}.svg)` : '';
        }
        fields[i].style.backgroundColor = holdStatus[i] ? '#e0e0e0' : 'white';
    }
    await getResults();
}

async function throwD() {
    if (mustSelectScore || gameEnded || turnNumber >= maxRollsPerTurn) {
        return;
    }

    await post(path + '/throwD', { holdStatus });
    await showD();
    
    turnNumber++;
    updateTurnDisplay();
}

function updateTurnDisplay() {
    const turnLabel = document.querySelector('.Turns label');
    if (turnNumber >= maxRollsPerTurn) {
        turnLabel.textContent = 'Select a score!';
        rollButton.disabled = true;
        mustSelectScore = true;
    } else {
        turnLabel.textContent = `Turn: ${turnNumber}`;
    }
}

async function selectScore(field) {
    if (turnNumber === 0 || gameEnded || field.hasAttribute('locked')) {
        return;
    }

    
    const serverFieldId = scoreTypeMapping[field.id] || field.id;
    let paramtre = { id: serverFieldId };
    
    await post(path + '/selectScore', paramtre);
    await getResults();
    
    mustSelectScore = false;
    rollButton.disabled = false;
    resetTurn();
    await showD();
}

const scoreTypeMapping = {
    'one-pair': 'onePair',
    'two-pair': 'twoPair',
    'three-same': 'threeSame',
    'four-same': 'fourSame',
    'full-house': 'fullHouse',
    'small-straight': 'smallStraight',
    'large-straight': 'largeStraight'
};


function showResultField(results, key, field) {
    const serverKey = key.includes('-') ? scoreTypeMapping[key] : key;
    
    if (!results[serverKey]) {
        console.error('Missing result for key:', key, 'serverKey:', serverKey);
        return;
    }

    field.value = results[serverKey].value;
    if (results[serverKey].locked) {
        field.setAttribute('locked', 'true');
        field.style.backgroundColor = '#d3d3d3';
        field.style.fontWeight = 'bold';
        field.style.cursor = 'not-allowed';
    }
}


async function getResults() {
    let results = await get(path + '/getResults');

    one.value = results.one.value;
    showResultField(results, "one", one);

    two.value = results.two.value;
    showResultField(results, "two", two);

    three.value = results.three.value;
    showResultField(results, "three", three);
    
    four.value = results.four.value;
    showResultField(results, "four", four);

    five.value = results.five.value;
    showResultField(results, "five", five);

    six.value = results.six.value;
    showResultField(results, "six", six);

    onePair.value = results.onePair.value;
    showResultField(results, "one-pair", onePair);

    twoPair.value = results.twoPair.value;
    showResultField(results, "two-pair", twoPair);

    threeSame.value = results.threeSame.value;
    showResultField(results, "three-same", threeSame);

    fourSame.value = results.fourSame.value;
    showResultField(results, "four-same", fourSame);

    fullHouse.value = results.fullHouse.value;
    showResultField(results, "full-house", fullHouse);

    smallStraight.value = results.smallStraight.value;
    showResultField(results, "small-straight", smallStraight);

    largeStraight.value = results.largeStraight.value;
    showResultField(results, "large-straight", largeStraight);
    
    chance.value = results.chance.value;
    showResultField(results, "chance", chance);

    yatzy.value = results.yatzy.value;
    showResultField(results, "yatzy", yatzy);
    
    sumField.value = results.sumField.value;
    bonusField.value = results.bonusField.value;
    total.value = results.total.value;

    if (isGameOver()) {
        endGame();
    }
}

function resetTurn() {
    turnNumber = 0;
    holdStatus.fill(false);
    fields.forEach(field => {
        field.style.backgroundColor = 'white';
    });
    updateTurnDisplay();
    rollButton.disabled = false;
}

function isGameOver() {
    return scoreFields.every(field => field.hasAttribute('locked'));
}

function endGame() {
    gameEnded = true;
    rollButton.disabled = true;
    turnLabel.textContent = 'Game Over!';
    displayFinalScore();
}

function displayFinalScore() {
    const finalScore = total.value;
    const bonus = bonusField.value;
    alert(`Game Over!\nFinal Score: ${finalScore}\n${bonus > 0 ? 'Bonus Achieved! (+50)' : 'No Bonus'}`);
    
    if (confirm('Play again?')) {
        resetGame();
    }
}

function resetGame() {
    holdStatus.fill(false);
    turnNumber = 0;
    totalTurns = 1;
    gameEnded = false;
    mustSelectScore = false;
    
    fields.forEach(field => {
        field.style.backgroundColor = 'white';
        field.value = '';
    });
    
    scoreFields.forEach(field => {
        field.removeAttribute('locked');
        field.style.backgroundColor = 'white';
        field.style.fontWeight = 'normal';
        field.style.cursor = 'pointer';
        field.value = '0';
    });
    
    sumField.value = '0';
    bonusField.value = '0';
    total.value = '0';
    
    rollButton.disabled = false;
    turnLabel.textContent = 'Turn: 1';
    
    post(path + '/resetGame');
}


rollButton.addEventListener('click', throwD);

// holder pointer (felterne)
scoreFields.forEach(field => {
    field.addEventListener('click', () => {
        if (turnNumber > 0) {  
            selectScore(field);
        }
    });
});

fields.forEach((field, index) => {
    field.addEventListener('click', async () => {
        if (!gameEnded && turnNumber > 0 && turnNumber < maxRollsPerTurn) {
            holdStatus[index] = !holdStatus[index];
            field.style.backgroundColor = holdStatus[index] ? '#e0e0e0' : 'white';
            await post(path + '/updateHold', { index, holdStatus });
        }
    });
});





