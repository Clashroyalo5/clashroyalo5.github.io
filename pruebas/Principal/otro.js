window.addEventListener("load", function() {
    const loader = document.getElementById("loader");
    const wrapper = document.getElementById("loader-wrapper");
    const warning = document.getElementById("connection-warning");

    // Mostrar advertencia después de 4 segundos si la página sigue cargando
    const warningTimeout = setTimeout(function() {
        warning.style.display = "block";
    }, 4000);

    // Detectar cuando termina la animación del pizzero
    document.getElementById("pizzero").addEventListener("animationend", function() {
        wrapper.style.transform = "translateY(-100%)"; // Mueve el fondo hacia arriba
        document.getElementById("content").style.display = "block"; // Muestra el contenido
        
        // Cancela el mensaje de advertencia si ya cargó
        clearTimeout(warningTimeout);

        // Espera 1 segundo para que la transición termine antes de ocultar el wrapper
        setTimeout(function() {
            wrapper.style.display = "none";
        }, 1000);
    });
});
