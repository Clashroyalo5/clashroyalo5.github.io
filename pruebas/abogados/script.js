document.addEventListener('DOMContentLoaded', () => {
    
    // Selecciona el botón de hamburguesa y el menú de navegación
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Añade un evento "click" al botón
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            // Alterna la clase 'active' en el menú
            navMenu.classList.toggle('active');
            
            // Cambia el icono de hamburguesa a una 'X' y viceversa
            const icon = navToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Opcional: Cierra el menú móvil cuando se hace clic en un enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.querySelector('i').classList.remove('fa-times');
                navToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

});

document.getElementById('productsBtn').addEventListener('click', function() {
document.getElementById('productsModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
document.getElementById('productsModal').style.display = 'none';
});

window.onclick = function(event) {
if (event.target == document.getElementById('productsModal')) {
  document.getElementById('productsModal').style.display = 'none';
}
};