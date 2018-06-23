// Starting Variables

let symbols = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

let opened = [];
let matched = 0;
let movesMeter = 0;
let starsNumber = 3;
let timeTable = {
    seconds: 0,
    minutes: 0,
    timeClear: -1
};


var popup = $("#win-popup");


// Shuffle function
function shuffle(array) {
    var currentidx = array.length, temporaryValue, randomidx;

    while (currentidx !== 0) {
        randomidx = Math.floor(Math.random() * currentidx);
        currentidx -= 1;
        temporaryValue = array[currentidx];
        array[currentidx] = array[randomidx];
        array[randomidx] = temporaryValue;
    }

    return array;
};



// Increments App
var basictimeTable = function() {
    if (timeTable.seconds > 58) {
        timeTable.minutes = timeTable.minutes +1;
        timeTable.seconds = 0;
    } else {
        timeTable.seconds = timeTable.seconds +1;
    }
    var basicDigit = "0";
    if (timeTable.seconds < 10) {
        basicDigit = basicDigit + timeTable.seconds;
    } else {
        basicDigit = String(timeTable.seconds);
    }
    var time = String(timeTable.minutes) + ":" + basicDigit;
    $(".timeTable").text(time);
};

// Resets timeTable state | 2 seconds delay once restarting / refreshing the page
function timeTableReset() {
    clearInterval(timeTable.timeClear);
    timeTable.seconds = 0;
    timeTable.minutes = 0;
    $(".timeTable").text("0:00");
    timeTable.timeClear = setInterval(basictimeTable, 1000);
};

// Cards updating in the HTML code
function cardsUpdate() {
    var idx = 0;
    symbols = shuffle(symbols);
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + symbols[idx]);
      idx++;
    });
    timeTableReset();
};

// Decrements the difficulty by removing one fa-star icon
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    starsNumber--;
    $(".num-stars").text(String(starsNumber));
};

// Resets the level of the game (maximmum number of stars)
function levelReset() {
    $(".fa-star-o").attr("class", "fa fa-star");
    starsNumber = 3;
    $(".num-stars").text(String(starsNumber));
};

// Increments the movesMeter and adjusts the current skill level of the player
function moveUpdate() {
    $(".moves").text(movesMeter);
    if (movesMeter === 12 || movesMeter === 18) {
        removeStar();
    }
};

// function Verifies if the card was either opened or matched
function verified(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};

// function that verifies if the opened decks belong to the same class
function matchChecker() {
    if (opened[1].children().attr("class")===opened[0].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};


// Sets currently opened cards to the match state, checks win condition
var setMatch = function() {
    opened.forEach(function(card) {
        card.addClass("match");
    });
    opened = [];
    matched = matched + 2;

    if (matched == 16) {
        clearInterval(timeTable.timeClear);
        popup.css("display", "block");
    }
};


// Sets currently open cards back to default state
var resetOpen = function() {
    opened.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    opened = [];
};

// Sets selected card to the open and shown state
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        opened.push(card);
    }
};


// Resets all game state variables and resets all required HTML to default state
var resetGame = function() {
    opened = [];
    matched = 0;
    movesMeter = 0;
    timeTableReset();
    moveUpdate();
    $(".card").attr("class", "card");
    cardsUpdate();
    levelReset();
};


// Handles primary game logic of game
var otherSide = function() {
    if (verified( $(this) )) {

        if (opened.length === 0) {
            openCard( $(this) );

        } else if (opened.length === 1) {
            openCard( $(this) );
            movesMeter = movesMeter +1;
            moveUpdate();

            if (matchChecker()) {
                setTimeout(setMatch, 500);

            } else {
                setTimeout(resetOpen, 500);

            }
        }
    }
};

// Restarts the html page to the starting state
var playAgain = function() {
    resetGame();
    popup.css("display", "none");
};



$(".card").click(otherSide);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);
$(cardsUpdate);
