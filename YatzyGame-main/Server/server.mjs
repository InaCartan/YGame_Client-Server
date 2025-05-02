

// opgave14.1.js
import express from 'express';
import { getResults, results, throwD } from './Game/gameLogic.mjs';
import { diceValues } from './Game/gameLogic.mjs';
import cors from 'cors';
const app = express();
app.use(cors());





console.log("Tester")

// post = hvis man vil ændre på serveren
// get  = hvis man vil have noget fra serveren

app.post('/throwD', (req, res) => { // ændre data (og dice values)
    throwD()
    console.log(diceValues);
    res.status(201);
    res.send(diceValues)

    
} );


app.get('/diceValues', (req, res) => { // henter data (dice values) og sender til client
    console.log(diceValues);
    res.send(diceValues)
} );


app.get('/getResults', (req, res) => {
    console.log(results);
    res.send(getResults());
} );





app.listen(8000);
console.log("Lytter på port " + 8000)
