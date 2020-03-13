const express = require('express');
const gomoku = require('./gomoku.js');
const Gomoku = gomoku.Gomoku;
const Error = gomoku.Error;

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;
const DEFAULT_GAME_SIZE = 10;
const GAMES = {};

app.use(express.static('public'))

app.get('/start-game', (req, res) => {
    let game = new Gomoku(req.query.id || DEFAULT_GAME_SIZE);
    GAMES[game.id] = game;
    res.json(game);
});

app.get('/game-status', (req, res) => {
    let game = getGame(req, res);
    if (game instanceof Gomoku) res.json(game);
    else res.status(game.code).send(game.error);
});

app.get('/play', (req, res) => {
    let game = getGame(req, res);
    if (game instanceof Gomoku) {
        let error = game.play(req.query.x, req.query.y, req.query.side, won => {
            if (won) io.emit('win', game);
        });
        if (error instanceof Error) res.status(error.code).send(error.error);
        else {
            io.emit('turn', game);
            res.json(game);
        }
    } else res.status(game.code).send(game.error);
});

function getGame(req, res) {
    const id = req.query.id;
    if (!id) return new Error(400, 'Id Required!');
    const game = GAMES[id];
    if (!game) return new Error(400, 'Non-Existent Game!');
    return game;
}

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
