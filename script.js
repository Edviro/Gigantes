function createParticles() {
    const particlesContainer = document.getElementById('particles');

    for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Función principal del contador
// Función principal del contador
function updateCountdown() {
    const targetDate = new Date('2025-06-22T06:00:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const countdownElement = document.getElementById('countdown');
    const finalMessageElement = document.getElementById('finalMessage');

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Forzar actualización inmediata sin transiciones
        if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    } else {
        if (countdownElement) countdownElement.style.display = 'none';
        if (finalMessageElement) finalMessageElement.style.display = 'block';
    }
}

// Inicializar la página cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
    createParticles(); // Crea las partículas
    updateCountdown(); // Actualiza el contador inicialmente

    // Actualizar el contador cada segundo
    setInterval(updateCountdown, 1000);

    // Configura los enlaces
    setupLinks();

    // Efectos adicionales al hacer clic en las unidades de tiempo
    document.querySelectorAll('.time-unit').forEach(unit => {
        unit.addEventListener('click', function () {
            this.style.transform = 'translateY(-10px) scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 300);
        });
    });
});

// Función para configurar enlaces con placeholders
function setupLinks() {
    const instagramLink = document.getElementById('instagram-link');
    const facebookLink = document.getElementById('facebook-link');
    const locationLinkUPEU = document.getElementById('location-link-upeu');
    const locationLinkPasacalle = document.getElementById('location-link-pasacalle');
    const locationLinkColegio = document.getElementById('location-link-colegio');
    const registrationLink = document.getElementById('registration-link');

    // --- ¡IMPORTANTE! REEMPLAZA ESTOS ENLACES CON LOS REALES DE TU EVENTO --- 
    instagramLink.href = 'https://www.instagram.com/region4apce/';
    facebookLink.href = 'https://www.facebook.com/region4apce';

    // Enlaces individuales para cada punto de la ruta
    locationLinkUPEU.href = 'https://maps.app.goo.gl/neKqDeUWVUsWPh6Y7'; // Enlace a la ubicación de UPEU
    locationLinkPasacalle.href = 'https://maps.app.goo.gl/iNQyNby32sVYhfxf6'; // Enlace al inicio de la Av. Balaguer o punto de interés del pasacalle
    // Note: There was a duplicate link id for locationLinkPasacalle and locationLinkColegio, I've left it as is since the user asked me to only focus on the registration link.
    locationLinkColegio.href = 'https://maps.app.goo.gl/iNQyNby32sVYhfxf6'; // Enlace a la ubicación del Colegio Buen Pastor de Ñaña

    registrationLink.href = 'https://docs.google.com/forms/d/1Nxykh0lB9g7N19_0WKPynNaDXd4mCaQLX0dRomocgKQ/viewform?edit_requested=true'; // Reemplaza con tu enlace de Google Forms o formulario
    // --- FIN DE LA SECCIÓN IMPORTANTE ---

    // Abrir enlaces en nuevas pestañas
    instagramLink.target = '_blank';
    facebookLink.target = '_blank';
    locationLinkUPEU.target = '_blank';
    locationLinkPasacalle.target = '_blank';
    locationLinkColegio.target = '_blank';
    registrationLink.target = '_blank';
}

// Inicializar la página cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
    createParticles(); // Crea las partículas
    updateCountdown(); // Actualiza el contador inicialmente
    setupLinks(); // Configura los enlaces

    // Actualizar el contador cada segundo
    setInterval(updateCountdown, 1000);
});

// Efectos adicionales al hacer clic en las unidades de tiempo
document.querySelectorAll('.time-unit').forEach(unit => {
    unit.addEventListener('click', function () {
        this.style.transform = 'translateY(-10px) scale(1.1)';
        setTimeout(() => {
            this.style.transform = 'translateY(0) scale(1)';
        }, 300);
    });
});