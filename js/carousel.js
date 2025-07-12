// ===== CONFIGURACIÓN Y DATOS DEL CARRUSEL =====

// Datos de las tarjetas del carrusel
// IMPORTANTE: Reemplaza 'logo-placeholder.png' con las rutas reales de tus logos
const carouselData = [
    {
        id: 1,
        logo: 'logosEspecialidades/01.png', // Reemplaza con tu logo real
        title: 'ALIVIO DEL HAMBRE (AD 001)',
        description: 'Ficha de desarrollo para la especialidad  ',
        downloadLink: 'https://drive.google.com/uc?export=download&id=1O6P1N1sdFMGjmyjy7GigTIuRE8KVNBm7', // Reemplaza con el enlace real de descarga,
        target: '_blank',
    },
    {
        id: 2,
        logo: 'logosEspecialidades/02.png', // Reemplaza con tu logo real
        title: 'IMPRENTA (AP 010)',
        description: ' Ficha de desarrollo para la especialidad  ',
        downloadLink: 'https://drive.google.com/uc?export=download&id=1F0-_LpN0LdShJB66iFigDlVBGh48agvj' ,
        target: '_blank',// Reemplaza con el enlace real de descarga
    },
    {
        id: 3,
        logo: 'logosEspecialidades/03.png', // Reemplaza con tu logo real
        title: 'ENVOLTORIO (HM 070)',
        description: ' Ficha de desarrollo .',
        downloadLink: 'https://drive.google.com/uc?export=download&id=1ZL6B3fhJ2sHQNKCG01xL7xypfRUbeMB6' ,// Reemplaza con el enlace real de descarga
        target: '_blank',
    },
    {
        id: 4,
        logo: 'logosEspecialidades/04.png', // Reemplaza con tu logo real
        title: 'MARCADO DE BIBLIA (AM 019)',
        description: ' Ficha de desarrollo  ',
        downloadLink: 'https://drive.google.com/uc?export=download&id=12o9MfNtAxeLuPMDHEdyxzZUT_cPtPi2o', // Reemplaza con el enlace real de descarga
        target: '_blank',
    },
    {
        id: 5,
        logo: 'logosEspecialidades/05.png', // Reemplaza con tu logo real
        title: 'PRIMEROS AUXILIOS BÁSICO (CS 003)',
        description: ' Ficha de desarrollo  ',
        downloadLink: 'https://drive.google.com/uc?export=download&id=1uTrL0zV2XHoLFUG5SJ3U8jLRETAvDZXa', // Reemplaza con el enlace real de descarga
        target: '_blank',
    },
    {
        id: 6,
        logo: 'logosEspecialidades/06.png', // Reemplaza con tu logo real
        title: 'ARTE DE TRENZAR (HM 040)',
        description: ' Ficha de desarrollo ',
        downloadLink: 'https://drive.google.com/uc?export=download&id=1SsceDU4HaFZgu0UCo9wTFP3wNNSjOwYL' ,// Reemplaza con el enlace real de descarga
        target: '_blank',
    }
];

// ===== VARIABLES GLOBALES DEL CARRUSEL =====
let currentSlide = 0;
let cardsPerView = 3;
let totalSlides = 0;
let carouselTrack = null;
let isAnimating = false;
let autoPlayInterval = null;
let cardWidth = 320;
let cardMargin = 30;

// ===== FUNCIONES PRINCIPALES =====

// Función para calcular cuántas tarjetas mostrar según el ancho de pantalla
function calculateCardsPerView() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
}

// Función para crear una tarjeta HTML
function createCard(cardData, isClone = false) {
    return `
        <div class="carousel-card ${isClone ? 'clone' : ''}" data-id="${cardData.id}">
            <img src="${cardData.logo}" alt="${cardData.title}" class="card-logo" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTAiIGZpbGw9InJnYmEoMjU1LCAxNzAsIDAsIDAuMikiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmFhMDAiIHN0cm9rZS13aWR0aD0iMiI+CjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIi8+CjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ii8+Cjxwb2x5bGluZSBwb2ludHM9IjIxLDE1IDE2LDEwIDUsMjEiLz4KPC9zdmc+Cjwvc3ZnPg=='; this.onerror=null;">
            <h3 class="card-title">${cardData.title}</h3>
            <p class="card-description">${cardData.description}</p>
            <a href="${cardData.downloadLink}" class="card-download-btn" download>
                <svg class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Descargar
            </a>
        </div>
    `;
}

// Función para crear los indicadores
function createIndicators() {
    const indicatorsContainer = document.getElementById('carouselIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < carouselData.length; i++) {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${i === (currentSlide % carouselData.length) ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
}

// Función para actualizar los indicadores
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === (currentSlide % carouselData.length));
    });
}

// Función para actualizar dimensiones según el tamaño de pantalla
function updateDimensions() {
    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 480) {
        cardWidth = 220;
        cardMargin = 12;
    } else if (screenWidth <= 768) {
        cardWidth = 250;
        cardMargin = 16;
    } else if (screenWidth <= 1024) {
        cardWidth = 280;
        cardMargin = 20;
    } else {
        cardWidth = 320;
        cardMargin = 30;
    }
}

// Función para actualizar la posición del carrusel
function updateCarouselPosition(instant = false) {
    if (!carouselTrack) return;
    
    const totalCardWidth = cardWidth + cardMargin;
    const translateX = -(currentSlide * totalCardWidth);
    
    if (instant) {
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        // Forzar un reflow antes de restaurar la transición
        carouselTrack.offsetHeight;
        carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    } else {
        carouselTrack.style.transform = `translateX(${translateX}px)`;
    }
}

// Función para ir a una diapositiva específica
function goToSlide(slideIndex) {
    if (isAnimating) return;
    
    isAnimating = true;
    
    // Para navegación directa por indicadores, encontrar la posición más cercana
    const currentPosition = currentSlide % carouselData.length;
    const targetPosition = slideIndex;
    let diff = targetPosition - currentPosition;
    
    // Encontrar el camino más corto
    if (diff > carouselData.length / 2) {
        diff -= carouselData.length;
    } else if (diff < -carouselData.length / 2) {
        diff += carouselData.length;
    }
    
    currentSlide += diff;
    
    updateCarouselPosition();
    updateIndicators();
    resetAutoPlay();
    
    setTimeout(() => {
        checkInfiniteLoop();
        isAnimating = false;
    }, 500);
}

// Función para ir a la siguiente diapositiva
function nextSlide() {
    if (isAnimating) return;
    
    isAnimating = true;
    currentSlide++;
    
    updateCarouselPosition();
    updateIndicators();
    resetAutoPlay();
    
    setTimeout(() => {
        checkInfiniteLoop();
        isAnimating = false;
    }, 500);
}

// Función para ir a la diapositiva anterior
function prevSlide() {
    if (isAnimating) return;
    
    isAnimating = true;
    currentSlide--;
    
    updateCarouselPosition();
    updateIndicators();
    resetAutoPlay();
    
    setTimeout(() => {
        checkInfiniteLoop();
        isAnimating = false;
    }, 500);
}

// Función para verificar el bucle infinito
function checkInfiniteLoop() {
    const totalCards = carouselData.length;
    
    // Si estamos muy adelante, saltar al principio sin animación
    if (currentSlide >= totalCards * 2) {
        currentSlide = currentSlide - totalCards;
        updateCarouselPosition(true);
    }
    // Si estamos muy atrás, saltar al final sin animación
    else if (currentSlide < 0) {
        currentSlide = currentSlide + totalCards;
        updateCarouselPosition(true);
    }
}

// Función para crear las tarjetas con clones para el efecto infinito
function createInfiniteCards() {
    const cards = [];
    
    // Tarjetas clonadas al principio (para ir hacia atrás)
    carouselData.forEach(cardData => {
        cards.push(createCard(cardData, true));
    });
    
    // Tarjetas originales
    carouselData.forEach(cardData => {
        cards.push(createCard(cardData));
    });
    
    // Tarjetas clonadas al final (para ir hacia adelante)
    carouselData.forEach(cardData => {
        cards.push(createCard(cardData, true));
    });
    
    return cards.join('');
}

// Función para inicializar el carrusel
function initCarousel() {
    // Obtener elementos del DOM
    carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!carouselTrack) {
        console.error('No se encontró el elemento del carrusel');
        return;
    }
    
    // Actualizar configuración responsiva
    cardsPerView = calculateCardsPerView();
    updateDimensions();
    
    // Crear las tarjetas con clones para efecto infinito
    carouselTrack.innerHTML = createInfiniteCards();
    
    // Posicionar en el primer set real (después de los clones iniciales)
    currentSlide = carouselData.length;
    updateCarouselPosition(true);
    
    // Crear indicadores
    createIndicators();
    
    // Configurar event listeners para botones de navegación
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Configurar navegación por teclado
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Configurar touch/swipe para dispositivos móviles
    setupTouchNavigation();
    
    // Iniciar autoplay
    startAutoPlay();
    
    // Configurar pausa del autoplay al hacer hover
    const carouselSection = document.querySelector('.carousel-section');
    if (carouselSection) {
        carouselSection.addEventListener('mouseenter', pauseAutoPlay);
        carouselSection.addEventListener('mouseleave', startAutoPlay);
    }
}

// Función para manejar la navegación por teclado
function handleKeyNavigation(event) {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevSlide();
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextSlide();
    }
}

// Función para configurar navegación táctil
function setupTouchNavigation() {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Solo procesar si el movimiento es más horizontal que vertical
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
        }
    }, { passive: false });
    
    carouselTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50; // Umbral mínimo para considerar un swipe
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
    }, { passive: true });
}

// Funciones de autoplay
function startAutoPlay() {
    if (autoPlayInterval) return;
    
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Cambiar cada 5 segundos
}

function pauseAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function resetAutoPlay() {
    pauseAutoPlay();
    startAutoPlay();
}

// Función para manejar el redimensionamiento de la ventana
function handleResize() {
    const newCardsPerView = calculateCardsPerView();
    
    if (newCardsPerView !== cardsPerView) {
        cardsPerView = newCardsPerView;
    }
    
    updateDimensions();
    updateCarouselPosition();
    updateIndicators();
}

// Event listener para redimensionamiento con debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
});

// Función para manejar la visibilidad de la página (pausar autoplay cuando no está visible)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        pauseAutoPlay();
    } else {
        startAutoPlay();
    }
});

// ===== INICIALIZACIÓN =====

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Pequeño delay para asegurar que todos los estilos estén aplicados
    setTimeout(initCarousel, 100);
});

// Función auxiliar para debugging (opcional)
function debugCarousel() {
    console.log('Carousel Debug Info:');
    console.log('Current Slide:', currentSlide);
    console.log('Cards Per View:', cardsPerView);
    console.log('Total Original Cards:', carouselData.length);
    console.log('Window Width:', window.innerWidth);
    console.log('Card Width:', cardWidth);
    console.log('Card Margin:', cardMargin);
}

// Exponer funciones globalmente para uso externo (opcional)
window.carouselAPI = {
    goToSlide,
    nextSlide,
    prevSlide,
    startAutoPlay,
    pauseAutoPlay,
    debugCarousel
};
