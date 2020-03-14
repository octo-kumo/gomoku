const express = require('express');
const gomoku = require('./gomoku.js');
const Gomoku = gomoku.Gomoku;
const Error = gomoku.Error;

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;
const DEFAULT_GAME_SIZE = 10;
const DEFAULT_WIN_LENGTH = 5;
const GAMES = {};
const SYSTEM = "System";

const PLAYER_NAMES = {
    "PLAYER1": "Black",
    "PLAYER2": "White"
};

app.use(express.static('public'))

app.get('/start-game', (req, res) => {
    let game = new Gomoku(req.query.size || DEFAULT_GAME_SIZE, req.query.winLength || DEFAULT_WIN_LENGTH);
    game.setWinCallback(() => {
        game.chat(SYSTEM, PLAYER_NAMES[game.winningSide] + " has won!");
        io.emit('win', game);
    });
    game.chat(SYSTEM, "Game Started!")
    GAMES[game.id] = game;
    res.json(game);
});

app.get('/restart', (req, res) => {
    let game = getGame(req, res);
    if (game instanceof Gomoku) {
        let error = game.reset(req.query.side);
        if (error instanceof Error) {
            if (error.code === 403) { // ask the other guy to confirm
                game.chat(SYSTEM, PLAYER_NAMES[req.query.side] + " requested a restart!");
                console.log(req.query.side, "requested", "restart");
                io.emit('chat', game)
            }
            res.status(error.code).send(error.error);
        } else {
            game.chat(SYSTEM, "Restart confirmed");
            io.emit('turn', game)
            res.json(game);
        }
    } else res.status(game.code).send(game.error);
});

app.get('/undo', (req, res) => {
    let game = getGame(req, res);
    if (game instanceof Gomoku) {
        let error = game.undo(req.query.side);
        if (error instanceof Error) {
            if (error.code === 403) { // ask the other guy to confirm
                game.chat(SYSTEM, PLAYER_NAMES[req.query.side] + " requested a undo!");
                console.log(req.query.side, "requested", "undo");
                io.emit('chat', game)
            }
            res.status(error.code).send(error.error);
        } else {
            game.chat(SYSTEM, "Undo confirmed");
            io.emit('turn', game)
            res.json(game);
        }
    } else res.status(game.code).send(game.error);
});

app.get('/chat', (req, res) => {
    let game = getGame(req, res);
    if (game instanceof Gomoku) {
        let error = game.chat(req.query.side, req.query.text);
        if (error instanceof Error) res.status(error.code).send(error.error);
        else {
            io.emit('chat', game)
            res.json(game);
        }
    } else res.status(game.code).send(game.error);
});

app.get('/game-status', (req, res) => {
    let game = getGame(req, res);
    if (game instanceof Gomoku) res.json(game);
    else res.status(game.code).send(game.error);
});

app.get('/play', (req, res) => {
    let game = getGame(req, res);
    if (game instanceof Gomoku) {
        game.chat(SYSTEM, PLAYER_NAMES[req.query.side] + " has layed a piece on " + req.query.x + ", " + req.query.y);
        let error = game.play(req.query.x, req.query.y, req.query.side);
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
