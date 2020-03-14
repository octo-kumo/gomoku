const startGame = function(size, suppressError) {
    $.get("/start-game?size=" + (size || 10), function(gomoku, status) {
        localStorage.currentGameId = gomoku.id;
        console.log("Started game with id '" + gomoku.id + "'");
        updateDisplay(gomoku);
        updateUrl(gomoku.id);
    }).fail(function(e) {
        if (!suppressError) alert(e.responseText);
    });
}

const continueGame = function(id, suppressError) {
    $.get("/game-status?id=" + id, function(gomoku, status) {
        localStorage.currentGameId = gomoku.id;
        console.log("Continuing game with id '" + gomoku.id + "'");
        updateDisplay(gomoku);
        updateUrl(gomoku.id);
    }).fail(function(e) {
        if (!suppressError) alert(e.responseText);
    });
}

const playTurn = function(x, y, side, suppressError) {
    $.get("/play?id=" + (currentGame == null ? "" : currentGame.id) + "&x=" + x + "&y=" + y + "&side=" + side, function(gomoku, status) {
        updateDisplay(gomoku);
    }).fail(function(e) {
        if (!suppressError) alert(e.responseText);
    });
}

const restartGame = function(suppressError) {
    $.get("/restart?id=" + (currentGame == null ? "" : currentGame.id), function(gomoku, status) {
        updateDisplay(gomoku);
    }).fail(function(e) {
        if (!suppressError) alert(e.responseText);
    });
}

const chat = function(side, text, suppressError) {
    chat_input.value = "";
    $.get("/chat?id=" + (currentGame == null ? "" : currentGame.id) + "&side=" + side + "&text=" + text, function(gomoku, status) {
        updateChats(gomoku);
    }).fail(function(e) {
        if (!suppressError) alert(e.responseText);
    });
}


/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
const getParams = function(url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
};

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
