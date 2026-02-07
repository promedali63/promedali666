// Плавное появление карточек
const cards = document.querySelectorAll('.feature-card');
cards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(30px)';
    card.style.transition = '0.6s';
});

const featureCards = document.querySelectorAll('.feature-card');

 featureCards.forEach(card => {
        if (card.getBoundingClientRect().top < trigger) {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }
    });
