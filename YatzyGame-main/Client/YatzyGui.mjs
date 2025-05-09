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

async function showD(){
    let diceValues = await get(path + '/diceValues') // henter værdier fra serveren
    for(let i = 0; i < fields.length; i++){
        fields[i].value = diceValues[i];  
        //fields[i].dataset.value = value;
        //fields[i].style.backgroundImage = `url(${diceImages[value - 1]})`; (ikke lyve)
    }
}

async function throwD(){
    // opdatere dice values 
    // (await: venter til at post er færdig, ellers køre den videre til koden under den, imens post ikke er)
    await post(path + '/throwD')    
    showD();
    
    
    
    getResults();
}
rollButton.addEventListener('click', throwD);


async function selectScore(field) {
    let paramtre = {id: field.id};
    await post(path + '/selectScore', paramtre);
    
    // field.setAttribute('locked', 'true');
    // field.style.backgroundColor = '#d3d3d3';
    // field.style.fontWeight = 'bold';
    // field.style.cursor = 'not-allowed'; 
    showD();

}

function showResultField(results,key,field){
    if(results[key].locked == true){
        field.setAttribute('locked', 'true');
        field.style.backgroundColor = '#d3d3d3';
        field.style.fontWeight = 'bold';
        field.style.cursor = 'not-allowed';
    }
    
   // mustSelectScore = false;
    rollButton.disabled = false;
}

async function getResults(){
    let results = await get(path + '/getResults')
    one.value = results.one.value;
    showResultField(results, "one",one);

    two.value = results.two.value;
    showResultField(results, "two", two);

    three.value = results.three.value;
    showResultField(results,"three", three);
    
    four.value = results.four.value;
    showResultField(results,"four", four);

    five.value = results.five.value;
    showResultField(results,"five", five);

    six.value = results.six.value;
    showResultField(results,"six", six);

    onePair.value = results.onePair.value;
    showResultField(results,"onePair", onePair);

    twoPair.value = results.twoPair.value;
    showResultField(results,"twoPair", twoPair);

    threeSame.value = results.threeSame.value;
    showResultField(results,"threeSame", threeSame);

    fourSame.value = results.fourSame.value;
    showResultField(results,"fourSame", fourSame);

    fullHouse.value = results.fullHouse.value;
    showResultField(results,"fullHouse", fullHouse);

    smallStraight.value = results.smallStraight.value;
    showResultField(results, "smallStraight", smallStraight);

    largeStraight.value = results.largeStraight.value;
    showResultField(results, "largeStraight", largeStraight);
    
    chance.value = results.chance.value;
    showResultField(results, "chance", chance);

    yatzy.value = results.yatzy.value;
    showResultField(results, "yatzy", yatzy);
    
    sumField.value = results.sumField.value;
    

    bonusField.value = results.bonusField.value;
    

    total.value = results.total.value;
    

}


fields.forEach((field, index) => {
    field.addEventListener('click', () => {
        if (!gameEnded && turnNumber > 0 && turnNumber <= maxRollsPerTurn) {
            holdStatus[index] = !holdStatus[index];
            field.style.backgroundColor = holdStatus[index] ? '#e0e0e0' : 'white';
        }
    });
});



// holder pointer (felterne)
scoreFields.forEach(field => field.addEventListener('click', () => selectScore(field)));




