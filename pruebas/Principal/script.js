// script.js

// Smooth scrolling for navigation links
document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for sticky header height
                behavior: 'smooth'
            });
        }
    });
});

// Hero Slider
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function changeSlide(n) {
    slideIndex = (slideIndex + n + totalSlides) % totalSlides;
    showSlide(slideIndex);
}

// Auto-play slider (optional)
let slideInterval;
function startSlider() {
    stopSlider(); // Clear existing interval
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

function stopSlider() {
    clearInterval(slideInterval);
}

// Initialize slider
if (slides.length > 0) {
    showSlide(slideIndex);
    startSlider(); // Start auto-play

    // Optional: Pause slider on hover
    const heroSlider = document.querySelector('.hero-slider');
    if(heroSlider) {
        heroSlider.addEventListener('mouseenter', stopSlider);
        heroSlider.addEventListener('mouseleave', startSlider);
    }
}

// Puedes agregar más interactividad aquí, como:
// - Un modal para el botón "Haz Tu Pedido Online" si prefieres no enlazar directamente a WhatsApp.
// - Filtros para el menú.
// - Animaciones al hacer scroll.

console.log("Página de Papi Quiero Pizza Ya, cargada");

document.addEventListener("DOMContentLoaded", () => {
    const imageWrappers = document.querySelectorAll(".image-wrapper");
    let selectedIndex = null;

    imageWrappers.forEach((wrapper, index) => {
        const image = wrapper.querySelector(".menu-image");
        const menuContent = wrapper.querySelector(".menu-content");

        image.addEventListener("click", () => {
            if (selectedIndex === index) {
                menuContent.style.display = "none";
                image.classList.remove("selected");
                selectedIndex = null;
            } else {
                document.querySelectorAll(".menu-content").forEach(content => {
                    content.style.display = "none";
                });
                document.querySelectorAll(".menu-image").forEach(img => {
                    img.classList.remove("selected");
                });

                menuContent.style.display = "block";
                menuContent.classList.add("fade-in");
                image.classList.add("selected");
                selectedIndex = index;
            }
        });
    });
});