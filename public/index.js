const startGame = function(suppressError) {
    $.get("/start-game?size=10", function(gomoku, status) {
        localStorage.currentGameId = gomoku.id;
        console.log("Started game with id '" + gomoku.id + "'");
        currentGame = gomoku;
        updateDisplay(gomoku);
    }).fail(function(e) {
        if (!suppressError) alert(e.responseText);
    });
}

const continueGame = function(id, suppressError) {
    $.get("/game-status?id=" + id, function(gomoku, status) {
        localStorage.currentGameId = gomoku.id;
        console.log("Continuing game with id '" + gomoku.id + "'");
        currentGame = gomoku;
        updateDisplay(gomoku);
    }).fail(function(e) {
        if (!suppressError) alert(e.responseText);
    });
}

const playTurn = function(currentGame, x, y, side, suppressError) {
    $.get("/play?id=" + (currentGame == null ? "" : currentGame.id) + "&x=" + x + "&y=" + y + "&side=" + side, function(gomoku, status) {
        updateDisplay(gomoku);
    }).fail(function(e) {
        if (!suppressError) alert(e.responseText);
    });
}
