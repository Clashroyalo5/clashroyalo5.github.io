// Archivo: js/main.js
document.addEventListener('DOMContentLoaded', () => {

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        // 1. Mostrar/Ocultar menú al hacer clic en la hamburguesa
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav-menu-visible');

            // Cambiar el ícono (Opcional pero recomendado)
            if (navMenu.classList.contains('nav-menu-visible')) {
                navToggle.innerHTML = '&times;'; // Ícono 'X'
                navToggle.setAttribute('aria-label', 'Cerrar menú');
            } else {
                navToggle.innerHTML = '&#9776;'; // Ícono '☰'
                navToggle.setAttribute('aria-label', 'Abrir menú');
            }
        });

        // 2. Ocultar el menú si se hace clic en un enlace (para SPAs)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('nav-menu-visible')) {
                    navMenu.classList.remove('nav-menu-visible');
                    navToggle.innerHTML = '&#9776;';
                    navToggle.setAttribute('aria-label', 'Abrir menú');
                }
            });
        });
    }
});