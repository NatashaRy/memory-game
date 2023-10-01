document.addEventListener('DOMContentLoaded', function() {

    // ------------ Global variables
    let cards = document.querySelectorAll('.card');
    let movesCount = 0;
    let countFlippedCards = 0;
    let flippedCards = [];

    
    /**
     * Limit the player to only be able to flip two cards at the same time.
     * 1,5 seconds delay before flipping cards back if no match is found.
     */
    for (let card of cards) {
        card.addEventListener('click', function() {
            if (countFlippedCards == 2) {
                return;
            }

            this.classList.toggle('flipped');
            flippedCards.push(this);
            console.log('Cards have been flipped')
            countFlippedCards++;
            console.log('Flipps are counted')

            if (countFlippedCards == 2) {
                setTimeout(() => {
                    checkMatch();
                }, 1200);
            }
        });
    }

    /**
     * Compare flipped cards.
     * If a match is found the pairs are removed, otherwise the cards are flipped back over.
     * Moves are counted.
     */
    function checkMatch() {
            if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
            flippedCards[0].remove();
            flippedCards[1].remove();
        } else {
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
        }

        countFlippedCards = 0;
        flippedCards = [];
        movesCount++;
        updateMoves();
    }

    /**
     *  Updates moves displayed on game page. 
     */
    function updateMoves() {
        let moves = document.getElementById('moves');
            moves.textContent = movesCount;
        }

    // -------- Sets of different themes of symbols player can choose from.
    let themes = {
        animals: ["fa-solid fa-hippo", "fa-solid fa-dog", "fa-solid fa-otter", "fa-solid fa-cow", "fa-solid fa-fish", "fa-solid fa-dragon","fa-solid fa-kiwi-bird", "fa-solid fa-worm", "fa-solid fa-spider", "fa-solid fa-shrimp", "fa-solid fa-mosquito", "fa-solid fa-locust", "fa-solid fa-horse-head", "fa-solid fa-horse","fa-solid fa-frog", "fa-solid fa-dove", "fa-solid fa-crow", "fa-solid fa-cat","fa-solid fa-bugs"],
        foods: ["fa-solid fa-carrot", "fa-solid fa-burger", "fa-solid fa-cookie", "fa-solid fa-drumstick-bite", "fa-solid fa-ice-cream", "fa-solid fa-pizza-slice", "fa-solid fa-bacon", "fa-solid fa-egg", "fa-solid fa-mug-hot", "fa-solid fa-martini-glass-citrus", "fa-solid fa-cheese", "fa-solid fa-champange-glasses", "fa-solid fa-candy-cane", "fa-solid fa-cake-candles", "fa-solid fa-bread-slice", "fa-solid fa-bowl-rice"],
        sports: ["fa-solid fa-baseball-bat-ball", "fa-solid fa-baseball", "fa-solid fa-table-tennis-paddle-ball", "fa-solid fa-person-swimming", "fa-solid fa-person-snowboarding", "fa-solid fa-golf-ball-tee","fa-solid fa-futbol", "fa-solid fa-football", "fa-solid fa-bowling-ball", "fa-solid fa-basketball", "fa-solid fa-person-biking", "fa-solid fa-person-running", "fa-solid fa-person-skating", "fa-solid fa-person-skiing","fa-solid fa-dumbbell", "fa-solid fa-bicycle", "fa-solid fa-hockey-puck", "fa-solid fa-volleyball","fa-solid fa-stopwatch-20"]
    };

    /**
     * Determind difficulty based on page.
     * Generate symbols based on chosen theme.
     * Adding symbols to the cards with the right amount of pairs based on chosen difficulty. 
     * The symbols are cloned with spread operator and shuffled with sort method.
     */
    function generateSymbols(difficulty, theme) {
        let symbols = themes[theme];
    
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

    let urlParams = new URLSearchParams(window.location.search);
    let theme = urlParams.get('theme');

    if (window.location.pathname.includes('easy-game.html')) {
        console.log('Easy game page loaded.');

        let shuffledSymbols = generateSymbols('easy', theme);
        for (let i = 0; i < cards.length; i++) {
            let symbolElement = cards[i].querySelector('.symbol');
            let icon = document.createElement('i');
            icon.className = shuffledSymbols[i];
            symbolElement.appendChild(icon);
            console.log(`Symbols: ${shuffledSymbols}`);
        }
    } else if (window.location.pathname.includes('medium-game.html')) {
        console.log('Medium game page loaded.');

        let shuffledSymbols = generateSymbols('medium', theme);
        for (let i = 0; i < cards.length; i++) {
            let symbolElement = cards[i].querySelector('.symbol');
            let icon = document.createElement('i');
            icon.className = shuffledSymbols[i];
            symbolElement.appendChild(icon);
            console.log(`Symbols: ${shuffledSymbols}`);
        }
    } else if (window.location.pathname.includes('hard-game.html')) {
        console.log('Hard game page loaded.');

        let shuffledSymbols = generateSymbols('hard', theme);
        for (let i = 0; i < cards.length; i++) {
            let symbolElement = cards[i].querySelector('.symbol');
            let icon = document.createElement('i');
            icon.className = shuffledSymbols[i];
            symbolElement.appendChild(icon);
            console.log(`Symbols: ${shuffledSymbols}`);
        }
    } 

    let startGameButton = document.getElementById("start-game");
    if (startGameButton) {
        startGameButton.addEventListener('click', function() {
            let difficulty = document.getElementById('difficulty').value;
            let theme = document.getElementById('theme').value;
            window.location.href = difficulty + '-game.html?theme=' + theme;
        });
    }
})

/**

function countMoves() {

}

function timer() {

} */