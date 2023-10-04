document.addEventListener('DOMContentLoaded', function() {

    /**
     * Global variables.
     */
    const startGameButton = document.getElementById('start-game');
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');
    const flipSound = new Audio('assets/sounds/flip.mp3');
    const matchSound = new Audio('assets/sounds/match.mp3');
    const nomatchSound = new Audio('assets/sounds/nomatch.mp3');
    const cheeringSound = new Audio('assets/sounds/cheering.mp3');
    const themes = {
        animals: ["fa-solid fa-hippo", "fa-solid fa-dog", "fa-solid fa-otter", "fa-solid fa-cow", "fa-solid fa-fish", "fa-solid fa-dragon","fa-solid fa-kiwi-bird", "fa-solid fa-worm", "fa-solid fa-spider", "fa-solid fa-shrimp", "fa-solid fa-mosquito", "fa-solid fa-locust", "fa-solid fa-horse-head", "fa-solid fa-horse","fa-solid fa-frog", "fa-solid fa-dove", "fa-solid fa-crow", "fa-solid fa-cat","fa-solid fa-bugs"],
        foods: ["fa-solid fa-carrot", "fa-solid fa-burger", "fa-solid fa-cookie", "fa-solid fa-drumstick-bite", "fa-solid fa-ice-cream", "fa-solid fa-pizza-slice", "fa-solid fa-bacon", "fa-solid fa-egg", "fa-solid fa-mug-hot", "fa-solid fa-martini-glass-citrus", "fa-solid fa-cheese", "fa-solid fa-candy-cane", "fa-solid fa-cake-candles", "fa-solid fa-bread-slice", "fa-solid fa-bowl-rice"],
        sports: ["fa-solid fa-baseball-bat-ball", "fa-solid fa-baseball", "fa-solid fa-table-tennis-paddle-ball", "fa-solid fa-person-swimming", "fa-solid fa-person-snowboarding", "fa-solid fa-golf-ball-tee","fa-solid fa-futbol", "fa-solid fa-football", "fa-solid fa-bowling-ball", "fa-solid fa-basketball", "fa-solid fa-person-biking", "fa-solid fa-person-running", "fa-solid fa-person-skating", "fa-solid fa-person-skiing","fa-solid fa-dumbbell", "fa-solid fa-bicycle", "fa-solid fa-hockey-puck", "fa-solid fa-volleyball","fa-solid fa-stopwatch-20"]
    };

    let cards = document.querySelectorAll('.card');
    let movesCount = 0;
    let countFlippedCards = 0;
    let flippedCards = [];
    let startTime;
    let timerInterval;
    let countMatchingPairs = 0;
    let difficulty;

    /**
     * Records the current time and set up interval that calls updateTimer() every 10 milliseconds.
     */
    function startTimer() {
        startTime = Date.now() - (0 * 1000);
        timerInterval = setInterval(updateTimer, 10);
    }

    /**
     * Updating the time and stopping the timer when all pairs are matched. 
     */
    function updateTimer() {
        const currentTime = Date.now() - startTime;
        const totalMilliseconds = currentTime;
        const totalSeconds = Math.floor(totalMilliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const hundredths = Math.floor((totalMilliseconds % 1000) /10);
    
        document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(hundredths).padStart(2, '0')}`;
    }

    /**
     * Plays audio files automatically if audio is enabled.
     * @param {Audio} audioObj 
     */
    function playSound(audioObj) {
        if (sessionStorage.getItem('audioEnabled') === 'true') {
            audioObj.play();
        }
    }

    /**
     * Users' sound choice is stored in the session storage.  
     *  Users' choices of theme and difficulty will be retrieved and the user redirected to the game based on the theme and difficulty.
     */
    if (startGameButton) {
        startGameButton.addEventListener('click', function() {
            const soundChoice = document.getElementById('sound').value;
            if (soundChoice === 'yes') {
                sessionStorage.setItem('audioEnabled', 'true');
            } else {
                sessionStorage.setItem('audioEnabled', 'false');
            }

            const difficulty = document.getElementById('difficulty').value;
            const theme = document.getElementById('theme').value;
            window.location.href = difficulty + '-game.html?theme=' + theme;
        });
    }

    /**
     * Flip clicked cards, alert the user if same card is clicked twice and limit the user to only flip two cards in one attempt.
     * Plays flip sound if audio is enabled.
     * 
     * @param {HTMLElement} card 
     * @returns {void}
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
            Swal.fire({
                position: "center",
                icon: "error",
                title: "You already selected this card!",
                showConfirmButton: false,
                timer: 1500,
            });
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

    /**
     * Creates and returns a new function that calls cardClicked() when invoked.
     * 
     * @param {Element} card 
     * @returns {Function}
     */
    function createCardClicked(card) {
        return function() {
            cardClicked(card);
        };
    }

    for (let card of cards) {
        card.addEventListener('click', createCardClicked(card));
    }

    /**
     * Check flipped cards for matching values and count the number of matching pairs, update number of moves and resets flipped cards to empty.
     * Plays sound if audio is enabled.
     * 
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
        updateMoves();
        
        if (countMatchingPairs === cards.length / 2) {
            allPairsMatched();
        }

        countFlippedCards = 0;
        flippedCards = [];
    }

    /**
     * Update the total moves displayed.
     */
    function updateMoves() {
        let moves = document.getElementById('moves');
            moves.textContent = movesCount;
        }
    
    /**
     * Generates and clone right amount of symbols on cards based on chosen theme and difficulty. 
     * Difficulty is determined based on page.
     * 
     * @param {string} difficulty 
     * @param {string} theme 
     * @returns {string[]}
     */
    function generateSymbols(difficulty, theme) {
        const symbols = themes[theme];
        
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

        const selectedSymbols = symbols.slice(0, numbersOfPairs);
        const gameSymbols = [...selectedSymbols, ...selectedSymbols];
        
        gameSymbols.sort(() => Math.random() - 0.5);
        return gameSymbols;
    }

    if (window.location.pathname.includes('easy-game.html')) {
        difficulty = 'Easy';

        const shuffledSymbols = generateSymbols('easy', theme);
        for (let i = 0; i < cards.length; i++) {
            const symbolElement = cards[i].querySelector('.symbol');
            const icon = document.createElement('i');
            icon.className = shuffledSymbols[i];
            symbolElement.appendChild(icon);

        }
    } else if (window.location.pathname.includes('medium-game.html')) {
        difficulty = 'Medium';

        const shuffledSymbols = generateSymbols('medium', theme);
        for (let i = 0; i < cards.length; i++) {
            const symbolElement = cards[i].querySelector('.symbol');
            const icon = document.createElement('i');
            icon.className = shuffledSymbols[i];
            symbolElement.appendChild(icon);

        }
    } else if (window.location.pathname.includes('hard-game.html')) {
        difficulty = 'Hard';

        const shuffledSymbols = generateSymbols('hard', theme);
        for (let i = 0; i < cards.length; i++) {
            const symbolElement = cards[i].querySelector('.symbol');
            const icon = document.createElement('i');
            icon.className = shuffledSymbols[i];
            symbolElement.appendChild(icon);

        }
    } 

    /**
     * Check if all pairs are matched, if yes, the user is redirected to results page.
     * Stores total time, moves and difficulty level in the session storage.
     */
    function allPairsMatched() {
        const totalTime = document.getElementById('timer').textContent;
        sessionStorage.setItem('totalTime', totalTime);
        sessionStorage.setItem('totalMoves', movesCount.toString());
        sessionStorage.setItem('level', difficulty.toString());
        window.location.href = ('results.html');
    }
    /**
     * Gets and display the total time, moves and difficulty level from the session storage.
     * Plays cheering sound if audio is enabled.
     */
    function displayResults() {
        if (window.location.pathname.includes('results.html')) {
            const storedTotalTime = sessionStorage.getItem('totalTime');
            const storedTotalMoves = sessionStorage.getItem('totalMoves');
            const storedLevel = sessionStorage.getItem('level');

            if (storedTotalTime && storedTotalMoves && storedLevel) {
                document.getElementById('total-moves').textContent = storedTotalMoves;
                document.getElementById('total-time').textContent = storedTotalTime;
                document.getElementById('level').textContent = storedLevel;
            }
            playSound(cheeringSound);
        }
    }
    displayResults();
});