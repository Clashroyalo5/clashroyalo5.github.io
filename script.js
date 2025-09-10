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
    // Cuando el scroll es mayor a 50 viewport height, añade la clase header-scroll
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
    threshold: 0.1 // Se activa cuando el 10% del elemento es visible
});

const elementsToAnimate = document.querySelectorAll('.section__title, .section__subtitle, [class*="__container"]');
elementsToAnimate.forEach((el) => observer.observe(el));


/* ==================== MANEJO DEL FORMULARIO DE CONTACTO ==================== */
const contactForm = document.querySelector('.contact__form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Esta línea es la que debemos eliminar su efecto.

    alert('¡Mensaje enviado con éxito! Gracias por contactarme.');
    
    contactForm.reset();
});