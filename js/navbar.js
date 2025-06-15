// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbarGlass');
    const navItems = document.querySelectorAll('.nav-item');
    const logoPlaceholder = document.querySelector('.logo-placeholder');
    
    // Punto de scroll donde aparece el navbar (ajusta según tu portada)
    const NAVBAR_TRIGGER_POINT = 300; // pixels
    
    // Smooth scroll function
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100; // Ajuste para el navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get target section
            const href = this.getAttribute('href');
            const targetId = href.substring(1); // Remove the #
            
            // Smooth scroll to target
            smoothScrollTo(targetId);
        });
    });
    
    // Handle logo click (desktop only)
    if (logoPlaceholder) {
        logoPlaceholder.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to inicio
            const inicioItem = document.querySelector('.nav-item[data-section="inicio"]');
            if (inicioItem) {
                inicioItem.classList.add('active');
            }
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Scroll effect for navbar
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isDesktop = window.innerWidth > 768;
        
        // En desktop: mostrar/ocultar según scroll
        if (isDesktop) {
            if (scrollTop > NAVBAR_TRIGGER_POINT) {
                navbar.classList.add('visible');
            } else {
                navbar.classList.remove('visible');
            }
        }
        
        // Add scrolled class for enhanced blur effect
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateNavbarLayout();
    });
    
    function updateNavbarLayout() {
        const isMobile = window.innerWidth <= 768;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // En desktop: verificar si debe estar visible
        if (!isMobile) {
            if (scrollTop > NAVBAR_TRIGGER_POINT) {
                navbar.classList.add('visible');
            } else {
                navbar.classList.remove('visible');
            }
        } else {
            // En mobile siempre visible
            navbar.classList.remove('visible');
        }
    }
    
    // Initialize navbar
    updateNavbarLayout();
    
    // Set initial active state
    const inicioItem = document.querySelector('.nav-item[data-section="inicio"]');
    if (inicioItem) {
        inicioItem.classList.add('active');
    }
    
    // Intersection Observer para mejor detección de secciones
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -100px 0px', // Mayor margen para mejor detección
            threshold: [0.1, 0.5, 0.8] // Múltiples puntos de intersección
        };
        
        const observer = new IntersectionObserver((entries) => {
            let maxRatio = 0;
            let currentSection = null;
            
            // Encontrar la sección con mayor visibilidad
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    const element = entry.target;
                    
                    // Mapear elementos a nav items
                    if (element.id === 'countdownSection') {  // Cambiado de heroSection
                        currentSection = 'inicio';
                    } else if (element.id === 'carouselSection') {
                        currentSection = 'especialidades';
                    } else if (element.id === 'additionalInfo') {
                        currentSection = 'informacion';
                    }
                }
            });
            
            // Solo actualizar si tenemos una sección válida
            if (currentSection) {
                navItems.forEach(item => item.classList.remove('active'));
                const activeNavItem = document.querySelector(`[data-section="${currentSection}"]`);
                if (activeNavItem) {
                    activeNavItem.classList.add('active');
                }
            }
        }, observerOptions);
        
        // Esperar a que los elementos estén disponibles y observarlos
        const observeElements = () => {
            const sectionsToObserve = [
                'countdownSection',  // Cambiado de heroSection
                'carouselSection', 
                'additionalInfo'
            ];
            
            sectionsToObserve.forEach(sectionId => {
                const element = document.getElementById(sectionId);
                if (element) {
                    observer.observe(element);
                } else {
                    console.warn(`Elemento ${sectionId} no encontrado para observar`);
                }
            });
        };
        
        // Intentar observar inmediatamente y también después de un delay
        observeElements();
        setTimeout(observeElements, 500);
        
        // También observar cuando se carga completamente la página
        if (document.readyState === 'loading') {
            window.addEventListener('load', () => {
                setTimeout(observeElements, 100);
            });
        }
    }
    
    // Función de respaldo para detección manual de secciones
    let manualDetectionEnabled = true;
    
    function manualSectionDetection() {
        if (!manualDetectionEnabled) return;
        
        const scrollPosition = window.scrollY + 150; // Offset para mejor detección
        const sections = [
            { id: 'countdownSection', navItem: 'inicio' },  // Cambiado de heroSection
            { id: 'carouselSection', navItem: 'especialidades' },
            { id: 'additionalInfo', navItem: 'informacion' }
        ];
        
        let activeSection = null;
        let closestDistance = Infinity;
        
        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) {
                const elementTop = element.offsetTop;
                const elementBottom = elementTop + element.offsetHeight;
                
                // Verificar si el scroll está dentro de la sección
                if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                    const distanceFromTop = Math.abs(scrollPosition - elementTop);
                    if (distanceFromTop < closestDistance) {
                        closestDistance = distanceFromTop;
                        activeSection = section.navItem;
                    }
                }
            }
        });
        
        // Si no hay sección activa, usar la más cercana
        if (!activeSection) {
            sections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element) {
                    const elementTop = element.offsetTop;
                    const distance = Math.abs(scrollPosition - elementTop);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        activeSection = section.navItem;
                    }
                }
            });
        }
        
        // Actualizar navbar si hay una sección activa
        if (activeSection) {
            const currentActive = document.querySelector('.nav-item.active');
            const newActive = document.querySelector(`[data-section="${activeSection}"]`);
            
            if (currentActive !== newActive) {
                navItems.forEach(item => item.classList.remove('active'));
                if (newActive) {
                    newActive.classList.add('active');
                }
            }
        }
    }
    
    // Ejecutar detección manual como respaldo
    let manualDetectionTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(manualDetectionTimer);
        manualDetectionTimer = setTimeout(manualSectionDetection, 100);
    }, { passive: true });
    
    // Desactivar detección manual cuando el Intersection Observer esté funcionando
    setTimeout(() => {
        if (document.querySelectorAll('.nav-item.active').length > 0) {
            manualDetectionEnabled = false;
        }
    }, 2000);
});