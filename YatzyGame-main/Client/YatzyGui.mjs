const rollButton = document.querySelector('button');
const fields = document.querySelectorAll('.Fields input');

const ones = document.getElementById('ones');

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

async function throwD(){
    // opdatere dice values 
    // (await: venter til at post er færdig, ellers køre den videre til koden under den, imens post ikke er)
    await post(path + '/throwD')    

    let diceValues = await get(path + '/diceValues') // henter værdier fra serveren
    for(let i = 0; i < fields.length; i++){
        fields[i].value = diceValues[i];  
        //fields[i].dataset.value = value;
        //fields[i].style.backgroundImage = `url(${diceImages[value - 1]})`; (ikke lyve)
    }
    
    fields.forEach((field, index) => {
        field.addEventListener('click', () => {
            if (!gameEnded && turnNumber > 0 && turnNumber <= maxRollsPerTurn) {
                holdStatus[index] = !holdStatus[index];
                field.style.backgroundColor = holdStatus[index] ? '#e0e0e0' : 'white';
            }
        });
    });

    getResults();
}

rollButton.addEventListener('click', throwD);



async function getResults(){
    let results = await get(path + '/getResults')
    ones.value = results.ones.value;


}

