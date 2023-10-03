document.addEventListener('DOMContentLoaded', function() {

    // ------------ Global variables   
    let cards = document.querySelectorAll('.card');
    let movesCount = 0;
    let countFlippedCards = 0;
    let flippedCards = [];
    let startTime;
    let timerInterval;
    let countMatchingPairs = 0;
    let difficulty;

    const flipSound = new Audio('assets/sounds/flip.mp3');
    const matchSound = new Audio('assets/sounds/match.mp3');
    const nomatchSound = new Audio('assets/sounds/nomatch.mp3');
    const cheeringSound = new Audio('assets/sounds/cheering.mp3');
    const themes = {
        animals: ["fa-solid fa-hippo", "fa-solid fa-dog", "fa-solid fa-otter", "fa-solid fa-cow", "fa-solid fa-fish", "fa-solid fa-dragon","fa-solid fa-kiwi-bird", "fa-solid fa-worm", "fa-solid fa-spider", "fa-solid fa-shrimp", "fa-solid fa-mosquito", "fa-solid fa-locust", "fa-solid fa-horse-head", "fa-solid fa-horse","fa-solid fa-frog", "fa-solid fa-dove", "fa-solid fa-crow", "fa-solid fa-cat","fa-solid fa-bugs"],
        foods: ["fa-solid fa-carrot", "fa-solid fa-burger", "fa-solid fa-cookie", "fa-solid fa-drumstick-bite", "fa-solid fa-ice-cream", "fa-solid fa-pizza-slice", "fa-solid fa-bacon", "fa-solid fa-egg", "fa-solid fa-mug-hot", "fa-solid fa-martini-glass-citrus", "fa-solid fa-cheese", "fa-solid fa-candy-cane", "fa-solid fa-cake-candles", "fa-solid fa-bread-slice", "fa-solid fa-bowl-rice"],
        sports: ["fa-solid fa-baseball-bat-ball", "fa-solid fa-baseball", "fa-solid fa-table-tennis-paddle-ball", "fa-solid fa-person-swimming", "fa-solid fa-person-snowboarding", "fa-solid fa-golf-ball-tee","fa-solid fa-futbol", "fa-solid fa-football", "fa-solid fa-bowling-ball", "fa-solid fa-basketball", "fa-solid fa-person-biking", "fa-solid fa-person-running", "fa-solid fa-person-skating", "fa-solid fa-person-skiing","fa-solid fa-dumbbell", "fa-solid fa-bicycle", "fa-solid fa-hockey-puck", "fa-solid fa-volleyball","fa-solid fa-stopwatch-20"]
    };

    /**
     * Timer counting how long it takes for the player to find all pairs.
     * Function includes starting timer, updating the time and stop the timer when all pairs are matched.
     * The timer display format is MM:SS:sss and updates every 10 milliseconds.
     */
    function startTimer() {
        startTime = Date.now() - (0 * 1000);
        timerInterval = setInterval(updateTimer, 10);
    }

    function updateTimer() {
        const currentTime = Date.now() - startTime;
        const totalMilliseconds = currentTime;
        const totalSeconds = Math.floor(totalMilliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = totalMilliseconds % 1000;
    
        document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }

    // ----------- Play audio effect
    function playSound(audioObj) {
        if (sessionStorage.getItem('audioEnabled') === 'true') {
            audioObj.play();
        }
    }

        /**
     * Start the game when Start game with chosen theme and difficulty when button is clicked.
     * Stores if the player want to play with or without sound.
     */

        let startGameButton = document.getElementById('start-game');
        if (startGameButton) {
            startGameButton.addEventListener('click', function() {
                let soundChoice = document.getElementById('sound').value;
                if (soundChoice === 'yes') {
                    sessionStorage.setItem('audioEnabled', 'true');
                } else {
                    sessionStorage.setItem('audioEnabled', 'false');
                }
    
                let difficulty = document.getElementById('difficulty').value;
                let theme = document.getElementById('theme').value;
                window.location.href = difficulty + '-game.html?theme=' + theme;
            });
        }

    /**
     * Prohibit the player to click the same card two times in one attempt and limits the player to only be able to flip two cards in one attempt.
     * Timer starts when first card is flipped. 1,5 seconds delay before flipping cards back if no match is found.
     */
    function cardClicked(card) {
        if (countFlippedCards == 2) {
            return;
        }

        if (!timerInterval) {
            startTimer();
        }

        playSound(flipSound);

        if (flippedCards.includes(card)) {
            alert('This card is already flipped, flip an other card.');
            return;
        }

        card.classList.toggle('flipped');
        flippedCards.push(card);

        countFlippedCards++;

        if (countFlippedCards == 2) {
            setTimeout(() => {
                checkMatch();
            }, 1200);
        }
    }
function createCardClicked(card) {
    return function() {
        cardClicked(card);
    };
}

for (let card of cards) {
    card.addEventListener('click', createCardClicked(card));
}

    /**
     * Compare flipped cards.
     * If a match is found the pairs are removed, otherwise the cards are flipped back over.
     * Moves are counted.
     */
    function checkMatch() {
        if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
            flippedCards[0].style.visibility ='hidden';
            flippedCards[1].style.visibility ='hidden';
            countMatchingPairs++;
            playSound(matchSound);
        } else {
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
            playSound(nomatchSound);
        }
        movesCount++;
        updateMoves()
        
        if (countMatchingPairs === cards.length / 2) {
            allPairsMatched();
        }

        countFlippedCards = 0;
        flippedCards = [];;
    }

    // -------- Updates moves displayed on game page. 
    function updateMoves() {
        let moves = document.getElementById('moves');
            moves.textContent = movesCount;
        }

    // -------- Sets of different themes of symbols player can choose from.


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
        difficulty = 'Easy';
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
        difficulty = 'Medium';
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
        difficulty = 'Hard';
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
    /**
     * Checks if all pairs are matched and redirect to results page.
     * Store tracked time, moves and chosen difficulty level in the session, to show on results page.
     */
    function allPairsMatched() {
        const totalTime = document.getElementById('timer').textContent;
        sessionStorage.setItem('totalTime', totalTime);
        sessionStorage.setItem('totalMoves', movesCount.toString());
        sessionStorage.setItem('level', difficulty.toString());
    
        console.log("Stored totalTime:", totalTime);
        console.log("Stored totalMoves:", movesCount);
        console.log("Stored level:", difficulty);
        
        window.location.href = ('results.html');
    }

    /**
     * Get the stored time, moves and difficulty level to display on results page.
     */
    function displayResults() {
        if (window.location.pathname.includes('results.html')) {
            let storedTotalTime = sessionStorage.getItem('totalTime');
            let storedTotalMoves = sessionStorage.getItem('totalMoves');
            let storedLevel = sessionStorage.getItem('level');

            if (storedTotalTime && storedTotalMoves && storedLevel) {
                document.getElementById('total-moves').textContent = storedTotalMoves;
                document.getElementById('total-time').textContent = storedTotalTime;
                document.getElementById('level').textContent = storedLevel;
            }
            playSound(cheeringSound);
            console.log('Played sound: Cheering.');
        }
    }
    displayResults();
});