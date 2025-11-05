// ============================================
// CAMERA FUNCTIONALITY v2.0.0
// Enhanced with pinch-to-zoom and vertical slider
// ============================================
let cameraStream = null;
let wakeLock = null;
let currentZoom = 1;
let videoTrack = null;
let zoomCapabilities = null;
let sessionPhotos = []; // Track photos added during this camera session
let isTablet = false;

// Pinch-to-zoom variables
let initialPinchDistance = 0;
let initialPinchZoom = 1;

// ============================================
// DETECT DEVICE TYPE
// ============================================
function detectDevice() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const minDimension = Math.min(width, height);
    const maxDimension = Math.max(width, height);
    
    // Tablet detection: larger screens in portrait or landscape
    isTablet = minDimension >= 768 || maxDimension >= 1024;
    
    console.log(`Device detection: ${isTablet ? 'Tablet' : 'Phone'} (${width}x${height})`);
}

// ============================================
// START CAMERA
// ============================================
async function startCamera() {
    try {
        detectDevice();
        sessionPhotos = []; // Reset session photos
        
        const video = document.getElementById('cameraVideo');
        
        // Request camera with rear camera preference for mobile
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Use back camera on mobile
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        });
        
        video.srcObject = cameraStream;
        videoTrack = cameraStream.getVideoTracks()[0];
        
        // Check if zoom is supported
        zoomCapabilities = videoTrack.getCapabilities();
        if (zoomCapabilities.zoom) {
            setupZoomSlider(zoomCapabilities);
            setupPinchToZoom();
        } else {
            // Hide zoom controls if not supported
            document.getElementById('zoomSliderContainer').style.display = 'none';
        }
        
        // Position capture button based on device
        positionCaptureButton();
        
        // Request wake lock to keep screen on
        requestWakeLock();
        
        // Load existing photos for this item
        loadExistingPhotos();
        
    } catch (error) {
        console.error('Camera access error:', error);
        alert('Unable to access camera. Please check permissions.');
    }
}

// ============================================
// POSITION CAPTURE BUTTON (No longer needed - using fixed positioning)
// ============================================
function positionCaptureButton() {
    // Camera button now uses consistent fixed positioning via CSS
    // No dynamic repositioning needed
}

// ============================================
// ZOOM SLIDER SETUP
// ============================================
function setupZoomSlider(capabilities) {
    const sliderContainer = document.getElementById('zoomSliderContainer');
    const slider = document.getElementById('zoomSlider');
    const zoomValue = document.getElementById('zoomValue');
    
    if (!sliderContainer || !slider) return;
    
    const minZoom = capabilities.zoom.min || 1;
    const maxZoom = capabilities.zoom.max || 5;
    currentZoom = minZoom;
    
    // Configure slider
    slider.min = minZoom;
    slider.max = maxZoom;
    slider.value = currentZoom;
    slider.step = 0.05; // Smaller step for smoother control
    
    // Show slider
    sliderContainer.style.display = 'flex';
    
    // Debounce timer for constraint application
    let applyZoomTimer = null;
    
    // Update zoom on slider input (immediate UI feedback)
    slider.addEventListener('input', (e) => {
        const newZoom = parseFloat(e.target.value);
        currentZoom = newZoom;
        
        // Update UI immediately (no lag)
        zoomValue.textContent = `${currentZoom.toFixed(1)}x`;
        
        // Debounce actual camera constraint application
        clearTimeout(applyZoomTimer);
        applyZoomTimer = setTimeout(() => {
            applyZoomToCamera(newZoom);
        }, 50); // Apply after 50ms of no changes
    });
    
    // Also apply on change (when user releases slider)
    slider.addEventListener('change', (e) => {
        clearTimeout(applyZoomTimer);
        const newZoom = parseFloat(e.target.value);
        applyZoomToCamera(newZoom);
    });
    
    // Initialize display
    zoomValue.textContent = `${currentZoom.toFixed(1)}x`;
    
    // Apply initial zoom to camera hardware (sync with slider)
    applyZoomToCamera(currentZoom);
}

// ============================================
// APPLY ZOOM TO CAMERA (Optimized)
// ============================================
function applyZoomToCamera(newZoom) {
    if (!videoTrack || !zoomCapabilities?.zoom) return;
    
    const minZoom = zoomCapabilities.zoom.min || 1;
    const maxZoom = zoomCapabilities.zoom.max || 5;
    
    // Clamp zoom value
    currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    // Apply to video track (async but we don't wait)
    videoTrack.applyConstraints({
        advanced: [{ zoom: currentZoom }]
    }).catch(err => console.log('Zoom not applied:', err));
}

// ============================================
// APPLY ZOOM (Legacy - for pinch-to-zoom)
// ============================================
function applyZoom(newZoom) {
    if (!videoTrack || !zoomCapabilities?.zoom) return;
    
    const minZoom = zoomCapabilities.zoom.min || 1;
    const maxZoom = zoomCapabilities.zoom.max || 5;
    
    // Clamp zoom value
    currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    
    // Apply to video track
    videoTrack.applyConstraints({
        advanced: [{ zoom: currentZoom }]
    }).catch(err => console.log('Zoom not applied:', err));
    
    // Update UI
    const slider = document.getElementById('zoomSlider');
    const zoomValue = document.getElementById('zoomValue');
    
    if (slider) slider.value = currentZoom;
    if (zoomValue) zoomValue.textContent = `${currentZoom.toFixed(1)}x`;
}

// ============================================
// PINCH-TO-ZOOM ON CAMERA
// ============================================
function setupPinchToZoom() {
    const cameraContainer = document.querySelector('.camera-container');
    if (!cameraContainer) return;
    
    cameraContainer.addEventListener('touchstart', handlePinchStart);
    cameraContainer.addEventListener('touchmove', handlePinchMove);
    cameraContainer.addEventListener('touchend', handlePinchEnd);
}

function handlePinchStart(e) {
    if (e.touches.length === 2) {
        e.preventDefault();
        initialPinchDistance = getPinchDistance(e.touches);
        initialPinchZoom = currentZoom;
    }
}

function handlePinchMove(e) {
    if (e.touches.length === 2) {
        e.preventDefault();
        
        const currentDistance = getPinchDistance(e.touches);
        const distanceRatio = currentDistance / initialPinchDistance;
        
        // Calculate new zoom based on pinch ratio
        const newZoom = initialPinchZoom * distanceRatio;
        applyZoom(newZoom);
    }
}

function handlePinchEnd(e) {
    if (e.touches.length < 2) {
        initialPinchDistance = 0;
        initialPinchZoom = currentZoom;
    }
}

function getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// ============================================
// STOP CAMERA
// ============================================
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        videoTrack = null;
    }
    
    // Release wake lock
    releaseWakeLock();
}

// ============================================
// WAKE LOCK (Keep Screen On)
// ============================================
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                console.log('Wake lock released');
            });
        }
    } catch (error) {
        console.log('Wake lock not supported or failed:', error);
    }
}

function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
    }
}

// ============================================
// CAPTURE PHOTO
// ============================================
function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const context = canvas.getContext('2d');
    
    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL (base64)
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Store photo
    const itemKey = window.appState.currentItem.key;
    if (!window.appState.photos[itemKey]) {
        window.appState.photos[itemKey] = [];
    }
    window.appState.photos[itemKey].push(photoData);
    
    // Track as session photo
    sessionPhotos.push(photoData);
    
    // Update UI
    updatePhotoThumbnails();
}

// ============================================
// LOAD EXISTING PHOTOS
// ============================================
function loadExistingPhotos() {
    updatePhotoThumbnails();
}

// ============================================
// UPDATE THUMBNAILS
// ============================================
function updatePhotoThumbnails() {
    const container = document.getElementById('photoThumbnails');
    const controlsBar = document.getElementById('cameraControlsBar');
    const itemKey = window.appState.currentItem.key;
    const photos = window.appState.photos[itemKey] || [];
    
    // Show/hide bottom bar based on photo count
    if (photos.length > 0) {
        controlsBar.style.display = 'flex';
    } else {
        controlsBar.style.display = 'none';
    }
    
    container.innerHTML = '';
    
    photos.forEach((photoData, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumbnail-wrapper';
        
        const img = document.createElement('img');
        img.src = photoData;
        img.className = 'photo-thumbnail';
        
        // Preview on click with pinch-to-zoom
        img.addEventListener('click', () => {
            showPhotoPreview(photoData, index);
        });
        
        // Delete button overlay
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'thumbnail-delete';
        deleteBtn.innerHTML = '✕';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Delete this photo?')) {
                window.appState.photos[itemKey].splice(index, 1);
                // Also remove from session photos if it was added this session
                const sessionIndex = sessionPhotos.indexOf(photoData);
                if (sessionIndex > -1) {
                    sessionPhotos.splice(sessionIndex, 1);
                }
                updatePhotoThumbnails();
            }
        });
        
        wrapper.appendChild(img);
        wrapper.appendChild(deleteBtn);
        container.appendChild(wrapper);
    });
    
    // Update count displays
    const count = photos.length;
    document.getElementById('photoCount').textContent = `${count} photo${count !== 1 ? 's' : ''}`;
    document.getElementById('donePhotosBtn').textContent = `Done (${count})`;
}

// ============================================
// PHOTO PREVIEW WITH PINCH-TO-ZOOM
// ============================================
function showPhotoPreview(photoData, photoIndex) {
    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.className = 'photo-preview-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        overflow: hidden;
    `;
    
    // Create container for image (allows transform)
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
        position: relative;
        max-width: 95%;
        max-height: 95%;
        touch-action: none;
    `;
    
    const img = document.createElement('img');
    img.src = photoData;
    img.style.cssText = `
        max-width: 100%;
        max-height: 100vh;
        object-fit: contain;
        transform-origin: center center;
        transition: transform 0.1s ease-out;
    `;
    
    imgContainer.appendChild(img);
    overlay.appendChild(imgContainer);
    
    // Pinch-to-zoom variables for preview
    let previewScale = 1;
    let previewInitialDistance = 0;
    let previewInitialScale = 1;
    let previewTranslateX = 0;
    let previewTranslateY = 0;
    let isDragging = false;
    let lastTouchX = 0;
    let lastTouchY = 0;
    
    // Get original image dimensions
    img.onload = () => {
        const originalWidth = img.offsetWidth;
        const originalHeight = img.offsetHeight;
        
        // Pinch-to-zoom on preview
        overlay.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                previewInitialDistance = getPinchDistance(e.touches);
                previewInitialScale = previewScale;
            } else if (e.touches.length === 1 && previewScale > 1) {
                // Pan when zoomed
                isDragging = true;
                lastTouchX = e.touches[0].clientX;
                lastTouchY = e.touches[0].clientY;
            }
        });
        
        overlay.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                
                const currentDistance = getPinchDistance(e.touches);
                const distanceRatio = currentDistance / previewInitialDistance;
                
                // Calculate new scale (minimum is 1, no smaller than original)
                const newScale = Math.max(1, previewInitialScale * distanceRatio);
                previewScale = newScale;
                
                updatePreviewTransform();
            } else if (e.touches.length === 1 && isDragging && previewScale > 1) {
                e.preventDefault();
                
                const dx = e.touches[0].clientX - lastTouchX;
                const dy = e.touches[0].clientY - lastTouchY;
                
                previewTranslateX += dx;
                previewTranslateY += dy;
                
                lastTouchX = e.touches[0].clientX;
                lastTouchY = e.touches[0].clientY;
                
                updatePreviewTransform();
            }
        });
        
        overlay.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                previewInitialDistance = 0;
                isDragging = false;
            }
            
            // Close on single tap when not zoomed
            if (e.touches.length === 0 && previewScale === 1) {
                overlay.remove();
            }
        });
        
        function updatePreviewTransform() {
            img.style.transform = `scale(${previewScale}) translate(${previewTranslateX / previewScale}px, ${previewTranslateY / previewScale}px)`;
        }
    };
    
    // Close on click (desktop/fallback)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay && previewScale === 1) {
            overlay.remove();
        }
    });
    
    document.body.appendChild(overlay);
}

// ============================================
// CLOSE CAMERA WITH CONFIRMATION
// ============================================
function closeCamera() {
    // Check if there are unsaved photos from this session
    if (sessionPhotos.length > 0) {
        if (!confirm(`Photos haven't been saved! Exit anyway?`)) {
            return; // User cancelled
        }
        
        // Remove session photos
        const itemKey = window.appState.currentItem.key;
        if (window.appState.photos[itemKey]) {
            sessionPhotos.forEach(sessionPhoto => {
                const index = window.appState.photos[itemKey].indexOf(sessionPhoto);
                if (index > -1) {
                    window.appState.photos[itemKey].splice(index, 1);
                }
            });
        }
    }
    
    stopCamera();
    sessionPhotos = []; // Clear session
    renderChecklist(); // Refresh checklist
    showScreen('checklistScreen');
}

// ============================================
// DONE WITH PHOTOS (SAVE)
// ============================================
function doneWithPhotos() {
    sessionPhotos = []; // Mark session as saved
    stopCamera();
    
    // Get current item position in checklist
    const itemKey = window.appState.currentItem.key;
    
    // Render checklist first
    renderChecklist();
    
    // Scroll to next item
    scrollToNextItem(itemKey);
    
    // Return to checklist
    showScreen('checklistScreen');
}

// ============================================
// SCROLL TO NEXT ITEM
// ============================================
function scrollToNextItem(currentItemKey) {
    // Find all checklist items
    const allItems = document.querySelectorAll('.checklist-item');
    
    let foundCurrent = false;
    let nextItem = null;
    
    // Find next incomplete item
    allItems.forEach((itemElement) => {
        if (foundCurrent && !nextItem) {
            // Check if this item is incomplete
            const hasCompleted = itemElement.classList.contains('completed');
            const hasSkipped = itemElement.classList.contains('skipped');
            
            if (!hasCompleted && !hasSkipped) {
                nextItem = itemElement;
            }
        }
        
        // Check if this is our current item by matching the item name
        const itemName = itemElement.querySelector('.item-name')?.textContent;
        if (itemName === window.appState.currentItem.name) {
            foundCurrent = true;
        }
    });
    
    // Scroll to next item or top
    if (nextItem) {
        nextItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        // If no next item, scroll to top to see overall progress
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
document.getElementById('captureBtn').addEventListener('click', capturePhoto);
document.getElementById('closeCameraBtn').addEventListener('click', closeCamera);
document.getElementById('donePhotosBtn').addEventListener('click', doneWithPhotos);

// Reposition button on orientation change
window.addEventListener('resize', () => {
    if (window.appState.currentScreen === 'cameraScreen') {
        detectDevice();
        positionCaptureButton();
    }
});
