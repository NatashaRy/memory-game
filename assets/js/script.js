document.addEventListener('DOMContentLoaded', function() {

    // -------- Flipping cards
    let cards = document.querySelectorAll('.card');

    for (let card of cards) {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    }

    /**
     * Determind difficulty based on page. 
     * Adding symbols to the cards with the right amount of pairs based on chosen difficulty. 
     * The symbols are cloned with spread operator and shuffled with sort method.
     */
    function generateSymbols(difficulty) {
        let symbols = ["fa-solid fa-hippo", "fa-solid fa-dog", "fa-solid fa-otter", "fa-solid fa-cow", "fa-solid fa-fish", "fa-solid fa-dragon","fa-solid fa-kiwi-bird", "fa-solid fa-worm", "fa-solid fa-spider", "fa-solid fa-shrimp", "fa-solid fa-mosquito", "fa-solid fa-locust", "fa-solid fa-horse-head", "fa-solid fa-horse","fa-solid fa-frog", "fa-solid fa-dove", "fa-solid fa-crow", "fa-solid fa-cat","fa-solid fa-bugs"];
    
        let numbersOfPairs;
        switch (difficulty) {
            case 'easy':
                numbersOfPairs = 2;
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
        console.log(`Shuffled symbols ${gameSymbols}`);
        return gameSymbols;
    }

    if (window.location.pathname.includes('easy-game.html')) {
        console.log('Easy game page loaded.');

        let shuffledSymbols = generateSymbols('easy');
        for (let i = 0; i < cards.length; i++) {
            let symbolElement = cards[i].querySelector('.symbol');
            let icon = document.createElement('i');
            icon.className = shuffledSymbols[i];
            symbolElement.appendChild(icon);
        }
    } else if (window.location.pathname.includes('medium-game.html')) {
        console.log('Medium game page loaded.');

        let shuffledSymbols = generateSymbols('medium');
        for (let i = 0; i < cards.length; i++) {
            let symbolElement = cards[i].querySelector('.symbol');
            let icon = document.createElement('i');
            icon.className = shuffledSymbols[i];
            symbolElement.appendChild(icon);
        }
    } else if (window.location.pathname.includes('hard-game.html')) {
        console.log('Hard game page loaded.');

        let shuffledSymbols = generateSymbols('hard');
        for (let i = 0; i < cards.length; i++) {
            let symbolElement = cards[i].querySelector('.symbol');
            let icon = document.createElement('i');
            icon.className = shuffledSymbols[i];
            symbolElement.appendChild(icon);
        }
    } 

    let startGameButton = document.getElementById("start-game");
    if (startGameButton) {
        startGameButton.addEventListener('click', function() {
            let difficulty = document.getElementById('difficulty').value;
            window.location.href = difficulty + '-game.html';
        });
    }
})

/**

function removePair() {

}

function checkCards() {

}

function chooseTheme() {

}
function countMoves() {

}

function timer() {

} */