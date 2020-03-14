'use strict';
const uuidv4 = require('uuid').v4;

const PLAYER1 = "PLAYER1";
const PLAYER2 = "PLAYER2";

class Gomoku {
    constructor(size, winLength) {
        this.id = uuidv4();
        this.size = size || 10;
        this.gameBoard = [];
        this.chats = [];
        this.toPlay = PLAYER1;
        this.winLength = winLength || 5;
        for (let i = 0; i < size; i++) this.gameBoard[i] = [];
        console.log("Gomoku Init | ID = " + this.id + ", Size = " + size);
    }

    getID() {
        return this.id;
    }

    getBoard() {
        return this.gameBoard;
    }

    getCell(x, y) {
        return this.gameBoard[y][x];
    }

    setCell(x, y, side) {
        this.gameBoard[y][x] = side;
    }

    setWinCallback(winCallback) {
        this.winCallback = winCallback;
    }

    play(x, y, side) {
        if (this.winningSide) return new Error(400, "Game has already ended!");
        if ((!x) || (!y) || (!side)) return new Error(400, "X, Y and side are required!");
        if (isNaN(x) || isNaN(y)) return new Error(400, "X or Y are not integers!");
        x = parseInt(x);
        y = parseInt(y);
        if (this.toPlay !== side) return new Error(400, "Not your turn!");
        if (x >= this.size || y >= this.size) return new Error(400, "The size of this board is " + this.size + ", requested " + x + ", " + y);
        if (this.gameBoard[y][x]) return new Error(400, "There is already a piece at " + x + ", " + y);
        this.toPlay = (side == PLAYER1 ? PLAYER2 : PLAYER1);
        this.setCell(x, y, side);
        this.checkWinStatus();
        return true;
    }

    chat(side, text) {
        if ((!side) || (!text)) return new Error(400, "Message and player name need to be given!");
        this.chats.push({
            side: side,
            text: text
        });
        return this;
    }

    async checkWinStatus() {
        if (this.checkWin(PLAYER1)) {
            console.log("Checking Win Condition for " + PLAYER1);
            this.winningSide = PLAYER1;
            if (this.winCallback) this.winCallback();
        }
        if (this.checkWin(PLAYER2)) {
            console.log("Checking Win Condition for " + PLAYER2);
            this.winningSide = PLAYER2;
            if (this.winCallback) this.winCallback();
        }
    }

    checkWin(side) {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.checkHorizontal(x, y, side)) return true;
                if (this.checkVerticle(x, y, side)) return true;
                if (this.checkDiagonal_NW_SE(x, y, side)) return true;
                if (this.checkDiagonal_SW_NE(x, y, side)) return true;
            }
        }
        return false;
    }

    checkHorizontal(x, y, side) {
        let goBack = (x - (this.winLength - 1) >= 0);
        let goForward = (x + (this.winLength - 1) < this.size);
        if ((!goBack) && (!goForward)) return false;
        for (let i = 0; i < this.winLength; i++) {
            if (goBack && (this.gameBoard[y][x - i] !== side)) return false;
            if (goForward && (this.gameBoard[y][x + i] !== side)) return false;
        }
        return true;
    }

    checkVerticle(x, y, side) {
        let goUp = (y - (this.winLength - 1) >= 0);
        let goDown = (y + (this.winLength - 1) < this.size);
        if ((!goUp) && (!goDown)) return false;
        for (let i = 0; i < this.winLength; i++) {
            if (goUp && (this.gameBoard[y - i][x] !== side)) return false;
            if (goDown && (this.gameBoard[y + i][x] !== side)) return false;
        }
        return true;
    }

    checkDiagonal_NW_SE(x, y, side) {
        let goLeftUp = (x - (this.winLength - 1) >= 0) && (y - (this.winLength - 1) >= 0);
        let goRightDown = (x + (this.winLength - 1) < this.size) && (y + (this.winLength - 1) < this.size);
        if ((!goLeftUp) && (!goRightDown)) return false;
        for (let i = 0; i < this.winLength; i++) {
            if (goLeftUp && (this.gameBoard[y - i][x - i] !== side)) return false;
            if (goRightDown && (this.gameBoard[y + i][x + i] !== side)) return false;
        }
        return true;
    }

    checkDiagonal_SW_NE(x, y, side) {
        let goLeftDown = (x - (this.winLength - 1) >= 0) && (y + (this.winLength - 1) < this.size);
        let goRightUp = (x + (this.winLength - 1) < this.size) && (y - (this.winLength - 1) >= 0);
        if ((!goLeftDown) && (!goRightUp)) return false;
        for (let i = 0; i < this.winLength; i++) {
            if (goLeftDown && (this.gameBoard[y + i][x - i] !== side)) return false;
            if (goRightUp && (this.gameBoard[y - i][x + i] !== side)) return false;
        }
        return true;
    }

    reset() {
        this.winningSide = null;
        this.gameBoard = [];
        this.toPlay = PLAYER1;
        for (let i = 0; i < this.size; i++) this.gameBoard[i] = [];
        console.log("Gomoku Reset | ID = " + this.id + ", Size = " + this.size);
    }
}

class Error {
    constructor(code, error) {
        this.code = code;
        this.error = error;
    }
}

module.exports = {
    "Gomoku": Gomoku,
    "Error": Error
};
