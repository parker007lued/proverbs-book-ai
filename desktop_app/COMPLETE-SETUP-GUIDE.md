# Complete Setup Guide - Desktop App with Authentication

## 🎯 What You Have Now

A **real desktop application** (not just scripts) with:
- ✅ Privacy Policy with agree/disagree requirement
- ✅ Login/Registration system
- ✅ Cross-platform data sync
- ✅ Windows installer (.exe)
- ✅ Mac installer (.dmg)
- ✅ Linux installer (.AppImage, .deb, .rpm)
- ✅ Web deployment ready for Bolt CMS

---

## 📋 Setup Steps

### Step 1: Set Up Backend API

You need a backend API for authentication and data sync. Options:

**Option A: Firebase (Easiest)**
1. Create Firebase project at https://firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore database
4. Update `auth.js` API URL to Firebase endpoints

**Option B: Custom Backend**
1. Set up Node.js/Express backend
2. Create endpoints:
   - `POST /auth/register`
   - `POST /auth/login`
   - `GET /auth/verify`
   - `POST /data/sync`
   - `GET /data/get`
3. Update `auth.js` with your API URL

**Option C: Use Existing Service**
- Update `auth.js` line 6: `this.apiUrl = 'https://your-api-url.com'`

### Step 2: Update API URL

Edit `desktop_app/auth.js`:
```javascript
this.apiUrl = 'https://your-api-url.com'; // Change this
```

### Step 3: Install Dependencies

```bash
cd desktop_app
npm install
```

### Step 4: Build Installers

**Build for current platform:**
```bash
npm run build
```

**Build for all platforms:**
```bash
npm run build:all
```

**Build specific platform:**
```bash
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux
```

### Step 5: Deploy to Website

See `WEB-DEPLOYMENT.md` for Bolt CMS integration.

---

## 🔐 Authentication Flow

1. **First Launch:**
   - App checks privacy policy acceptance
   - Shows privacy policy window
   - User must accept to continue

2. **Login/Register:**
   - Shows login window
   - User can register or login
   - Credentials saved locally (encrypted)

3. **Data Sync:**
   - All chapters/progress sync to cloud
   - Available on all devices
   - Automatic sync on save

---

## 📦 Installer Features

### Windows (.exe)
- Custom installation directory
- Desktop shortcut
- Start menu shortcut
- Privacy policy check during install
- Uninstaller included

### macOS (.dmg)
- Drag-and-drop installation
- Applications folder link
- Privacy policy check on first launch

### Linux (.AppImage, .deb, .rpm)
- AppImage: Portable, no installation needed
- .deb: For Debian/Ubuntu
- .rpm: For Fedora/RedHat
- Privacy policy check on first launch

---

## 🌐 Web Deployment (Bolt CMS)

1. **Upload Installers:**
   - Upload to `files/installers/` directory
   - Organize by platform (windows/, mac/, linux/)

2. **Create Download Page:**
   - Use template from `WEB-DEPLOYMENT.md`
   - Privacy policy check before download
   - Platform detection

3. **Privacy Policy Page:**
   - Upload `privacy-policy.html`
   - Link from download page

---

## 🔒 Privacy Policy Enforcement

- **During Install:** Windows installer checks registry
- **First Launch:** App checks for acceptance
- **Web Download:** Must accept before download button enabled
- **Data Collection:** Only if user accepts

---

## 📊 Data Collected (If Accepted)

- Account information (email, name)
- Usage data (chapters, content)
- Device information (OS, version)
- Sync data (saved chapters, progress)
- Analytics (feature usage, errors)
- Location (country/region only)

---

## 🚀 Next Steps

1. ✅ Set up backend API (Firebase or custom)
2. ✅ Update API URL in `auth.js`
3. ✅ Build installers (`npm run build:all`)
4. ✅ Test installers on each platform
5. ✅ Upload to Bolt CMS (see `WEB-DEPLOYMENT.md`)
6. ✅ Test download flow with privacy policy
7. ✅ Test login and data sync

---

## 📝 Notes

- **Privacy Policy:** Users MUST accept to use app
- **Data Sync:** Requires login (optional but recommended)
- **Offline Mode:** App works offline, syncs when online
- **Cross-Platform:** Same account works on all platforms

---

## 🆘 Troubleshooting

**Build fails:**
- Make sure all dependencies installed: `npm install`
- Check icon files exist in `assets/` folder

**Auth fails:**
- Check API URL in `auth.js`
- Verify backend is running
- Check network connectivity

**Privacy policy not showing:**
- Check `privacy-policy.html` exists
- Verify file paths in `main.js`

---

## ✅ You're Ready!

Follow the steps above and you'll have a complete desktop app with:
- Real installers (not scripts)
- Privacy policy enforcement
- Login system
- Cross-platform data sync
- Web deployment ready
