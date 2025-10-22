# 📋 Property Inspection Checklist App

A mobile-first web application for conducting property move-in inspections with photo documentation.

## 🎯 Purpose

This app streamlines the property inspection process by:
- Guiding users through a structured checklist
- Capturing photos using device camera
- Organizing photos by category and item
- Exporting everything as a labeled ZIP file for Teams upload

## ✨ Features

- **Setup Wizard**: Enter unit number, move-in date, and property details
- **Smart Checklist**: Automatically adjusts for number of bedrooms/bathrooms
- **Camera Integration**: Direct access to device camera with photo preview
- **Photo Management**: Take multiple photos per item, review, and delete
- **Customization**: Enable/disable checklist items based on property
- **Screen Lock**: Keeps device awake during inspection
- **ZIP Export**: Downloads organized photos as `Unit_[number]_MoveIn_[date].zip`

## 🚀 Getting Started

### Option 1: Local Testing (Easiest)

1. Open `index.html` directly in your browser
   - Double-click the file
   - OR right-click → Open with → Chrome/Firefox/Edge

2. **IMPORTANT**: Camera access requires HTTPS in production
   - Local testing works fine
   - For production, use GitHub Pages or similar hosting

### Option 2: Local Web Server (Recommended for Camera Testing)


If you have Python installed:

```bash
# Navigate to the project folder
cd "Z:\Documents\AI Coding\photo-checklist"

# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

If you have Node.js installed:

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run server
http-server

# Then open: http://localhost:8080
```

### Option 3: GitHub Pages (Production Deployment)

1. Initialize Git repository:
   ```bash
   cd "Z:\Documents\AI Coding\photo-checklist"
   git init
   git add .
   git commit -m "Initial commit: Property inspection app"
   ```

2. Create GitHub repository:
   - Go to github.com/bytwyg
   - Click "New Repository"
   - Name it: `property-inspection-app`
   - Don't initialize with README (we have one)


3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/bytwyg/property-inspection-app.git
   git branch -M main
   git push -u origin main
   ```

4. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, folder: / (root)
   - Save
   - Your app will be live at: `https://bytwyg.github.io/property-inspection-app`

## 📱 Usage Guide

### Step 1: Setup Inspection
1. Enter **Unit Number** (e.g., 101)
2. Select **Move-In Date**
3. Choose **Number of Bedrooms** (0 for studio)
4. Choose **Number of Bathrooms**
5. Click **Start Inspection** or **Customize Checklist**

### Step 2: Take Photos
1. Tap any checklist item (e.g., "Front door/Hardware/Lock")
2. Camera opens automatically
3. Tap the 📷 button to capture photos
4. Take as many photos as needed
5. Tap thumbnails to delete unwanted photos
6. Click **Done** when finished with that item

### Step 3: Complete Inspection
1. Progress tracker shows items completed
2. **Finish & Export Photos** button appears when all items done
3. You can skip items if they don't apply


### Step 4: Export & Upload to Teams
1. Click **Download ZIP**
2. File downloads as: `Unit_101_MoveIn_2025-10-22.zip`
3. Go to Microsoft Teams → Your Property → Maintenance folder
4. Upload the ZIP file

## ⚙️ Customization

### Customize Checklist
- Click ⚙️ **Customize Checklist** on setup screen
- Toggle entire categories on/off
- Toggle individual items within categories
- Settings are saved in browser (persist between uses)

### Default Checklist Categories
- **Entry**: Front door, flooring
- **Living/Dining**: Walls, flooring, lighting
- **Kitchen**: 13 items (appliances, fixtures, etc.)
- **Bedrooms**: Dynamically created based on unit
- **Bathrooms**: Dynamically created based on unit
- **Miscellaneous**: Washer/dryer, patio, garage, etc.

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Structure
- **CSS3**: Responsive mobile-first design
- **Vanilla JavaScript**: No frameworks needed
- **MediaDevices API**: Camera access
- **Wake Lock API**: Keep screen on during inspection
- **LocalStorage API**: Save user preferences
- **JSZip Library**: Create downloadable ZIP files


### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (iOS 13+)
- ⚠️ Requires HTTPS for camera in production

### File Structure
```
photo-checklist/
├── index.html          # Main app entry point
├── css/
│   └── style.css      # All styling
├── js/
│   ├── app.js         # Core app logic & state management
│   ├── camera.js      # Camera access & photo capture
│   └── export.js      # ZIP file generation
└── README.md          # This file
```

## 🐛 Troubleshooting

### Camera Not Working
- **Local file**: Open with `http://localhost` server (see Getting Started)
- **Permissions**: Check browser camera permissions
- **HTTPS**: Production requires HTTPS (GitHub Pages provides this)

### Photos Not Saving
- Check browser LocalStorage isn't full
- Clear browser cache and try again
- Photos are stored in memory until ZIP export

### ZIP Download Not Working
- Check browser download permissions
- Try a different browser (Chrome recommended)
- Ensure popup blocker isn't preventing download


### Screen Won't Stay Awake
- Wake Lock API requires HTTPS in production
- Some browsers don't support Wake Lock
- Alternative: Adjust device settings to prevent sleep

## 📝 Future Enhancements

Potential features for future versions:
- [ ] Add notes/comments to photos
- [ ] Email photos directly from app
- [ ] Cloud storage integration (OneDrive/SharePoint)
- [ ] Offline mode with Service Worker
- [ ] Generate PDF report with photos
- [ ] Multiple language support
- [ ] Photo annotation/markup tools
- [ ] Comparison mode for move-in vs move-out

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📄 License

Free to use and modify for your property management needs.

## 👤 Author

Created for streamlining property inspection workflows.

---

**Questions or Issues?** 
Open an issue on GitHub or contact your development team.
