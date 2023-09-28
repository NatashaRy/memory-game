document.addEventListener('DOMContentLoaded', function() {
    // --------- Card functions
    let cards = document.getElementsByClassName('card');

    // Flipping cards
    for (let card of cards) {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    }

    // Animal symbols
    let symbols = ["fa-solid fa-hippo", "fa-solid fa-dog", "fa-solid fa-otter", "fa-solid fa-cow", "fa-solid fa-fish", "fa-solid fa-dragon","fa-solid fa-kiwi-bird", "fa-solid fa-worm", "fa-solid fa-spider", "fa-solid fa-shrimp", "fa-solid fa-mosquito", "fa-solid fa-locust", "fa-solid fa-horse-head", "fa-solid fa-horse","fa-solid fa-frog", "fa-solid fa-dove", "fa-solid fa-crow", "fa-solid fa-cat","fa-solid fa-bugs"];

    /** Double the symbols for pair and shuffles them
    symbols = shuffle([...symbols, ...symbols]);

    Assign symbols to cards
    cards.forEach((card , index) => {
        let symbolElement = card.querySelector('.symbol');
        let icon = document.createElement('i');
        icon.className = symbols[index];
        symbolElement.appendChild(icon);
    });
} */