// ===== CONFIGURACIÓN DEL MODAL DE VIDEO =====

// CONFIGURACIÓN - Cambia esta URL por tu video de Instagram
const INSTAGRAM_VIDEO_CONFIG = {
    // URL del post de Instagram (reemplaza con tu URL real)
    url: 'https://www.instagram.com/reel/DKqePX_uxEN/?igsh=Y3pydzVwZmxmZ2t4',
    // Alternativa: ID del post si lo tienes
    postId: null,
    // Configuración del embed
    embedOptions: {
        width: '100%',
        height: '100%',
        autoplay: true,
        muted: true, // Recomendado para autoplay
    }
};

// Variables globales
let videoModal = null;
let videoContainer = null;
let closeButton = null;
let isVideoLoaded = false;
let hasBeenShown = false;
let instagramScriptLoaded = false;
let autoCloseTimer = null;

// ===== FUNCIONES PRINCIPALES =====

/**
 * Extrae el ID del post desde una URL de Instagram
 * @param {string} url - URL del post de Instagram
 * @returns {string|null} - ID del post o null si no se puede extraer
 */
function extractInstagramPostId(url) {
    try {
        // Patrones comunes de URLs de Instagram
        const patterns = [
            /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
            /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
            /instagram\.com\/tv\/([A-Za-z0-9_-]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error al extraer ID del post:', error);
        return null;
    }
}

/**
 * Detecta si el contenido es vertical (Reels/Stories)
 * @param {string} url - URL del post de Instagram
 * @returns {boolean} - true si es contenido vertical
 */
function isVerticalContent(url) {
    return url.includes('/reel/') || url.includes('/stories/');
}

/**
 * Genera el HTML del embed de Instagram optimizado para contenido vertical
 * @param {string} postId - ID del post de Instagram
 * @param {boolean} isVertical - Si el contenido es vertical
 * @returns {string} - HTML del embed
 */
function generateInstagramEmbed(postId, isVertical = false) {
    if (!postId) {
        console.error('No se proporcionó un ID de post válido');
        return '<div class="video-loading">Error: URL de video no válida</div>';
    }
    
    // URL completa del post
    const postUrl = `https://www.instagram.com/p/${postId}/`;
    
    // Estilos optimizados para videos verticales
    const containerStyle = isVertical ? 
        'background:#000; border:0; border-radius:15px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 0; max-width:100%; max-height:80vh; padding:0; width:auto; height:auto; display:flex; justify-content:center; align-items:center;' :
        'background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:100%; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);';
    
    // Embed usando el API de Instagram
    return `
        <blockquote class="instagram-media ${isVertical ? 'vertical-video' : ''}" 
                    data-instgrm-captioned
                    data-instgrm-permalink="${postUrl}"
                    data-instgrm-version="14"
                    style="${containerStyle}">
            <div style="padding:${isVertical ? '8px' : '16px'};">
                <div style="display:block; height:50px; margin:0 auto 12px; width:50px;">
                    <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g transform="translate(-511.000000, -20.000000)" fill="${isVertical ? '#ffffff' : '#000000'}">
                                <g>
                                    <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <div style="padding-top: 8px;">
                    <div style="color:${isVertical ? '#ffffff' : '#3897f0'}; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">
                        Ver esta publicación en Instagram
                    </div>
                </div>
            </div>
        </blockquote>
    `;
}

/**
 * Carga el script de Instagram para los embeds
 */
function loadInstagramScript() {
    return new Promise((resolve, reject) => {
        // Verificar si el script ya está cargado
        if (window.instgrm && instagramScriptLoaded) {
            resolve();
            return;
        }
        
        // Eliminar script anterior si existe
        const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]');
        if (existingScript) {
            existingScript.remove();
        }
        
        const script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = 'https://www.instagram.com/embed.js';
        script.onload = () => {
            instagramScriptLoaded = true;
            console.log('Script de Instagram cargado exitosamente');
            // Pequeño delay para asegurar que el script esté completamente listo
            setTimeout(() => resolve(), 500);
        };
        script.onerror = (error) => {
            console.error('Error al cargar el script de Instagram:', error);
            reject(error);
        };
        
        document.head.appendChild(script);
    });
}

/**
 * FUNCIÓN CLAVE: Inicializa y carga el video de Instagram
 */
async function initializeVideo() {
    if (isVideoLoaded || !videoContainer) {
        console.log('Video ya cargado o contenedor no disponible');
        return;
    }
    
    try {
        console.log('Inicializando video con configuración:', INSTAGRAM_VIDEO_CONFIG);
        
        // Mostrar loading
        videoContainer.innerHTML = '<div class="video-loading">Cargando video...</div>';
        
        // Obtener ID del post
        let postId = INSTAGRAM_VIDEO_CONFIG.postId;
        if (!postId && INSTAGRAM_VIDEO_CONFIG.url) {
            postId = extractInstagramPostId(INSTAGRAM_VIDEO_CONFIG.url);
        }
        
        if (!postId) {
            throw new Error('No se pudo obtener el ID del post de Instagram');
        }
        
        console.log('ID del post extraído:', postId);
        
        // Verificar si es contenido vertical
        const isVertical = isVerticalContent(INSTAGRAM_VIDEO_CONFIG.url);
        console.log('Contenido vertical:', isVertical);
        
        // Ajustar modal para el tipo de contenido
        adjustModalForContent(isVertical);
        
        // Generar HTML del embed
        const embedHTML = generateInstagramEmbed(postId, isVertical);
        videoContainer.innerHTML = embedHTML;
        
        // Cargar script de Instagram
        await loadInstagramScript();
        
        // Procesar embeds de Instagram
        if (window.instgrm && window.instgrm.Embeds) {
            console.log('Procesando embeds de Instagram...');
            window.instgrm.Embeds.process();
        }
        
        isVideoLoaded = true;
        
        // Configurar cierre automático
        setupAutoClose();
        
        // Monitorear el estado del video
        setupVideoEndDetection();
        
        console.log('Video inicializado correctamente');
        
    } catch (error) {
        console.error('Error al inicializar el video:', error);
        videoContainer.innerHTML = `
            <div class="video-loading" style="color: #ff4444;">
                Error al cargar el video<br>
                <small>Verifica la URL de Instagram</small>
            </div>
        `;
    }
}

/**
 * Configura el cierre automático del modal
 */
function setupAutoClose() {
    // Limpiar timer anterior si existe
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
    }
    
    // Cerrar automáticamente después de 45 segundos (duración típica de un reel)
    autoCloseTimer = setTimeout(() => {
        console.log('Cerrando modal automáticamente...');
        hideVideoModal();
    }, 75000); // 45 segundos
}

/**
 * Monitorea el estado del video y cierra el modal automáticamente
 */
function setupVideoEndDetection() {
    let checkInterval;
    let attempts = 0;
    const maxAttempts = 60; // 1 minuto de intentos
    
    // Función para verificar si el video ha terminado
    function checkVideoStatus() {
        try {
            // Buscar iframe de Instagram
            const iframe = videoContainer.querySelector('iframe');
            if (iframe) {
                console.log('Iframe de Instagram detectado');
                
                // Configurar event listener para cuando el iframe termine de cargar
                iframe.onload = () => {
                    console.log('Iframe cargado completamente');
                    
                    // Intentar detectar interacciones con el video
                    setTimeout(() => {
                        // Si el video está en autoplay, se cerrará automáticamente
                        console.log('Video en reproducción automática');
                    }, 2000);
                };
                
                clearInterval(checkInterval);
                return true;
            }
            
            // Buscar elementos de Instagram que indiquen que el embed está listo
            const instagramMedia = videoContainer.querySelector('.instagram-media');
            if (instagramMedia && instagramMedia.querySelector('iframe')) {
                console.log('Embed de Instagram completamente cargado');
                clearInterval(checkInterval);
                return true;
            }
            
        } catch (error) {
            console.log('Error al verificar estado del video:', error);
        }
        
        return false;
    }
    
    // Verificar cada segundo
    checkInterval = setInterval(() => {
        attempts++;
        
        if (checkVideoStatus() || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            if (attempts >= maxAttempts) {
                console.log('Timeout: No se pudo detectar el video completamente');
            }
        }
    }, 1000);
}

/**
 * Ajusta el tamaño del modal según el contenido
 */
function adjustModalForContent(isVertical = false) {
    if (!videoModal || !videoContainer) return;
    
    const modalContent = videoModal.querySelector('.video-modal-content');
    if (!modalContent) return;
    
    if (isVertical) {
        // Ajustes para contenido vertical (Reels)
        modalContent.style.maxWidth = '420px';
        modalContent.style.height = 'auto';
        modalContent.style.maxHeight = '95vh';
        
        // Ajustar contenedor del video para aspecto vertical
        videoContainer.style.paddingBottom = '177.78%'; // Aspect ratio 9:16
        videoContainer.style.height = 'auto';
        videoContainer.style.maxHeight = '75vh';
        
        // Añadir clase para estilos específicos
        videoModal.classList.add('vertical-content');
        
        console.log('Modal ajustado para contenido vertical');
    } else {
        // Ajustes para contenido horizontal (Posts regulares)
        modalContent.style.maxWidth = '800px';
        modalContent.style.height = 'auto';
        modalContent.style.maxHeight = '90vh';
        
        // Restaurar aspect ratio horizontal
        videoContainer.style.paddingBottom = '56.25%'; // Aspect ratio 16:9
        videoContainer.style.height = 'auto';
        videoContainer.style.maxHeight = 'none';
        
        // Remover clase vertical si existe
        videoModal.classList.remove('vertical-content');
        
        console.log('Modal ajustado para contenido horizontal');
    }
}

/**
 * Muestra el modal de video
 */
function showVideoModal() {
    if (!videoModal) {
        console.error('Modal no encontrado');
        return;
    }
    
    if (hasBeenShown) {
        videoModal.style.display = 'flex';
        videoModal.classList.remove('hidden');
        return;
    }
    
    hasBeenShown = true;
    videoModal.style.display = 'flex';
    videoModal.classList.remove('hidden');
    
    // NO prevenir scroll del body para evitar sensación de página vacía
    // document.body.style.overflow = 'hidden';
    
    // Añadir clase para animaciones
    videoModal.classList.add('showing');
    
    // Inicializar video después de mostrar el modal
    setTimeout(() => {
        initializeVideo();
    }, 300);
    
    console.log('Modal de video mostrado');
}

/**
 * Oculta el modal de video
 */
function hideVideoModal() {
    if (!videoModal) return;
    
    // Limpiar timer de cierre automático
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
    }
    
    videoModal.classList.add('hidden');
    videoModal.classList.remove('showing');
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    
    // Limpiar el video después de la animación
    setTimeout(() => {
        videoModal.style.display = 'none';
        if (videoContainer) {
            videoContainer.innerHTML = '';
        }
        isVideoLoaded = false;
    }, 400);
    
    console.log('Modal de video ocultado');
}

/**
 * Maneja el clic en el overlay para cerrar el modal
 */
function handleOverlayClick(event) {
    if (event.target === videoModal || event.target.classList.contains('video-modal-overlay')) {
        hideVideoModal();
    }
}

/**
 * Maneja las teclas de escape para cerrar el modal
 */
function handleKeyPress(event) {
    if (event.key === 'Escape' && videoModal && !videoModal.classList.contains('hidden')) {
        hideVideoModal();
    }
}

/**
 * Maneja cambios en la visibilidad de la página
 */
function handleVisibilityChange() {
    if (document.hidden && videoModal && !videoModal.classList.contains('hidden')) {
        // Pausar video si la página no es visible
        console.log('Página oculta, el video se pausará automáticamente');
    } else if (!document.hidden && videoModal && !videoModal.classList.contains('hidden')) {
        // Reanudar video si la página es visible
        console.log('Página visible, el video se reanudará automáticamente');
    }
}

/**
 * Inicializa el modal de video
 */
function initVideoModal() {
    try {
        // Obtener elementos del DOM
        videoModal = document.getElementById('videoModal');
        videoContainer = document.getElementById('videoContainer');
        closeButton = document.getElementById('closeVideoModal');
        
        if (!videoModal || !videoContainer || !closeButton) {
            console.error('No se encontraron los elementos del modal de video');
            console.log('Elementos encontrados:', {
                videoModal: !!videoModal,
                videoContainer: !!videoContainer,
                closeButton: !!closeButton
            });
            return;
        }
        
        // Configurar event listeners
        closeButton.addEventListener('click', hideVideoModal);
        videoModal.addEventListener('click', handleOverlayClick);
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Event listener para prevenir cierre accidental
        videoContainer.addEventListener('click', (event) => {
            event.stopPropagation();
        });
        
        // Mostrar el modal automáticamente después de un breve delay
        setTimeout(() => {
            showVideoModal();
        }, 1500); // 1.5 segundos después de cargar la página
        
        console.log('Modal de video inicializado correctamente');
        
    } catch (error) {
        console.error('Error al inicializar el modal:', error);
    }
}

/**
 * Función para mostrar el modal manualmente (útil para testing)
 */
function showVideoManually() {
    hasBeenShown = false;
    showVideoModal();
}

/**
 * Función para actualizar la configuración del video
 */
function updateVideoConfig(newConfig) {
    Object.assign(INSTAGRAM_VIDEO_CONFIG, newConfig);
    isVideoLoaded = false;
    console.log('Configuración del video actualizada:', INSTAGRAM_VIDEO_CONFIG);
    
    // Si el modal está abierto, recargar el video
    if (videoModal && !videoModal.classList.contains('hidden')) {
        initializeVideo();
    }
}

/**
 * Función para reiniciar el modal
 */
function resetVideoModal() {
    hasBeenShown = false;
    isVideoLoaded = false;
    instagramScriptLoaded = false;
    
    // Limpiar timer
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
    }
    
    if (videoContainer) {
        videoContainer.innerHTML = '';
    }
    
    if (videoModal) {
        videoModal.style.display = 'none';
        videoModal.classList.add('hidden');
    }
    
    document.body.style.overflow = '';
    console.log('Modal de video reiniciado');
}

/**
 * Función para verificar si la URL de Instagram es válida
 */
function validateInstagramUrl(url) {
    const patterns = [
        /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?$/,
        /^https?:\/\/(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?$/,
        /^https?:\/\/(www\.)?instagram\.com\/tv\/[A-Za-z0-9_-]+\/?$/
    ];
    
    return patterns.some(pattern => pattern.test(url));
}

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Función para debug - mostrar información del modal
 */
function debugModal() {
    console.log('=== DEBUG MODAL ===');
    console.log('Config:', INSTAGRAM_VIDEO_CONFIG);
    console.log('Elementos DOM:', {
        videoModal: !!videoModal,
        videoContainer: !!videoContainer,
        closeButton: !!closeButton
    });
    console.log('Estados:', {
        isVideoLoaded,
        hasBeenShown,
        instagramScriptLoaded
    });
    console.log('URL válida:', validateInstagramUrl(INSTAGRAM_VIDEO_CONFIG.url));
    console.log('Post ID:', extractInstagramPostId(INSTAGRAM_VIDEO_CONFIG.url));
}

// Hacer funciones disponibles globalmente para testing
window.showVideoManually = showVideoManually;
window.hideVideoModal = hideVideoModal;
window.updateVideoConfig = updateVideoConfig;
window.resetVideoModal = resetVideoModal;
window.debugModal = debugModal;

// ===== INICIALIZACIÓN =====

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando modal...');
    // Pequeño delay para asegurar que todos los elementos estén listos
    setTimeout(initVideoModal, 500);
});

// Inicialización de respaldo por si DOMContentLoaded ya pasó
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoModal);
    
} else {
    // DOM ya está cargado
    setTimeout(initVideoModal, 500);
}

// Manejar recarga de página
window.addEventListener('load', () => {
    console.log('Página completamente cargada');
    // Verificar que el modal esté inicializado
    if (!videoModal) {
        setTimeout(initVideoModal, 200);
    }
});

// Manejar errores globales
// Completar la función que se cortó
window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('instagram.com')) {
        console.warn('Error en script de Instagram:', event.error);
    }
});

console.log('Script del modal de video de Instagram cargado completamente');