// Theodore Sawyer, FEND - Project 02: 'Memory Game' / app.js / 06.30.18

// Create a list that holds all of your cards

// Create array to store cards
const cards = ['fa-diamond', 'fa-diamond',
            'fa-paper-plane-o', 'fa-paper-plane-o',
            'fa-anchor', 'fa-anchor',
            'fa-bolt', 'fa-bolt',
            'fa-cube', 'fa-cube',
            'fa-leaf', 'fa-leaf',
            'fa-bicycle', 'fa-bicycle',
            'fa-bomb', 'fa-bomb'];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 // Generates HTML card elements
function generateCard(card) {
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// added 06.24.18
let moves = 0;
const moveCounter = document.querySelector('.moves');

// added 06.24.18
let matches = 0;
const matchCounter = document.querySelector('.matches');

// added 06.24.18
let time = 0;
const gameClock = document.querySelector('.time');

function matchCount () {
    if (matches === 8) {

        // added 06.27.17
        modalPopup();
        modalSummary();
    }
}

// added 06.24.18
function gameTime() {
    clockID = setInterval(function timer() {
        time++;
        timeDisplay();
    }, 1000);
}

// added 06.24.18
function timeDisplay() {
    const min = Math.floor(time / 60);
    const sec = time % 60;

    if (sec < 10) {
        gameClock.innerText = `${min}:0${sec}`;
    } else {
        gameClock.innerText = `${min}:${sec}`;
    }
}

// added 06.26.18
function hideStar() {
    const starsList = document.querySelectorAll('.stars li');

    for (stars of starsList) {
        if (stars.style.display !== 'none') {
            stars.style.display = 'none';
            break;
        }
    }
}

// added 06.26.18
function starScore() {
    if (moves === 18 || moves === 24 || moves === 30) {
        hideStar();
    }
}

// added 06.26.18
function resetStars() {
    const starsList = document.querySelectorAll('.stars li');
    let stars = 0;

    for (stars of starsList) {
        stars.style.display = 'inline';
    }
}

// added 06.24.18
document.querySelector('.restart').addEventListener('click', resetGame);

// added 06.24.18
function resetGame() {
    moves = 0;
    matches = 0;

    clearInterval(clockID);
    time = 0;
    gameClock.innerText = "0:00";

    initGame();
    resetStars();
    gameTime();
}

//added 06.27.18
function replayGame() {

    document.querySelector('.deck').removeEventListener('click', modalPopup);
    
    moves = 0;
    matches = 0;

    clearInterval(clockID);
    time = 0;
    gameClock.innerText = "0:00";

    initGame();
    resetStars();
    gameTime();
    modalPopup();
}

// updated 06.24.18
function initGame() {
    const deck = document.querySelector('.deck');
    const cardHTML = shuffle(cards).map(function (card) {
        return generateCard(card);
    });

    moveCounter.innerHTML = `Moves: ${moves}`;
    matchCounter.innerHTML = `Matches: ${matches}`;
    deck.innerHTML = cardHTML.join('');

    // Select all cards
    const allCards = document.querySelectorAll('.card');
    let openCards = []; //openCards.length

    gameTime();

// Flip cards
allCards.forEach(function (card) {
    card.addEventListener('click', function (e) {

        if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {

            openCards.push(card);
            card.classList.add('open', 'show');

            // Check + show cards - if match
            if (openCards.length == 2) {
                if (openCards[0].dataset.card === openCards[1].dataset.card) {
                    
                    openCards[0].classList.add('match');
                    openCards[0].classList.add('open');
                    openCards[0].classList.add('show');

                    openCards[1].classList.add('match');
                    openCards[1].classList.add('open');
                    openCards[1].classList.add('show');

                    openCards = [];

                    matches += 1;
                    moveCounter.innerHTML = `Moves: ${moves}`;
                    matchCounter.innerHTML = `Matches: ${matches}`;

                    // added 06.26.18
                    matchCount();
                    
                } else {

                    // If cards don't match - hide
                    setTimeout(function () {
                        openCards.forEach(function (card) {
                            card.classList.remove('open', 'show');
                        }); 
                        openCards = [];
                    }, 500);

                    starScore();
                    moves += 1;
                    moveCounter.innerHTML = `Moves: ${moves}`;
                }
            }
        }
    });
});
}

// added 06.29.18
function modalClose() {
    document.querySelector('.deck').addEventListener('click', modalPopup);
    const modal = document.querySelector('.modal-background');
    modal.classList.toggle('modal-hide');
}

// added 06.27.18
function modalPopup() {

    clearInterval(clockID);

    // added 06.27.18
    document.querySelector('.modal-close').addEventListener('click', modalClose);
    document.querySelector('.modal-replay').addEventListener('click', replayGame);

    const modal = document.querySelector('.modal-background');
    modal.classList.toggle('modal-hide');
}

// added 06.27.18
function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

// added 06.27.18
function modalSummary() {
    const timeSummary = document.querySelector('.modal-time');
    const clockSummary = document.querySelector('.time').innerText;
    const moveSummary = document.querySelector('.modal-moves');
    
    // added 06.27.18
    const starsStat = document.querySelector('.modal-stars');
    const stars = getStars();

     // added 06.27.18
    timeSummary.innerHTML = `Time = ${clockSummary}`;
    moveSummary.innerHTML = `Moves = ${moves}`;
    
    // added 06.27.18
    starsStat.innerHTML = `Stars = ${stars}`;
}

initGame();