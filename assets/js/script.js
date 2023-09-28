document.addEventListener('DOMContentLoaded', function() {

    // -------- Flipping cards
    let cards = document.querySelectorAll('.card');
    for (let card of cards) {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    }

    /**
     * Adding symbols to the cards with the right amount of pairs based on chosen difficulty. 
     * The symbols are cloned with spread operator and shuffled with sort method.
     */
function generateSymbols(difficulty) {
    let symbols = ["fa-solid fa-hippo", "fa-solid fa-dog", "fa-solid fa-otter", "fa-solid fa-cow", "fa-solid fa-fish", "fa-solid fa-dragon","fa-solid fa-kiwi-bird", "fa-solid fa-worm", "fa-solid fa-spider", "fa-solid fa-shrimp", "fa-solid fa-mosquito", "fa-solid fa-locust", "fa-solid fa-horse-head", "fa-solid fa-horse","fa-solid fa-frog", "fa-solid fa-dove", "fa-solid fa-crow", "fa-solid fa-cat","fa-solid fa-bugs"];

    let numbersOfPairs;
    switch (difficulty) {
        case 'easy':
            numbersOfPairs = 1;
            break;
        case 'medium':
            numbersOfPairs = 8;
            break;
        case 'hard':
            numbersOfPairs = 12;
            break;
    }

    let selectedSymbols = symbols.slice(0, numbersOfPairs);

    let gameSymbols = [...selectedSymbols, ...selectedSymbols];

    gameSymbols.sort(() => Math.random() - 0.5);

    return gameSymbols;
}
    /**
     * Redirect player to right page with right amount of cards and pairs
     * based on chosen difficulty.
     */
    document.getElementById('start-game').addEventListener('click', function() {
        let difficulty = document.getElementById('difficulty').value;
        startGame(difficulty);
    });
    document.getElementById('start-game').addEventListener('click', function() {
        let selectedPage = document.getElementById('difficulty').value;
        window.location.href = selectedPage;
    });
        
        if (window.location.pathname.includes('easy-game.html')) {
        } else if (window.location.pathname.includes('medium-game.html')) {

        } else if (window.location.pathname.includes('hard-game.html')) {}

});


function removePair() {

}

function checkCards() {

}

function choseTheme() {

}
function countMoves() {

}

function timer() {

}
