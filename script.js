/* ==================== MENÚ MÓVIL ==================== */
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

/* Mostrar menú */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/* Ocultar menú */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/* Cerrar menú al hacer clic en un enlace */
const navLinks = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLinks.forEach(n => n.addEventListener('click', linkAction));


/* ==================== CAMBIAR FONDO DEL HEADER AL HACER SCROLL ==================== */
function scrollHeader() {
    const header = document.querySelector('.header');
    if (this.scrollY >= 50) {
        header.classList.add('header-scroll');
    } else {
        header.classList.remove('header-scroll');
    }
}
window.addEventListener('scroll', scrollHeader);


/* ==================== ANIMACIONES DE APARICIÓN AL HACER SCROLL ==================== */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

const elementsToAnimate = document.querySelectorAll('.section__title, .section__subtitle, [class*="__container"], .socials__grid');
elementsToAnimate.forEach((el) => observer.observe(el));


/* ==================== ANIMACIÓN Y CONTROL DE AUDIO (NUEVO) ==================== */
const audios = document.querySelectorAll('.music__audio');

audios.forEach(audio => {
    // Al reproducir un audio
    audio.addEventListener('play', () => {
        // Pausar todos los demás audios
        audios.forEach(a => {
            if (a !== audio) {
                a.pause();
            }
        });
        
        // Agregar la clase 'playing' a su tarjeta correspondiente
        const imageContainer = audio.closest('.music__card').querySelector('.music__image-container');
        imageContainer.classList.add('playing');
    });

    // Al pausar el audio
    audio.addEventListener('pause', () => {
        const imageContainer = audio.closest('.music__card').querySelector('.music__image-container');
        imageContainer.classList.remove('playing');
    });

    // Al terminar la canción
    audio.addEventListener('ended', () => {
        const imageContainer = audio.closest('.music__card').querySelector('.music__image-container');
        imageContainer.classList.remove('playing');
    });
});