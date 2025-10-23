// ============================================
// CAMERA FUNCTIONALITY v1.2.0
// ============================================
let cameraStream = null;
let wakeLock = null;
let currentZoom = 1;
let videoTrack = null;
let zoomCapabilities = null;
let sessionPhotos = []; // Track photos added during this camera session
let isTablet = false;

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
            setupZoomControls(zoomCapabilities);
        } else {
            // Hide zoom controls if not supported
            document.getElementById('zoomControls').style.display = 'none';
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
// POSITION CAPTURE BUTTON FOR TABLETS
// ============================================
function positionCaptureButton() {
    const captureBtn = document.getElementById('captureBtn');
    
    if (isTablet) {
        // Position in center-right for tablet ergonomics
        captureBtn.style.position = 'fixed';
        captureBtn.style.right = '5%';
        captureBtn.style.bottom = '30%'; // Lower third of screen
        captureBtn.style.left = 'auto';
        captureBtn.style.transform = 'translateY(0)';
    } else {
        // Keep centered for phone
        captureBtn.style.position = 'static';
        captureBtn.style.right = 'auto';
        captureBtn.style.bottom = 'auto';
        captureBtn.style.transform = 'none';
    }
}

// ============================================
// ZOOM CONTROLS
// ============================================
function setupZoomControls(capabilities) {
    const zoomContainer = document.getElementById('zoomControls');
    if (!zoomContainer) return;
    
    const minZoom = capabilities.zoom.min || 1;
    const maxZoom = capabilities.zoom.max || 3;
    const step = capabilities.zoom.step || 0.1;
    currentZoom = minZoom;
    
    // Show zoom controls
    zoomContainer.style.display = 'flex';
    
    // Preset buttons
    const zoom05Btn = document.getElementById('zoom05x');
    const zoom1Btn = document.getElementById('zoom1x');
    const zoom2Btn = document.getElementById('zoom2x');
    const zoomLevel = document.getElementById('zoomLevel');
    
    function updateZoom(newZoom) {
        currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
        videoTrack.applyConstraints({
            advanced: [{ zoom: currentZoom }]
        }).catch(err => console.log('Zoom not applied:', err));
        
        zoomLevel.textContent = `${currentZoom.toFixed(1)}x`;
        
        // Highlight active button
        [zoom05Btn, zoom1Btn, zoom2Btn].forEach(btn => btn?.classList.remove('active'));
        if (Math.abs(currentZoom - 0.5) < 0.1 && zoom05Btn) zoom05Btn.classList.add('active');
        if (Math.abs(currentZoom - 1.0) < 0.1 && zoom1Btn) zoom1Btn.classList.add('active');
        if (Math.abs(currentZoom - 2.0) < 0.1 && zoom2Btn) zoom2Btn.classList.add('active');
    }
    
    // Preset zoom buttons
    if (zoom05Btn && minZoom <= 0.5) {
        zoom05Btn.addEventListener('click', () => updateZoom(0.5));
        zoom05Btn.style.display = 'block';
    } else if (zoom05Btn) {
        zoom05Btn.style.display = 'none';
    }
    
    if (zoom1Btn) {
        zoom1Btn.addEventListener('click', () => updateZoom(1.0));
    }
    
    if (zoom2Btn && maxZoom >= 2.0) {
        zoom2Btn.addEventListener('click', () => updateZoom(2.0));
        zoom2Btn.style.display = 'block';
    } else if (zoom2Btn) {
        zoom2Btn.style.display = 'none';
    }
    
    // Fine control buttons
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => updateZoom(currentZoom - step));
    }
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => updateZoom(currentZoom + step));
    }
    
    // Initialize display
    updateZoom(currentZoom);
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
    const itemKey = window.appState.currentItem.key;
    const photos = window.appState.photos[itemKey] || [];
    
    container.innerHTML = '';
    
    photos.forEach((photoData, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumbnail-wrapper';
        
        const img = document.createElement('img');
        img.src = photoData;
        img.className = 'photo-thumbnail';
        
        // Preview on click
        img.addEventListener('click', () => {
            showPhotoPreview(photoData);
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
// PHOTO PREVIEW
// ============================================
function showPhotoPreview(photoData) {
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
    `;
    
    const img = document.createElement('img');
    img.src = photoData;
    img.style.cssText = `
        max-width: 95%;
        max-height: 95%;
        object-fit: contain;
    `;
    
    overlay.appendChild(img);
    
    // Close on click
    overlay.addEventListener('click', () => {
        overlay.remove();
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
