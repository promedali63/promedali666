// Плавное появление карточек
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(30px)';
    card.style.transition = '0.6s';
});

const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(40px)';
    card.style.transition = '0.7s';
});

window.addEventListener('scroll', () => {
    const trigger = window.innerHeight * 0.85;

    cards.forEach(card => {
        const top = card.getBoundingClientRect().top;
        if (top < trigger) {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }
    });

    featureCards.forEach(card => {
        if (card.getBoundingClientRect().top < trigger) {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }
    });
});
