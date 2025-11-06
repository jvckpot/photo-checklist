// ============================================
// EXPORT PHOTOS AS ZIP
// ============================================
async function exportPhotos() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';
    
    try {
        // Create ZIP using JSZip library
        const zip = new JSZip();
        
        // Iterate through all photos
        let photoCounter = 1;
        
        Object.keys(window.appState.checklist).forEach(categoryKey => {
            const category = window.appState.checklist[categoryKey];
            
            category.items.forEach((item, index) => {
                const itemKey = `${categoryKey}-${index}`;
                const photos = window.appState.photos[itemKey];
                
                if (photos && photos.length > 0) {
                    photos.forEach((photoData, photoIndex) => {
                        // Create filename: PhotoNumber_Category_Item_PhotoIndex.jpg
                        const cleanCategory = category.title.replace(/[/\\:*?"<>|]/g, '-');
                        const cleanItem = item.replace(/[/\\:*?"<>|]/g, '-');
                        const filename = `${photoCounter}_${cleanCategory}_${cleanItem}_${photoIndex + 1}.jpg`;
                        
                        // Remove data URL prefix
                        const base64Data = photoData.split(',')[1];
                        
                        // Add directly to ZIP root (no subfolder)
                        zip.file(filename, base64Data, { base64: true });
                        photoCounter++;
                    });
                }
            });
        });
        
        // Generate ZIP file
        const zipBlob = await zip.generateAsync({ 
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        // Create download filename with inspection type
        const unitNum = window.appState.unitNumber;
        const inspectionType = window.appState.inspectionType;
        const inspectionDate = window.appState.moveInDate;
        const zipFilename = `Unit_${unitNum}_${inspectionType}_${inspectionDate}.zip`;
        
        // Trigger download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = zipFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(link.href);
        
        loadingOverlay.style.display = 'none';
        
        alert(`ZIP file downloaded successfully!\n\nFilename: ${zipFilename}\n\nYou can now upload this to your Teams folder.`);
        
    } catch (error) {
        console.error('Export error:', error);
        loadingOverlay.style.display = 'none';
        alert('Error creating ZIP file. Please try again.');
    }
}
