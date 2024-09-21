// Obtener los elementos del DOM
const modal = document.getElementById("paramModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal = document.querySelector(".close");

// Abrir el modal
openModalBtn.addEventListener("click", function(event) {
    event.preventDefault();  // Evitar el comportamiento predeterminado del enlace
    modal.style.display = "block";
});

// Cerrar el modal cuando se presiona la 'X'
closeModal.addEventListener("click", function() {
    modal.style.display = "none";
});

// Cerrar el modal si se hace clic fuera del contenido del modal
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const faders = document.querySelectorAll(".service-card, .testimonial-card");

    const appearOptions = {
        threshold: 0,
        rootMargin: "0px 0px -100px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("appear");
            appearOnScroll.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});
