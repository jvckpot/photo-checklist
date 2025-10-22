# Changelog

All notable changes to the Property Inspection Checklist App.

## [1.1.1] - 2025-10-22

### 🐛 Bug Fixes

#### UI Polish
- ✅ Fixed container top margin (added 10px spacing)
- ✅ Fixed camera capture button centering
- ✅ Fixed camera back button visibility (was showing as white box)
- ✅ Added semi-transparent styling to camera header button
- ✅ Improved camera screen visual hierarchy

### 🔧 Technical Changes
- Updated `.container` margin to `10px auto 0 auto`
- Added flexbox centering to `.btn-capture`
- Added specific styling for `.camera-header button`

---

## [1.1.0] - 2025-10-22

### 🎉 New Features

#### Skip Functionality
- ✅ Added "Skip" button next to photo button for each checklist item
- ✅ Items can be marked as complete without taking photos (N/A items)
- ✅ Skipped items show with ⊘ icon and different styling
- ✅ Skipped items count toward completion progress
- ✅ Skipped items appear in review screen (marked separately from photos)
- ✅ Skip button changes to "undo" (↶) when item is skipped
- ✅ Confirmation prompt if trying to skip item that has photos

#### Visual Updates
- ✅ Checklist items now have dual action buttons (Photo / Skip)
- ✅ Skipped items have gray styling to differentiate from photographed items
- ✅ Review screen shows skipped items with italic text
- ✅ Summary includes count of both photos and skipped items

### 🔧 Technical Changes
- Added `skippedItems` object to application state
- Added `toggleSkipItem()` function for skip functionality
- Updated `updateProgress()` to count skipped items as complete
- Updated `renderChecklist()` with new button layout
- Updated `renderReviewScreen()` to display skipped items
- Added new CSS classes: `.skipped`, `.item-actions`, `.item-action-skip`
- Added gray-400 and gray-700 color variables

### 📝 Notes
- Customization settings (gear icon) remain for property-wide omissions
- Skip feature is for per-inspection, per-item decisions
- Skipped items are NOT included in ZIP export (no photos to export)
- Skip status resets when starting new inspection

---

## [1.0.0] - 2025-10-22

### 🎉 Initial Release

#### Features
- ✅ Setup wizard with unit configuration
- ✅ Dynamic checklist based on bedrooms/bathrooms
- ✅ Camera integration for photo capture
- ✅ Multiple photos per checklist item
- ✅ Photo review and deletion
- ✅ Progress tracking
- ✅ Customizable checklist (enable/disable items)
- ✅ Settings persistence via LocalStorage
- ✅ Wake Lock to keep screen on during inspection
- ✅ ZIP export with organized filenames
- ✅ Mobile-first responsive design

#### Technical Stack
- Pure HTML/CSS/JavaScript (no frameworks)
- JSZip library for ZIP file generation
- MediaDevices API for camera access
- Wake Lock API for screen management
- LocalStorage API for preferences

#### Files Included
- `index.html` - Main application
- `test.html` - Browser compatibility tester
- `css/style.css` - All styling
- `js/app.js` - Core logic (523 lines)
- `js/camera.js` - Camera handling (162 lines)
- `js/export.js` - ZIP generation (73 lines)
- `README.md` - Documentation
- `DEPLOYMENT.md` - Deployment guide
- `.gitignore` - Git configuration

---

## Future Versions (Planned)

### [1.2.0] - Planned
- Add notes field per item
- Improve offline support
- Add dark mode

### [1.3.0] - Planned
- PDF report generation
- Direct Teams integration
- Multi-language support

---

## Version Format

Format: [MAJOR.MINOR.PATCH]
- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes
