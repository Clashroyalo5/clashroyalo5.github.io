let currentIndex = 0;
const slides = document.querySelectorAll('.carousel ul li');
const totalSlides = slides.length;

function moveSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    const translateValue = -currentIndex * 100 + '%';
    document.querySelector('.carousel ul').style.transform = `translateX(${translateValue})`;
}

setInterval(moveSlide, 4500); // Cambia de imagen cada 4,5 segundos