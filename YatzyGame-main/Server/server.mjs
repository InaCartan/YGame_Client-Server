

// opgave14.1.js
import express from 'express';
import { getResults, results, throwD } from './Game/gameLogic.mjs';
import { diceValues } from './Game/gameLogic.mjs';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../Client')));

app.use(session({
  secret: 'hemmeligKode123',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'Views'));

console.log("Tester")

// post = hvis man vil ændre på serveren
// get  = hvis man vil have noget fra serveren

let players = [];
let readyPlayers = new Set();
let gameStarted = false;

app.get('/', (req, res) => {
    if (gameStarted) {
        return res.render('players', { players });
    }

    res.render('index', {
        players,
        canStart: players.length >= 1,
        playerName: req.session.playerName,
        waiting: readyPlayers.has(req.session.playerName)
    });
});

app.post('/join', (req, res) => {
    const name = req.body.name?.trim();
    if (!name || gameStarted) {
        return res.render('index', {
            players,
            canStart: players.length >= 1,
            error: 'Ugyldigt navn eller spillet er allerede startet.'
        });
    }

    req.session.playerName = name;
    if (!players.includes(name)) {
        players.push(name);
    }

    res.redirect('/');
});

app.post('/start', (req, res) => {
    const name = req.session.playerName;
    if (!name || !players.includes(name)) {
        return res.redirect('/');
    }

    readyPlayers.add(name);

    if (readyPlayers.size >= 1) {
        gameStarted = true;
        return res.redirect('/game');
    }

    res.render('index', {
        players,
        canStart: players.length >= 1,
        playerName: name,
        waiting: true
    });
});

app.get('/game', (req, res) => {
    const name = req.session.playerName;

    if (!name || !players.includes(name)) {
        return res.redirect('/');
    }

    if (!gameStarted) {
        return res.redirect('/');
    }

    res.sendFile(path.join(__dirname, '../Client/Yatzy.html'));
});

app.get('/status', (req, res) => {
    res.send({
      players,
      gameStarted
    });
  });

app.post('/throwD', (req, res) => { // ændre data (og dice values)
    throwD()
    console.log(diceValues);
    res.status(201);
    res.send(diceValues)
});

app.get('/diceValues', (req, res) => { // henter data (dice values) og sender til client
    console.log(diceValues);
    res.send(diceValues)
});

app.get('/getResults', (req, res) => {
    console.log(results);
    res.send(getResults());
});

app.listen(8000);
console.log("Lytter på port " + 8000)
