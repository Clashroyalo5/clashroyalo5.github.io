// Ejemplo de animación para el botón al hacer clic
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 600);
    });
});

window.addEventListener("load", function() {
    const loader = document.getElementById("loader");
    const wrapper = document.getElementById("loader-wrapper");
    const warning = document.getElementById("connection-warning");

    // Mostrar advertencia después de 4 segundos si la página sigue cargando
    const warningTimeout = setTimeout(function() {
        warning.style.display = "block";
    }, 4000);

    loader.addEventListener("animationiteration", function() {
        // Una vez que se complete la vuelta actual, realiza la transición hacia arriba
        wrapper.style.transform = "translateY(-100%)"; // Mueve el fondo hacia arriba
        document.getElementById("content").style.display = "block"; // Muestra el contenido
        
        // Cancela el mensaje de advertencia si ya cargó
        clearTimeout(warningTimeout);

        // Espera 1 segundo para que la transición termine antes de ocultar el wrapper
        setTimeout(function() {
            wrapper.style.display = "none";
        }, 1000);
    });

    // Desactiva la animación infinita cuando la página está completamente cargada
    loader.style.animationIterationCount = "1";
});

let currentIndex = 0;
const slides = document.querySelectorAll('.carousel ul li');
const totalSlides = slides.length;

function moveSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    const translateValue = -currentIndex * 100 + '%';
    document.querySelector('.carousel ul').style.transform = `translateX(${translateValue})`;
}

setInterval(moveSlide, 3000); // Cambia de imagen cada 4,5 segundos
