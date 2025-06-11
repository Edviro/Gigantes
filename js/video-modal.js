// ===== CONFIGURACIÓN DEL MODAL DE VIDEO LOCAL =====

// CONFIGURACIÓN - Cambia esta ruta por tu archivo de video
const LOCAL_VIDEO_CONFIG = {
    // Ruta del archivo de video (colócalo en tu carpeta del proyecto)
    videoSrc: 'video/promocional.mp4', // Cambia por tu archivo
    // Configuración del video
    options: {
        autoplay: true,
        muted: true, // Cambiado a false para permitir el sonido
        loop: false,
        controls: false, // Usaremos controles personalizados
        preload: 'metadata'
    },
    // Configuración del modal
    autoShow: true, // Se muestra automáticamente al cargar la página
    autoShowDelay: 1000, // Delay en ms antes de mostrar
    autoClose: true, // Se cierra automáticamente al terminar el video
    autoCloseDelay: 1000, // Delay antes de cerrar automáticamente
    showOnlyOnce: true, // Solo se muestra una vez por sesión
    enableKeyboardControls: true, // Controles con teclado (ESC, Space, etc.)
    clickOutsideToClose: true // Cerrar al hacer clic fuera del video
};

// Variables globales
let videoModal = null;
let videoContainer = null;
let closeButton = null;
let videoElement = null;
let progressContainer = null;
let progressBar = null;
let progressFill = null;
let progressBuffer = null;
let timeDisplay = null;
let currentTimeSpan = null;
let durationSpan = null;
let autoPlayIndicator = null;
let loadingElement = null;
let overlay = null;

let isVideoLoaded = false;
let hasBeenShown = false;
let autoCloseTimer = null;
let progressUpdateInterval = null;
let isModalVisible = false;
let isDragging = false;
let isInitialized = false;

// ===== FUNCIÓN DE INICIALIZACIÓN PRINCIPAL =====

/**
 * Inicializa el modal de video
 */
function initVideoModal() {
    console.log('Inicializando modal de video...');
    
    // Evitar inicialización múltiple
    if (isInitialized) {
        console.log('Modal ya inicializado');
        return;
    }
    
    // Verificar si ya se mostró en esta sesión
    if (LOCAL_VIDEO_CONFIG.showOnlyOnce && sessionStorage.getItem('videoModalShown') === 'true') {
        console.log('Modal ya fue mostrado en esta sesión');
        return;
    }
    
    // Crear elementos del modal
    if (!createModalElements()) {
        console.error('Error al crear elementos del modal');
        return;
    }
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar eventos del video
    setupVideoEvents();
    
    // Marcar como inicializado
    isInitialized = true;
    
    // Mostrar automáticamente si está configurado
    if (LOCAL_VIDEO_CONFIG.autoShow) {
        setTimeout(() => {
            showVideoModal();
        }, LOCAL_VIDEO_CONFIG.autoShowDelay);
    }
    
    console.log('Modal de video inicializado correctamente');
}

/**
 * Crea todos los elementos del modal
 */
function createModalElements() {
    console.log('Creando elementos del modal...');
    
    // Obtener referencias a elementos existentes
    videoModal = document.getElementById('videoModal');
    videoContainer = document.getElementById('videoContainer');
    closeButton = document.getElementById('closeVideoModal');
    
    if (!videoModal || !videoContainer || !closeButton) {
        console.error('No se encontraron los elementos del modal en el HTML');
        return false;
    }
    
    // Obtener overlay
    overlay = videoModal.querySelector('.video-modal-overlay');
    if (!overlay) {
        console.error('No se encontró el overlay del modal');
        return false;
    }
    
    // Crear elemento de video
    videoElement = createVideoElement();
    
    // Crear elementos de progreso
    const progressElements = createProgressBar();
    progressContainer = progressElements.container;
    progressBar = progressElements.progressBar;
    progressFill = progressElements.progressFill;
    progressBuffer = progressElements.progressBuffer;
    timeDisplay = progressElements.timeDisplay;
    currentTimeSpan = progressElements.currentTime;
    durationSpan = progressElements.duration;
    
    // Crear indicador de autoplay
    autoPlayIndicator = createAutoPlayIndicator();
    
    // Crear elemento de carga
    loadingElement = createLoadingElement();
    
    // Limpiar contenedor y agregar elementos
    videoContainer.innerHTML = '';
    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(progressContainer);
    videoContainer.appendChild(autoPlayIndicator);
    videoContainer.appendChild(loadingElement);
    
    // Ocultar modal inicialmente
    videoModal.style.display = 'none';
    videoModal.classList.add('hidden');
    
    console.log('Elementos del modal creados correctamente');
    return true;
}

/**
 * Crea el elemento de video con todas las configuraciones
 */
function createVideoElement() {
    const video = document.createElement('video');
    
    // Aplicar configuración
    Object.entries(LOCAL_VIDEO_CONFIG.options).forEach(([key, value]) => {
        video[key] = value;
    });
    
    // Atributos adicionales para mejor rendimiento
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.preload = 'metadata';
    
    // Configurar source
    video.src = LOCAL_VIDEO_CONFIG.videoSrc;
    
    console.log('Elemento de video creado con src:', LOCAL_VIDEO_CONFIG.videoSrc);
    return video;
}

/**
 * Crea la barra de progreso personalizada
 */
function createProgressBar() {
    const container = document.createElement('div');
    container.className = 'video-progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'video-progress-bar';
    
    const progressBuffer = document.createElement('div');
    progressBuffer.className = 'video-progress-buffer';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'video-progress-fill';
    
    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'video-time-display';
    
    const currentTime = document.createElement('span');
    currentTime.className = 'video-time-current';
    currentTime.textContent = '0:00';
    
    const duration = document.createElement('span');
    duration.className = 'video-time-duration';
    duration.textContent = '0:00';
    
    // Ensamblar elementos
    progressBar.appendChild(progressBuffer);
    progressBar.appendChild(progressFill);
    timeDisplay.appendChild(currentTime);
    timeDisplay.appendChild(duration);
    container.appendChild(progressBar);
    container.appendChild(timeDisplay);
    
    return {
        container,
        progressBar,
        progressFill,
        progressBuffer,
        timeDisplay,
        currentTime,
        duration
    };
}

/**
 * Crea el indicador de reproducción automática
 */
function createAutoPlayIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'auto-play-indicator';
    indicator.textContent = '▶ Reproducción automática';
    return indicator;
}

/**
 * Crea el elemento de carga
 */
function createLoadingElement() {
    const loading = document.createElement('div');
    loading.className = 'video-loading';
    
    loading.innerHTML = `
        <div>Cargando video...</div>
        <div class="video-loading-spinner"></div>
        <div class="video-loading-bar">
            <div class="video-loading-progress"></div>
        </div>
    `;
    
    return loading;
}

// ===== FUNCIONES PRINCIPALES =====

/**
 * Muestra el modal de video
 */
function showVideoModal() {
    if (!videoModal || isModalVisible) {
        console.log('Modal no disponible o ya visible');
        return;
    }

    console.log('Mostrando modal de video...');
    isModalVisible = true;
    hasBeenShown = true;
    
    // Marcar como mostrado en la sesión
    if (LOCAL_VIDEO_CONFIG.showOnlyOnce) {
        sessionStorage.setItem('videoModalShown', 'true');
    }

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Mostrar modal
    videoModal.style.display = 'flex';
    
    // Forzar reflow y mostrar con animación
    requestAnimationFrame(() => {
        videoModal.classList.remove('hidden');
    });
    
    // Intentar reproducir el video si está configurado para autoplay
    if (videoElement && LOCAL_VIDEO_CONFIG.options.autoplay) {
        setTimeout(() => {
            videoElement.play().catch(e => {
                console.warn('Autoplay fallido:', e);
                // Si autoplay falla, mostrar controles
                videoElement.controls = true;
            });
        }, 100);
    }
    
    // Focus en el modal para accesibilidad
    setTimeout(() => {
        if (videoModal) {
            videoModal.focus();
        }
    }, 100);

    console.log('Modal de video mostrado');
}

/**
 * Oculta el modal de video
 */
function hideVideoModal() {
    console.log('Ocultando modal de video...');
    
    if (!videoModal || !isModalVisible) {
        console.log('Modal no existe o no está visible');
        return;
    }

    isModalVisible = false;
    
    // Pausar y resetear video
    if (videoElement) {
        if (!videoElement.paused) {
            videoElement.pause();
            console.log('Video pausado');
        }
        // Resetear video al inicio para la próxima vez
        videoElement.currentTime = 0;
    }
    
    // Limpiar timers
    clearAutoCloseTimer();
    stopProgressUpdates();
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    
    // Ocultar modal con animación
    videoModal.classList.add('hidden');
    
    // Ocultar completamente después de la animación
    setTimeout(() => {
        if (videoModal) {
            videoModal.style.display = 'none';
        }
    }, 300);
    
    console.log('Modal de video oculto');
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Botón de cerrar - CORREGIDO
    if (closeButton) {
        // Remover listeners existentes para evitar duplicados
        closeButton.removeEventListener('click', handleCloseClick);
        closeButton.addEventListener('click', handleCloseClick);
        console.log('Event listener del botón de cerrar configurado');
    }
    
    // Clic en overlay para cerrar
    if (LOCAL_VIDEO_CONFIG.clickOutsideToClose && overlay) {
        overlay.removeEventListener('click', handleOverlayClick);
        overlay.addEventListener('click', handleOverlayClick);
        console.log('Event listener del overlay configurado');
    }
    
    // Prevenir cierre al hacer clic en el contenido del modal
    const modalContent = videoModal.querySelector('.video-modal-content');
    if (modalContent) {
        modalContent.removeEventListener('click', handleContentClick);
        modalContent.addEventListener('click', handleContentClick);
    }
    
    // Controles de teclado
    if (LOCAL_VIDEO_CONFIG.enableKeyboardControls) {
        setupKeyboardControls();
    }
    
    // Event listeners para la barra de progreso
    if (progressBar) {
        setupProgressBarEvents();
    }
    
    // Prevenir menú contextual en el video
    if (videoElement) {
        videoElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Clic en el video para pausar/reproducir
        videoElement.addEventListener('click', togglePlayPause);
    }
}

// Handlers separados para mejor control
function handleCloseClick(e) {
    console.log('Botón de cerrar clickeado');
    e.preventDefault();
    e.stopPropagation();
    hideVideoModal();
}

function handleOverlayClick(e) {
    console.log('Overlay clickeado, target:', e.target, 'overlay:', overlay);
    if (e.target === overlay) {
        e.preventDefault();
        e.stopPropagation();
        hideVideoModal();
    }
}

function handleContentClick(e) {
    e.stopPropagation();
}

/**
 * Configura los controles de teclado
 */
function setupKeyboardControls() {
    // Remover listener existente
    document.removeEventListener('keydown', handleKeydown);
    document.addEventListener('keydown', handleKeydown);
    console.log('Controles de teclado configurados');
}

function handleKeydown(e) {
    if (!isModalVisible) return;
    
    console.log('Tecla presionada:', e.key);
    
    switch (e.key) {
        case 'Escape':
            console.log('ESC presionado - cerrando modal');
            e.preventDefault();
            hideVideoModal();
            break;
        case ' ':
        case 'k':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            seekVideo(-10);
            break;
        case 'ArrowRight':
            e.preventDefault();
            seekVideo(10);
            break;
        case 'ArrowUp':
            e.preventDefault();
            changeVolume(0.1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeVolume(-0.1);
            break;
        case 'm':
            toggleMute();
            break;
        case 'f':
            toggleFullscreen();
            break;
    }
}

/**
 * Configura los eventos de la barra de progreso
 */
function setupProgressBarEvents() {
    // Click para seek
    progressBar.addEventListener('click', handleProgressClick);
    
    // Drag para seek
    progressBar.addEventListener('mousedown', handleProgressMouseDown);
    document.addEventListener('mousemove', handleProgressMouseMove);
    document.addEventListener('mouseup', handleProgressMouseUp);
    
    // Touch events para móviles
    progressBar.addEventListener('touchstart', handleProgressTouchStart);
    document.addEventListener('touchmove', handleProgressTouchMove);
    document.addEventListener('touchend', handleProgressTouchEnd);
}

/**
 * Configura todos los event listeners del video
 */
function setupVideoEvents() {
    if (!videoElement) return;
    
    console.log('Configurando eventos de video...');
    
    // Evento de carga de metadatos
    videoElement.addEventListener('loadedmetadata', () => {
        console.log('Metadatos del video cargados, duración:', videoElement.duration);
        if (durationSpan && !isNaN(videoElement.duration)) {
            durationSpan.textContent = formatTime(videoElement.duration);
        }
        isVideoLoaded = true;
    });
    
    // Evento de datos cargados
    videoElement.addEventListener('loadeddata', () => {
        console.log('Datos del video cargados');
        hideLoadingElement();
    });
    
    // Evento de progreso de carga
    videoElement.addEventListener('progress', () => {
        if (videoElement.buffered.length > 0) {
            const buffered = videoElement.buffered.end(videoElement.buffered.length - 1);
            const duration = videoElement.duration;
            if (duration > 0) {
                const percentage = (buffered / duration) * 100;
                updateLoadingProgress(percentage);
            }
        }
    });
    
    // Evento de inicio de reproducción
    videoElement.addEventListener('play', () => {
        console.log('Video iniciado');
        startProgressUpdates();
        hideAutoPlayIndicator();
    });
    
    // Evento de pausa
    videoElement.addEventListener('pause', () => {
        console.log('Video pausado');
        stopProgressUpdates();
    });
    
    // Evento de actualización de tiempo
    videoElement.addEventListener('timeupdate', updateProgress);
    
    // Evento de finalización
    videoElement.addEventListener('ended', () => {
        console.log('Video terminado');
        stopProgressUpdates();
        
        if (LOCAL_VIDEO_CONFIG.autoClose) {
            console.log('Configurando cierre automático...');
            setAutoCloseTimer();
        }
    });
    
    // Evento de error - MEJORADO
    videoElement.addEventListener('error', (e) => {
        console.error('Error al cargar el video:', e);
        console.error('Video error details:', {
            error: videoElement.error,
            networkState: videoElement.networkState,
            readyState: videoElement.readyState,
            src: videoElement.src
        });
        showVideoError('Error al cargar el video. Verifica la ruta del archivo.');
    });
    
    // Evento de stall (cuando se detiene la carga)
    videoElement.addEventListener('stalled', () => {
        console.log('Carga del video detenida');
        showLoadingElement();
    });
    
    // Evento de waiting (esperando datos)
    videoElement.addEventListener('waiting', () => {
        console.log('Esperando datos del video');
        showLoadingElement();
    });
    
    // Evento de canplay (puede empezar a reproducir)
    videoElement.addEventListener('canplay', () => {
        console.log('Video listo para reproducir');
        hideLoadingElement();
    });
    
    // Evento de seeking
    videoElement.addEventListener('seeking', () => {
        showLoadingElement();
    });
    
    // Evento de seeked
    videoElement.addEventListener('seeked', () => {
        hideLoadingElement();
    });
    
    console.log('Eventos de video configurados');
}

// ===== FUNCIONES DE CONTROL DEL VIDEO =====

/**
 * Alterna entre reproducir y pausar
 */
function togglePlayPause() {
    if (!videoElement) return;
    
    if (videoElement.paused) {
        videoElement.play().catch(e => {
            console.error('Error al reproducir:', e);
        });
    } else {
        videoElement.pause();
    }
}

/**
 * Busca a una posición específica del video
 */
function seekVideo(seconds) {
    if (!videoElement || isNaN(videoElement.duration)) return;
    
    const newTime = Math.max(0, Math.min(videoElement.duration, videoElement.currentTime + seconds));
    videoElement.currentTime = newTime;
}

/**
 * Cambia el volumen del video
 */
function changeVolume(delta) {
    if (!videoElement) return;
    
    const newVolume = Math.max(0, Math.min(1, videoElement.volume + delta));
    videoElement.volume = newVolume;
    
    // Mostrar indicador de volumen temporal
    showVolumeIndicator(Math.round(newVolume * 100));
}

/**
 * Alterna el mute del video
 */
function toggleMute() {
    if (!videoElement) return;
    
    videoElement.muted = !videoElement.muted;
    showVolumeIndicator(videoElement.muted ? 0 : Math.round(videoElement.volume * 100));
}

/**
 * Alterna pantalla completa
 */
function toggleFullscreen() {
    if (!videoContainer) return;
    
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        videoContainer.requestFullscreen().catch(e => {
            console.error('Error al entrar en pantalla completa:', e);
        });
    }
}

// ===== FUNCIONES DE LA BARRA DE PROGRESO =====

/**
 * Maneja el clic en la barra de progreso para hacer seek
 */
function handleProgressClick(event) {
    if (!videoElement || isDragging || isNaN(videoElement.duration)) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * videoElement.duration;
    
    videoElement.currentTime = newTime;
}

/**
 * Eventos de mouse para drag en la barra de progreso
 */
function handleProgressMouseDown(event) {
    isDragging = true;
    handleProgressClick(event);
}

function handleProgressMouseMove(event) {
    if (!isDragging) return;
    handleProgressClick(event);
}

function handleProgressMouseUp() {
    isDragging = false;
}

/**
 * Eventos de touch para móviles
 */
function handleProgressTouchStart(event) {
    isDragging = true;
    const touch = event.touches[0];
    const rect = event.currentTarget.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, touchX / rect.width));
    
    if (videoElement && !isNaN(videoElement.duration)) {
        const newTime = percentage * videoElement.duration;
        videoElement.currentTime = newTime;
    }
}

function handleProgressTouchMove(event) {
    if (!isDragging || !videoElement || isNaN(videoElement.duration)) return;
    event.preventDefault();
    
    const touch = event.touches[0];
    const rect = progressBar.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, touchX / rect.width));
    const newTime = percentage * videoElement.duration;
    
    videoElement.currentTime = newTime;
}

function handleProgressTouchEnd() {
    isDragging = false;
}

/**
 * Actualiza la barra de progreso
 */
function updateProgress() {
    if (!videoElement || !progressFill || !currentTimeSpan || !durationSpan) return;
    
    const current = videoElement.currentTime;
    const duration = videoElement.duration;
    
    if (isNaN(duration) || isNaN(current)) return;
    
    // Actualizar barra de progreso
    const percentage = (current / duration) * 100;
    progressFill.style.width = `${percentage}%`;
    
    // Actualizar buffer
    if (videoElement.buffered.length > 0) {
        const buffered = videoElement.buffered.end(videoElement.buffered.length - 1);
        const bufferPercentage = (buffered / duration) * 100;
        progressBuffer.style.width = `${bufferPercentage}%`;
    }
    
    // Actualizar tiempo
    currentTimeSpan.textContent = formatTime(current);
    durationSpan.textContent = formatTime(duration);
}

// ===== FUNCIONES DE UI =====

/**
 * Muestra el elemento de carga
 */
function showLoadingElement() {
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
}

/**
 * Oculta el elemento de carga
 */
function hideLoadingElement() {
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

/**
 * Oculta el indicador de autoplay
 */
function hideAutoPlayIndicator() {
    if (autoPlayIndicator && autoPlayIndicator.parentNode) {
        setTimeout(() => {
            autoPlayIndicator.style.opacity = '0';
            setTimeout(() => {
                if (autoPlayIndicator && autoPlayIndicator.parentNode) {
                    autoPlayIndicator.remove();
                }
            }, 300);
        }, 2000);
    }
}

/**
 * Muestra un error de video
 */
function showVideoError(message) {
    if (loadingElement) {
        loadingElement.innerHTML = `
            <div style="color: #ff6b35;">⚠ ${message}</div>
            <button onclick="hideVideoModal()" style="
                margin-top: 1rem; 
                padding: 0.5rem 1rem; 
                background: var(--modal-primary); 
                color: white; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer;
            ">Cerrar</button>
        `;
        loadingElement.style.display = 'flex';
    }
}

/**
 * Muestra un indicador temporal de volumen
 */
function showVolumeIndicator(volume) {
    // Remover indicador existente
    const existing = document.querySelector('.volume-indicator');
    if (existing) existing.remove();
    
    // Crear nuevo indicador
    const indicator = document.createElement('div');
    indicator.className = 'volume-indicator';
    indicator.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.3s ease;
    `;
    indicator.textContent = volume === 0 ? '🔇 Silenciado' : `🔊 ${volume}%`;
    
    if (videoContainer) {
        videoContainer.appendChild(indicator);
        
        // Remover después de 2 segundos
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.remove();
                }
            }, 300);
        }, 2000);
    }
}

/**
 * Actualiza la barra de carga
 */
function updateLoadingProgress(percentage) {
    const loadingProgress = loadingElement?.querySelector('.video-loading-progress');
    if (loadingProgress) {
        loadingProgress.style.width = `${percentage}%`;
    }
}

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Formatea el tiempo en formato MM:SS
 */
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Inicia las actualizaciones periódicas del progreso
 */
function startProgressUpdates() {
    stopProgressUpdates(); // Limpiar cualquier intervalo existente
    progressUpdateInterval = setInterval(updateProgress, 100); // Actualizar cada 100ms
}

/**
 * Detiene las actualizaciones del progreso
 */
function stopProgressUpdates() {
    if (progressUpdateInterval) {
        clearInterval(progressUpdateInterval);
        progressUpdateInterval = null;
    }
}

/**
 * Configura el timer de cierre automático
 */
function setAutoCloseTimer() {
    console.log('Configurando timer de cierre automático...');
    clearAutoCloseTimer();
    
    autoCloseTimer = setTimeout(() => {
        console.log('Cerrando modal automáticamente...');
        hideVideoModal();
    }, LOCAL_VIDEO_CONFIG.autoCloseDelay);
    
    console.log(`Video terminado, cerrando en ${LOCAL_VIDEO_CONFIG.autoCloseDelay}ms`);
}

/**
 * Limpia el timer de cierre automático
 */
function clearAutoCloseTimer() {
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
        console.log('Timer de cierre automático limpiado');
    }
}

// ===== FUNCIONES PÚBLICAS PARA USO EXTERNO =====

/**
 * Muestra el modal manualmente
 */
window.showVideoModal = showVideoModal;

/**
 * Oculta el modal manualmente
 */
window.hideVideoModal = hideVideoModal;

/**
 * Reinicia el modal (permite mostrarlo nuevamente)
 */
window.resetVideoModal = function() {
    hasBeenShown = false;
    sessionStorage.removeItem('videoModalShown');
    console.log('Modal de video reiniciado');
};

/**
 * Cambia la fuente del video
 */
window.changeVideoSource = function(newSrc) {
    if (videoElement) {
        videoElement.src = newSrc;
        videoElement.load();
        isVideoLoaded = false;
        console.log('Fuente de video cambiada a:', newSrc);
    }
};

// ===== INICIALIZACIÓN =====

// Función de inicialización segura
function safeInit() {
    try {
        // Reiniciar variables de estado para asegurar una inicialización limpia
        isInitialized = false;
        isModalVisible = false;
        isVideoLoaded = false;
        hasBeenShown = false; // Aseguramos que se reinicie esta variable
        
        // Limpiar timers existentes
        clearAutoCloseTimer();
        stopProgressUpdates();
        
        // Limpiar sessionStorage para permitir que el modal se muestre nuevamente
        if (LOCAL_VIDEO_CONFIG.showOnlyOnce) {
            sessionStorage.removeItem('videoModalShown');
        }
        
        // Reiniciar elementos del DOM
        const videoModal = document.getElementById('videoModal');
        if (videoModal) {
            videoModal.style.display = 'none';
            videoModal.classList.add('hidden');
            
            // Limpiar el contenedor de video para evitar problemas con el video anterior
            const videoContainer = document.getElementById('videoContainer');
            if (videoContainer) {
                videoContainer.innerHTML = '';
            }
        }
        
        // Inicializar el modal con estado limpio
        initVideoModal();
    } catch (error) {
        console.error('Error al inicializar el modal de video:', error);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
} else {
    // El DOM ya está listo
    safeInit();
}

// Limpiar cuando se cierra la ventana
window.addEventListener('beforeunload', () => {
    clearAutoCloseTimer();
    stopProgressUpdates();
});

console.log('Script del modal de video cargado correctamente');