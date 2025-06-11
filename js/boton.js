 // JavaScript para el botón de navegación
        document.addEventListener('DOMContentLoaded', function() {
            const navButton = document.getElementById('navButton');
            const navIcon = document.getElementById('navIcon');
            const heroSection = document.getElementById('heroSection');
            const countdownSection = document.getElementById('countdownSection');
            let isAtTop = true;

            // Función para mostrar/ocultar el botón según el scroll
            function handleScroll() {
                const heroRect = heroSection.getBoundingClientRect();
                const shouldShowButton = heroRect.bottom < window.innerHeight * 0.5;
                
                if (shouldShowButton && !navButton.classList.contains('visible')) {
                    navButton.classList.add('visible');
                }
            }

            // Función para manejar el clic del botón
            function handleNavClick() {
                navButton.classList.add('rotate');
                
                setTimeout(() => {
                    navButton.classList.remove('rotate');
                }, 300);

                if (isAtTop) {
                    // Bajar al countdown
                    countdownSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Cambiar icono a flecha hacia arriba
                    navIcon.innerHTML = '<polyline points="18,15 12,9 6,15"></polyline>';
                    isAtTop = false;
                } else {
                    // Subir al hero
                    heroSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Cambiar icono a flecha hacia abajo
                    navIcon.innerHTML = '<polyline points="6,9 12,15 18,9"></polyline>';
                    isAtTop = true;
                }
            }

            // Event listeners
            window.addEventListener('scroll', handleScroll);
            navButton.addEventListener('click', handleNavClick);

            // Verificar posición inicial
            handleScroll();
        });