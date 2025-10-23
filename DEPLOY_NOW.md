# 🚀 QUICK DEPLOY GUIDE

## ✅ Step 1: Create GitHub Repository (DO THIS FIRST!)

1. Go to: https://github.com/new
2. Repository name: `property-inspection-app`
3. Description: `Mobile property inspection app`
4. Set to **Public**
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

---

## ✅ Step 2: Run Deployment

**Option A: Use the Script (Easiest)**

1. Double-click: `deploy.bat` (in this folder)
2. If it asks for credentials, enter your GitHub username and password

**Option B: Manual Commands**

Open Command Prompt and paste these ONE AT A TIME:

```cmd
cd "Z:\Documents\AI Coding\photo-checklist"

git remote add origin https://github.com/bytwyg/property-inspection-app.git

git push -u origin main
```

---

## ✅ Step 3: Enable GitHub Pages

1. Go to: https://github.com/bytwyg/property-inspection-app/settings/pages
2. Under **"Build and deployment"**:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
3. Click **Save**
4. **Wait 2-3 minutes** for deployment

---

## 🎉 Step 4: Access Your App!

Your app will be live at:

```
https://bytwyg.github.io/property-inspection-app
```

### Test on iPad:

1. Open Safari on iPad
2. Go to the URL above
3. Tap Share → "Add to Home Screen"
4. Name it "Property Inspection"
5. Now it looks like an app!

---

## 🔑 GitHub Authentication

If Git asks for credentials:

**Username:** bytwyg  
**Password:** Use a Personal Access Token (not your GitHub password)

### Create Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "Property Inspection Deploy"
4. Select scopes: `repo` (check the box)
5. Click "Generate token"
6. **COPY THE TOKEN** (you can't see it again!)
7. Use this as your password when pushing

---

## 🆘 Troubleshooting

### "Repository already exists"
Already created? Skip to Step 2.

### "Permission denied"
Need to set up authentication. See section above.

### "Could not resolve host"
Check internet connection.

### Can't find deploy.bat
You're already in the folder! Just run the commands in Option B.

---

## ✅ Verification

After GitHub Pages enables (2-3 min), check:

- [ ] Can access URL in browser
- [ ] Camera permissions work on iPad
- [ ] Can take photos
- [ ] Skip button works
- [ ] Can export ZIP

---

**Ready?** Create the GitHub repo, then run `deploy.bat` or the commands!
