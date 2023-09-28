// Flipping cards
let cards = document.getElementsByClassName('card');

for (let card of cards) {
    card.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });
}

