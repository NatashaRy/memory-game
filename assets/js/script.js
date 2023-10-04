document.addEventListener('DOMContentLoaded', function() {

    /**
     * Global variables.
     */
    let cards = document.querySelectorAll('.card');
    let movesCount = 0;
    let countFlippedCards = 0;
    let flippedCards = [];
    let startTime;
    let timerInterval;
    let countMatchingPairs = 0;
    let difficulty;

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


     /**
      * Records the current time and set up inteval that calls updateTimer() every 10 milliseconds.
      */
    function startTimer() {
        startTime = Date.now() - (0 * 1000);
        timerInterval = setInterval(updateTimer, 10);
    }

    /**
     * Updating the time and stop the timer when all pairs are matched.
     * The timer display format is MM:SS:ss and updates every 10 milliseconds.
     */
    function updateTimer() {
        const currentTime = Date.now() - startTime;
        const totalMilliseconds = currentTime;
        const totalSeconds = Math.floor(totalMilliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const hundredths = Math.floor((totalMilliseconds % 1000) /10);
    
        document.getElementById('timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
    }

    /**
     * Plays audio file automatically if audio is enabled.
     * @param {Audio} audioObj 
     */
    function playSound(audioObj) {
        if (sessionStorage.getItem('audioEnabled') === 'true') {
            audioObj.play();
        }
    }

    /**
     * When start game-button is clicked the users sound choice will be stored in the session storage.
     * The users choices of theme and difficulty will be retived and the user redirects to the game based on the chosen theme and difficulty.
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
     * Manages the flipping card logic, sound effects and checks matches in the game.
     * Invoke the startTimer funciton if the timerInterval have not started.
     * Counts the number of flipped cards in the game and limit it to two flipped cards in one attempt.
     * If the user chosen to play with sound the flip sound will be played.
     * Alert the user if the same card is tried to flip twice in a row and flip the cards back after 1,2 seconds if two cards are flipped without a match.
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
     * When a card is clicked and the createCardClicked() is invoked ant it creates and returns a new function. 
     * The new function, will call the cardClicked() function when invoked.
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
     * Checks if the flipped cards value are a match and counts the numbers of matching pairs, to see if all pairs are matched.
     * If the player chosen to use sound the sounds for match/nomatch will be played.
     * Number of attempts are counted and invokes the updateMoves for displaying the total moves.
     * Resets the array of flipped cards to empty.
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
     * Determind difficulty based on page and generates symbols based on chosen theme.
     * Symbols are cloned with spread operator and shuffled with sort method. 
     * Amount of pairs are based on chosen difficulty. 
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
     * Total time, moves and difficulty level will be stored in the session storage.
     */
    function allPairsMatched() {
        const totalTime = document.getElementById('timer').textContent;
        sessionStorage.setItem('totalTime', totalTime);
        sessionStorage.setItem('totalMoves', movesCount.toString());
        sessionStorage.setItem('level', difficulty.toString());
        window.location.href = ('results.html');
    }
    /**
     * Gets the total time, moves and difficulty level from the session storage.
     * Cherring sound is played if the user has chosen to play with sound.
     * The stored items are displayed on the results page. 
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