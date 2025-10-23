// ============================================
// CAMERA FUNCTIONALITY
// ============================================
let cameraStream = null;
let wakeLock = null;

// ============================================
// START CAMERA
// ============================================
async function startCamera() {
    try {
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
// STOP CAMERA
// ============================================
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
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
            // Wake lock active but no indicator shown
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
    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Store photo
    const itemKey = window.appState.currentItem.key;
    if (!window.appState.photos[itemKey]) {
        window.appState.photos[itemKey] = [];
    }
    window.appState.photos[itemKey].push(photoData);
    
    // Update UI
    updatePhotoThumbnails();
    
    // Flash effect
    canvas.style.display = 'block';
    setTimeout(() => {
        canvas.style.display = 'none';
    }, 100);
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
        const img = document.createElement('img');
        img.src = photoData;
        img.className = 'photo-thumbnail';
        img.addEventListener('click', () => {
            if (confirm('Delete this photo?')) {
                window.appState.photos[itemKey].splice(index, 1);
                updatePhotoThumbnails();
            }
        });
        container.appendChild(img);
    });
    
    // Update count displays
    const count = photos.length;
    document.getElementById('photoCount').textContent = `${count} photo${count !== 1 ? 's' : ''}`;
    document.getElementById('donePhotosBtn').textContent = `Done (${count})`;
}

// ============================================
// CLOSE CAMERA
// ============================================
function closeCamera() {
    stopCamera();
    renderChecklist(); // Refresh checklist to show updated photo counts
    showScreen('checklistScreen');
}

// ============================================
// EVENT LISTENERS
// ============================================
document.getElementById('captureBtn').addEventListener('click', capturePhoto);
document.getElementById('closeCameraBtn').addEventListener('click', closeCamera);
document.getElementById('donePhotosBtn').addEventListener('click', closeCamera);
