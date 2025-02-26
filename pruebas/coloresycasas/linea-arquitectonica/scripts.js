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



    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
    
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    
        // Burger Animation
        burger.classList.toggle('toggle');
    });
    
    
    
    
    
    
    
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
        if (scrollTop > lastScrollTop) {
            // Scroll hacia abajo, esconder navbar
            navbar.classList.add('navbar-hidden');
        } else {
            // Scroll hacia arriba, mostrar navbar
            navbar.classList.remove('navbar-hidden');
        }
    
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evita que lastScrollTop sea negativo
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
    

