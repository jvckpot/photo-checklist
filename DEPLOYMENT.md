# 🚀 Deployment Guide

## Quick Start - 3 Options

### Option 1: Quick Test (Right Now!)

**Fastest way to test - No setup needed:**

1. Open File Explorer
2. Navigate to: `Z:\Documents\AI Coding\photo-checklist`
3. Double-click `test.html` to check browser compatibility
4. Double-click `index.html` to open the app

⚠️ **Note:** Camera might not work from local files. Use Option 2 or 3 for full functionality.

---

### Option 2: Local Server (Recommended for Testing)

**Best for development and testing on your PC:**

#### Using Python (if installed):
```bash
# Open Command Prompt or PowerShell
cd "Z:\Documents\AI Coding\photo-checklist"

# Start server
python -m http.server 8000
```

Then open: **http://localhost:8000**

#### Using Node.js (if installed):
```bash
# Install http-server (one time only)
npm install -g http-server

# Navigate to folder
cd "Z:\Documents\AI Coding\photo-checklist"

# Start server
http-server
```

Then open: **http://localhost:8080**


#### Using VS Code Live Server (Easiest!):
1. Open VS Code
2. Install "Live Server" extension by Ritwick Dey
3. Right-click `index.html` → "Open with Live Server"
4. Browser opens automatically!

---

### Option 3: GitHub Pages (Production - Free Forever!)

**Best for actual use on phones/tablets:**

#### Step 1: Initialize Git Repository
```bash
# Open Git Bash or Command Prompt in the project folder
cd "Z:\Documents\AI Coding\photo-checklist"

# Initialize repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Property inspection checklist app"
```

#### Step 2: Create GitHub Repository
1. Go to https://github.com/bytwyg
2. Click the **"+"** icon (top right) → **New repository**
3. Repository name: `property-inspection-app`
4. Description: "Mobile property inspection app with photo documentation"
5. Keep it **Public** (required for free GitHub Pages)
6. **DO NOT** check "Initialize with README" (we already have one)
7. Click **Create repository**

#### Step 3: Push to GitHub
```bash
# Add GitHub as remote
git remote add origin https://github.com/bytwyg/property-inspection-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```


#### Step 4: Enable GitHub Pages
1. On GitHub, go to your repository
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**
6. Wait 2-3 minutes for deployment

#### Step 5: Access Your Live App!
Your app will be available at:
```
https://bytwyg.github.io/property-inspection-app
```

**Save this URL and share it with your team!**

---

## 📱 Using on Phones/Tablets

### For Your Team Members:

1. **Bookmark the GitHub Pages URL** on their phones/tablets
2. On iPhone: Tap Share → "Add to Home Screen" (makes it look like an app!)
3. On Android: Tap Menu → "Add to Home screen"

### First-Time Setup Per Device:
1. Open the app
2. Grant camera permissions when prompted
3. Click "Customize Checklist" to enable/disable items for your property
4. Settings save automatically!

---

## 🔄 Making Updates

When you want to add features or fix bugs:

```bash
# Make your changes in VS Code
# Then commit and push

git add .
git commit -m "Description of what you changed"
git push

# GitHub Pages updates automatically in 2-3 minutes!
```

---


## ⚠️ Important Notes

### Camera Requirements:
- ✅ Works on local server (localhost)
- ✅ Works on GitHub Pages (HTTPS)
- ❌ Doesn't work opening file directly (file://)

### Browser Support:
- **Best**: Chrome, Edge (Chromium)
- **Good**: Firefox, Safari (iOS 13+)
- **Avoid**: Old Internet Explorer

### Privacy & Security:
- All photos stored locally in browser memory
- Nothing uploaded to cloud until you manually upload ZIP to Teams
- Settings saved in browser only (not synced across devices)

---

## 🆘 Troubleshooting

### "Can't access camera"
- Check browser permissions (camera icon in address bar)
- Try a different browser
- Make sure using HTTPS or localhost

### "Download not working"
- Check browser download permissions
- Disable popup blocker for your site
- Try Chrome if using another browser

### "Settings not saving"
- Check browser isn't in private/incognito mode
- Clear browser cache and try again
- Make sure cookies/storage enabled

### "App looks broken on phone"
- Hard refresh: Settings → Clear cache
- Try accessing from WiFi instead of cellular
- Update browser to latest version

---

## 📊 Testing Checklist

Before rolling out to your team, test:

- [ ] Open test.html - all checks pass?
- [ ] Setup wizard accepts all input types
- [ ] Camera opens and captures photos
- [ ] Multiple photos per item work
- [ ] Can delete photos by tapping thumbnails
- [ ] Progress tracker updates correctly
- [ ] Customize checklist saves settings
- [ ] ZIP downloads with correct filename
- [ ] ZIP contains all photos organized properly
- [ ] Test on at least 2 different devices
- [ ] Test on phone and tablet

---

**Ready to deploy?** Choose your option above and get started! 🚀
