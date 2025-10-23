// ============================================
// PREVENT ZOOM GLOBALLY
// ============================================
(function preventZoom() {
    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // Prevent pinch zoom
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', function(e) {
        e.preventDefault();
    });
})();

// ============================================
// CHECKLIST DATA STRUCTURE
// ============================================
const CHECKLIST_TEMPLATE = {
    entry: {
        title: 'Entry',
        items: [
            'Front door/Hardware/Lock',
            'Flooring'
        ]
    },
    living: {
        title: 'Living/Dining Area(s)',
        items: [
            'Walls/Paint',
            'Flooring',
            'Lighting/Fixtures/Ceiling Fan'
        ]
    },
    kitchen: {
        title: 'Kitchen',
        items: [
            'Walls/Paint',
            'Flooring',
            'Lighting/Fixtures',
            'Countertops',
            'Cabinets',
            'Sink/Faucet',
            'Stove/Oven/Vent Hood',
            'Refrigerator Interior/Exterior',
            'Pantry',
            'Dishwasher',
            'Microwave',
            'Windows/Screens/Blinds'
        ]
    },
    bedroom: {
        title: 'Bedroom',
        items: [
            'Door/Hardware',
            'Walls/Paint',
            'Flooring',
            'Lighting/Fixtures/Ceiling Fan',
            'Windows/Screens/Blinds',
            'Closet/Door/Shelving'
        ]
    },
    bathroom: {
        title: 'Bathroom',
        items: [
            'Doors/Hardware',
            'Walls/Paint',
            'Flooring',
            'Lighting/Fixtures',
            'Countertop',
            'Sink(s)/Faucet(s)',
            'Cabinets/Shelving',
            'Mirror',
            'Toilet',
            'Tub/Shower'
        ]
    },
    miscellaneous: {
        title: 'Miscellaneous',
        items: [
            'Washer/Dryer',
            'Laundry Door/Shelving',
            'Fireplace',
            'Patio/Balcony Door/Screens/Blinds',
            'Patio/Balcony Flooring/Lighting',
            'Storage Closet(s)/Door/Shelving',
            'Garage',
            'Stairwell(s)'
        ]
    }
};

// ============================================
// APPLICATION STATE
// ============================================
const appState = {
    unitNumber: '',
    moveInDate: '',
    numBedrooms: 1,
    numBathrooms: 1,
    checklist: {},
    photos: {},
    skippedItems: {},  // Track items marked as N/A
    enabledItems: {},
    currentScreen: 'setupScreen',
    currentItem: null
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
    initializeEventListeners();
});

function loadPreferences() {
    // Load enabled items from localStorage (user's customization)
    const saved = localStorage.getItem('enabledItems');
    if (saved) {
        appState.enabledItems = JSON.parse(saved);
    } else {
        // Default: all items enabled
        enableAllItems();
    }
}

function enableAllItems() {
    appState.enabledItems = {};
    Object.keys(CHECKLIST_TEMPLATE).forEach(category => {
        appState.enabledItems[category] = {};
        CHECKLIST_TEMPLATE[category].items.forEach(item => {
            appState.enabledItems[category][item] = true;
        });
    });
}

function savePreferences() {
    localStorage.setItem('enabledItems', JSON.stringify(appState.enabledItems));
}

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    // Setup Screen
    document.getElementById('startInspection').addEventListener('click', startInspection);
    document.getElementById('customizeBtn').addEventListener('click', () => showScreen('customizeScreen'));
    
    // Customize Screen
    document.getElementById('backToSetup').addEventListener('click', () => showScreen('setupScreen'));
    document.getElementById('saveCustomization').addEventListener('click', saveCustomization);
    
    // Checklist Screen
    document.getElementById('settingsBtn').addEventListener('click', () => {
        renderCustomizeScreen();
        showScreen('customizeScreen');
    });
    document.getElementById('finishInspection').addEventListener('click', () => showScreen('reviewScreen'));
    
    // Review Screen
    document.getElementById('backToChecklist').addEventListener('click', () => showScreen('checklistScreen'));
    document.getElementById('exportBtn').addEventListener('click', exportPhotos);
    document.getElementById('startNewInspection').addEventListener('click', resetApp);
}

// ============================================
// SCREEN NAVIGATION
// ============================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    appState.currentScreen = screenId;
    
    // Render content for specific screens
    if (screenId === 'customizeScreen') {
        renderCustomizeScreen();
    } else if (screenId === 'reviewScreen') {
        renderReviewScreen();
    }
}

// ============================================
// START INSPECTION
// ============================================
function startInspection() {
    // Validate inputs
    const unitNumber = document.getElementById('unitNumber').value.trim();
    const moveInDate = document.getElementById('moveInDate').value;
    
    if (!unitNumber || !moveInDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Save setup data
    appState.unitNumber = unitNumber;
    appState.moveInDate = moveInDate;
    appState.numBedrooms = parseInt(document.getElementById('numBedrooms').value);
    appState.numBathrooms = parseInt(document.getElementById('numBathrooms').value);
    
    // Build checklist based on unit configuration
    buildChecklist();
    
    // Initialize photo and skip storage
    appState.photos = {};
    appState.skippedItems = {};
    
    // Render and show checklist
    renderChecklist();
    showScreen('checklistScreen');
    
    // Update header
    document.getElementById('inspectionTitle').textContent = `Unit ${unitNumber}`;
}

// ============================================
// BUILD CHECKLIST
// ============================================
function buildChecklist() {
    appState.checklist = {};
    
    // Add base categories
    Object.keys(CHECKLIST_TEMPLATE).forEach(categoryKey => {
        const category = CHECKLIST_TEMPLATE[categoryKey];
        
        // Handle bedroom multiplication
        if (categoryKey === 'bedroom' && appState.numBedrooms > 0) {
            for (let i = 1; i <= appState.numBedrooms; i++) {
                const bedroomKey = `bedroom${i}`;
                appState.checklist[bedroomKey] = {
                    title: `Bedroom ${i}`,
                    items: [...category.items]
                };
            }
        }
        // Handle bathroom multiplication
        else if (categoryKey === 'bathroom') {
            for (let i = 1; i <= appState.numBathrooms; i++) {
                const bathroomKey = `bathroom${i}`;
                appState.checklist[bathroomKey] = {
                    title: `Bathroom ${i}`,
                    items: [...category.items]
                };
            }
        }
        // Add other categories normally
        else {
            appState.checklist[categoryKey] = {
                title: category.title,
                items: [...category.items]
            };
        }
    });
}

// ============================================
// RENDER CHECKLIST
// ============================================
function renderChecklist() {
    const content = document.getElementById('checklistContent');
    content.innerHTML = '';
    
    Object.keys(appState.checklist).forEach(categoryKey => {
        const category = appState.checklist[categoryKey];
        const section = document.createElement('div');
        section.className = 'category-section';
        
        const title = document.createElement('div');
        title.className = 'category-title';
        title.innerHTML = `<span>📁</span> ${category.title}`;
        section.appendChild(title);
        
        category.items.forEach((item, index) => {
            // Check if item is enabled (skip if customized out)
            const originalCategory = categoryKey.replace(/\d+$/, '');
            const isEnabled = appState.enabledItems[originalCategory]?.[item] !== false;
            
            if (!isEnabled) return;
            
            const itemKey = `${categoryKey}-${index}`;
            const photoCount = appState.photos[itemKey]?.length || 0;
            const isSkipped = appState.skippedItems[itemKey] || false;
            const isCompleted = photoCount > 0 || isSkipped;
            
            let statusClass = '';
            let statusText = 'No photos';
            
            if (photoCount > 0) {
                statusClass = 'completed';
                statusText = `✓ ${photoCount} photo(s)`;
            } else if (isSkipped) {
                statusClass = 'skipped';
                statusText = '⊘ Skipped (N/A)';
            }
            
            const itemDiv = document.createElement('div');
            itemDiv.className = `checklist-item ${statusClass}`;
            itemDiv.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item}</div>
                    <div class="item-status">${statusText}</div>
                </div>
                <div class="item-actions">
                    <button class="item-action-photo">${photoCount > 0 ? '✓' : '📷'}</button>
                    <button class="item-action-skip" title="Skip this item (N/A)">${isSkipped ? '↶' : '⊘'}</button>
                </div>
            `;
            
            // Photo button handler
            itemDiv.querySelector('.item-action-photo').addEventListener('click', () => {
                openCamera(categoryKey, index, item);
            });
            
            // Skip button handler
            itemDiv.querySelector('.item-action-skip').addEventListener('click', () => {
                toggleSkipItem(itemKey);
            });
            
            section.appendChild(itemDiv);
        });
        
        content.appendChild(section);
    });
    
    updateProgress();
}

// ============================================
// PROGRESS TRACKING
// ============================================
function updateProgress() {
    let totalItems = 0;
    let completedItems = 0;
    
    Object.keys(appState.checklist).forEach(categoryKey => {
        const category = appState.checklist[categoryKey];
        category.items.forEach((item, index) => {
            const originalCategory = categoryKey.replace(/\d+$/, '');
            const isEnabled = appState.enabledItems[originalCategory]?.[item] !== false;
            if (!isEnabled) return;
            
            totalItems++;
            const itemKey = `${categoryKey}-${index}`;
            // Count as complete if has photos OR is skipped
            if (appState.photos[itemKey]?.length > 0 || appState.skippedItems[itemKey]) {
                completedItems++;
            }
        });
    });
    
    document.getElementById('progressText').textContent = 
        `${completedItems} of ${totalItems} items complete`;
    
    // Show finish button if all complete
    const finishBtn = document.getElementById('finishInspection');
    if (completedItems === totalItems && totalItems > 0) {
        finishBtn.style.display = 'block';
    } else {
        finishBtn.style.display = 'none';
    }
}

// ============================================
// SKIP ITEM FUNCTIONALITY
// ============================================
function toggleSkipItem(itemKey) {
    // If item has photos, confirm before skipping
    if (appState.photos[itemKey]?.length > 0) {
        if (!confirm('This item has photos. Skip anyway? Photos will be kept.')) {
            return;
        }
    }
    
    // Toggle skip status
    appState.skippedItems[itemKey] = !appState.skippedItems[itemKey];
    
    // If unskipping, make sure it's actually unset
    if (!appState.skippedItems[itemKey]) {
        delete appState.skippedItems[itemKey];
    }
    
    // Re-render checklist to update UI
    renderChecklist();
}

// ============================================
// CAMERA INTERFACE
// ============================================
function openCamera(categoryKey, itemIndex, itemName) {
    appState.currentItem = {
        key: `${categoryKey}-${itemIndex}`,
        name: itemName
    };
    
    document.getElementById('cameraItemTitle').textContent = itemName;
    showScreen('cameraScreen');
    startCamera();
}

// Camera functions are in camera.js

// ============================================
// CUSTOMIZE SCREEN
// ============================================
function renderCustomizeScreen() {
    const container = document.getElementById('categoryToggles');
    container.innerHTML = '';
    
    Object.keys(CHECKLIST_TEMPLATE).forEach(categoryKey => {
        const category = CHECKLIST_TEMPLATE[categoryKey];
        
        const section = document.createElement('div');
        section.className = 'toggle-category';
        
        // Category header with toggle all
        const header = document.createElement('div');
        header.className = 'category-header';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.title;
        
        const toggleAll = document.createElement('div');
        toggleAll.className = 'toggle-all';
        
        // Check if all items are enabled
        const allEnabled = category.items.every(item => 
            appState.enabledItems[categoryKey]?.[item] !== false
        );
        if (allEnabled) toggleAll.classList.add('active');
        
        toggleAll.addEventListener('click', () => {
            const isActive = toggleAll.classList.contains('active');
            toggleAll.classList.toggle('active');
            
            // Toggle all items in this category
            category.items.forEach(item => {
                if (!appState.enabledItems[categoryKey]) {
                    appState.enabledItems[categoryKey] = {};
                }
                appState.enabledItems[categoryKey][item] = !isActive;
                
                // Update individual checkboxes
                const checkbox = section.querySelector(`input[data-item="${item}"]`);
                if (checkbox) checkbox.checked = !isActive;
            });
        });
        
        header.appendChild(categoryTitle);
        header.appendChild(toggleAll);
        section.appendChild(header);
        
        // Individual item toggles
        const itemToggles = document.createElement('div');
        itemToggles.className = 'item-toggles';
        
        category.items.forEach(item => {
            const toggle = document.createElement('label');
            toggle.className = 'item-toggle';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.item = item;
            checkbox.checked = appState.enabledItems[categoryKey]?.[item] !== false;
            
            checkbox.addEventListener('change', () => {
                if (!appState.enabledItems[categoryKey]) {
                    appState.enabledItems[categoryKey] = {};
                }
                appState.enabledItems[categoryKey][item] = checkbox.checked;
                
                // Update toggle-all state
                const allEnabled = category.items.every(i => 
                    appState.enabledItems[categoryKey]?.[i] !== false
                );
                if (allEnabled) {
                    toggleAll.classList.add('active');
                } else {
                    toggleAll.classList.remove('active');
                }
            });
            
            const label = document.createElement('span');
            label.textContent = item;
            
            toggle.appendChild(checkbox);
            toggle.appendChild(label);
            itemToggles.appendChild(toggle);
        });
        
        section.appendChild(itemToggles);
        container.appendChild(section);
    });
}

function saveCustomization() {
    savePreferences();
    showScreen('setupScreen');
    alert('Checklist customization saved!');
}

// ============================================
// REVIEW SCREEN
// ============================================
function renderReviewScreen() {
    const content = document.getElementById('reviewContent');
    content.innerHTML = '';
    
    let totalPhotos = 0;
    let totalSkipped = 0;
    
    Object.keys(appState.checklist).forEach(categoryKey => {
        const category = appState.checklist[categoryKey];
        const section = document.createElement('div');
        section.className = 'review-category';
        
        const title = document.createElement('h3');
        title.textContent = category.title;
        section.appendChild(title);
        
        let categoryHasContent = false;
        
        category.items.forEach((item, index) => {
            const itemKey = `${categoryKey}-${index}`;
            const photos = appState.photos[itemKey];
            const isSkipped = appState.skippedItems[itemKey];
            
            if (photos && photos.length > 0) {
                categoryHasContent = true;
                totalPhotos += photos.length;
                
                const itemDiv = document.createElement('div');
                itemDiv.className = 'review-item';
                
                const itemTitle = document.createElement('h4');
                itemTitle.textContent = `${item} (${photos.length})`;
                itemDiv.appendChild(itemTitle);
                
                const photosDiv = document.createElement('div');
                photosDiv.className = 'review-photos';
                
                photos.forEach(photoData => {
                    const img = document.createElement('img');
                    img.src = photoData;
                    img.className = 'review-photo';
                    photosDiv.appendChild(img);
                });
                
                itemDiv.appendChild(photosDiv);
                section.appendChild(itemDiv);
            } else if (isSkipped) {
                categoryHasContent = true;
                totalSkipped++;
                
                const itemDiv = document.createElement('div');
                itemDiv.className = 'review-item review-item-skipped';
                
                const itemTitle = document.createElement('h4');
                itemTitle.textContent = `${item} ⊘ Skipped (N/A)`;
                itemTitle.style.color = 'var(--gray-600)';
                itemDiv.appendChild(itemTitle);
                
                section.appendChild(itemDiv);
            }
        });
        
        if (categoryHasContent) {
            content.appendChild(section);
        }
    });
    
    // Update summary with photos and skipped count
    let summaryText = `${totalPhotos} photo${totalPhotos !== 1 ? 's' : ''} captured`;
    if (totalSkipped > 0) {
        summaryText += `, ${totalSkipped} item${totalSkipped !== 1 ? 's' : ''} skipped`;
    }
    document.getElementById('reviewSummary').textContent = summaryText;
}

// ============================================
// RESET APP
// ============================================
function resetApp() {
    if (!confirm('Start a new inspection? Current photos will be lost.')) {
        return;
    }
    
    // Reset state
    appState.unitNumber = '';
    appState.moveInDate = '';
    appState.photos = {};
    appState.skippedItems = {};
    appState.checklist = {};
    
    // Clear inputs
    document.getElementById('unitNumber').value = '';
    document.getElementById('moveInDate').value = '';
    
    // Return to setup
    showScreen('setupScreen');
}

// Export appState for use in other modules
window.appState = appState;
