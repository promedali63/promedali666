@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Montserrat', sans-serif;
    background: radial-gradient(circle at top, #1f1f1f, #0e0e0e);
    color: #f5e7c4;
    overflow-x: hidden;
}

/* Золотая текстура */
h1, h2, .logo {
    background: linear-gradient(120deg, #f7d774, #d4af37, #fff1b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.bg-glow {
    position: fixed;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(212,175,55,0.15), transparent 70%);
    top: -200px;
    right: -200px;
    filter: blur(80px);
    z-index: -1;
}

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    padding: 25px 60px;
    align-items: center;
}

.logo {
    font-size: 28px;
    font-weight: 700;
}

.logo span {
    color: #fff;
}

nav a {
    margin-left: 25px;
    color: #f5e7c4;
    text-decoration: none;
    transition: 0.3s;
}

nav a:hover {
    color: #d4af37;
}

/* Hero */
.hero {
    text-align: center;
    padding: 120px 20px;
}

.hero h1 {
    font-size: 48px;
    margin-bottom: 20px;
}

.hero span {
    font-weight: 300;
}

.hero button {
    margin-top: 30px;
    padding: 15px 40px;
    background: linear-gradient(120deg, #d4af37, #f7d774);
    border: none;
    color: #000;
    font-size: 16px;
    cursor: pointer;
    border-radius: 30px;
    transition: 0.3s;
}

.hero button:hover {
    transform: scale(1.05);
}

/* Sections */
.section {
    padding: 100px 60px;
    text-align: center;
}

.section.dark {
    background: rgba(255,255,255,0.03);
}

/* Cards */
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 25px;
    margin-top: 50px;
}

.card {
    padding: 40px;
    border: 1px solid rgba(212,175,55,0.3);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    transition: 0.3s;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 30px rgba(212,175,55,0.2);
}

/* Steps */
.steps {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 50px;
    flex-wrap: wrap;
}

.steps div {
    padding: 25px 35px;
    border: 1px solid rgba(212,175,55,0.3);
    border-radius: 20px;
}

/* Footer */
footer {
    padding: 40px;
    text-align: center;
    font-size: 14px;
    opacity: 0.7;
}
// Плавное появление блоков
const cards = document.querySelectorAll('.card');

window.addEventListener('scroll', () => {
    const trigger = window.innerHeight * 0.85;

    cards.forEach(card => {
        const top = card.getBoundingClientRect().top;
        if (top < trigger) {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }
    });
});

// Начальные стили
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

    featureCards.forEach(card => {
        if (card.getBoundingClientRect().top < trigger) {
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }
    });
});
