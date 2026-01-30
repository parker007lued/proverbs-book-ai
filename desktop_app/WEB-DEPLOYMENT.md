# Web Deployment Guide - Bolt CMS Integration

## Overview
This guide explains how to deploy Proverbs Book AI installers to your website using Bolt CMS.

## Installer Files Structure

After building, you'll have these files in `dist/`:

### Windows
- `Proverbs-Book-AI-Setup-x.x.x.exe` - NSIS installer
- `Proverbs-Book-AI-Setup-x.x.x.exe.blockmap` - Update metadata

### macOS
- `Proverbs-Book-AI-x.x.x.dmg` - DMG installer
- `Proverbs-Book-AI-x.x.x-mac.zip` - ZIP archive

### Linux
- `Proverbs-Book-AI-x.x.x.AppImage` - AppImage (universal)
- `proverbs-book-ai_x.x.x_amd64.deb` - Debian package
- `proverbs-book-ai-x.x.x.x86_64.rpm` - RPM package

## Bolt CMS Setup

### 1. Create Download Page

Create a new page in Bolt CMS:

**Title:** Download Proverbs Book AI
**Slug:** download
**Template:** download.twig

### 2. Upload Installer Files

Upload all installer files to Bolt's files directory:
```
files/
  installers/
    windows/
      Proverbs-Book-AI-Setup-latest.exe
    mac/
      Proverbs-Book-AI-latest.dmg
    linux/
      Proverbs-Book-AI-latest.AppImage
      proverbs-book-ai-latest.deb
      proverbs-book-ai-latest.rpm
```

### 3. Create Download Template

Create `themes/your-theme/download.twig`:

```twig
{% extends 'base.twig' %}

{% block content %}
<div class="download-page">
    <h1>Download Proverbs Book AI</h1>
    
    <!-- Privacy Policy Check -->
    <div id="privacyCheck" class="privacy-check">
        <h2>Privacy Policy & Terms</h2>
        <p>Before downloading, please read and accept our Privacy Policy and Terms of Service.</p>
        <iframe src="/privacy-policy.html" width="100%" height="600px" style="border: 1px solid #ddd; border-radius: 8px;"></iframe>
        <div class="privacy-actions">
            <label>
                <input type="checkbox" id="privacyAccept" required>
                I have read and agree to the Privacy Policy and Terms of Service
            </label>
            <button id="downloadBtn" disabled>Accept & Download</button>
        </div>
    </div>

    <!-- Platform Selection (shown after privacy acceptance) -->
    <div id="platformSelection" style="display: none;">
        <h2>Select Your Platform</h2>
        
        <div class="platform-options">
            <div class="platform-card" data-platform="windows">
                <h3>Windows</h3>
                <p>Windows 10/11</p>
                <a href="/files/installers/windows/Proverbs-Book-AI-Setup-latest.exe" class="download-link" download>
                    Download .exe
                </a>
            </div>
            
            <div class="platform-card" data-platform="mac">
                <h3>macOS</h3>
                <p>macOS 10.14+</p>
                <a href="/files/installers/mac/Proverbs-Book-AI-latest.dmg" class="download-link" download>
                    Download .dmg
                </a>
            </div>
            
            <div class="platform-card" data-platform="linux">
                <h3>Linux</h3>
                <p>Ubuntu, Debian, Fedora, etc.</p>
                <div class="linux-options">
                    <a href="/files/installers/linux/Proverbs-Book-AI-latest.AppImage" class="download-link" download>
                        AppImage
                    </a>
                    <a href="/files/installers/linux/proverbs-book-ai-latest.deb" class="download-link" download>
                        .deb
                    </a>
                    <a href="/files/installers/linux/proverbs-book-ai-latest.rpm" class="download-link" download>
                        .rpm
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.getElementById('privacyAccept').addEventListener('change', function() {
    document.getElementById('downloadBtn').disabled = !this.checked;
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    // Save acceptance to localStorage
    localStorage.setItem('privacy_accepted', 'true');
    localStorage.setItem('privacy_accepted_date', new Date().toISOString());
    
    // Show platform selection
    document.getElementById('privacyCheck').style.display = 'none';
    document.getElementById('platformSelection').style.display = 'block';
    
    // Detect platform and highlight
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('win')) {
        document.querySelector('[data-platform="windows"]').classList.add('highlighted');
    } else if (platform.includes('mac')) {
        document.querySelector('[data-platform="mac"]').classList.add('highlighted');
    } else if (platform.includes('linux')) {
        document.querySelector('[data-platform="linux"]').classList.add('highlighted');
    }
});
</script>
{% endblock %}
```

### 4. Add Privacy Policy Page

Create a page with slug `privacy-policy` and upload `privacy-policy.html` content.

### 5. CSS Styling

Add to your theme's CSS:

```css
.download-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

.privacy-check {
    background: white;
    padding: 30px;
    border-radius: 12px;
    margin-bottom: 30px;
}

.platform-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.platform-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    border: 2px solid #e0e0e0;
    transition: all 0.3s;
}

.platform-card:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.platform-card.highlighted {
    border-color: #667eea;
    background: #f0f4ff;
}

.download-link {
    display: inline-block;
    padding: 12px 24px;
    background: #667eea;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    margin: 5px;
    transition: all 0.3s;
}

.download-link:hover {
    background: #5568d3;
}
```

## Automatic Updates

The app uses `electron-updater` for automatic updates. Configure in `package.json`:

```json
"publish": {
  "provider": "generic",
  "url": "https://yourwebsite.com/updates/"
}
```

Upload update files to:
```
files/updates/
  windows/
    latest.yml
    Proverbs-Book-AI-Setup-x.x.x.exe
  mac/
    latest-mac.yml
    Proverbs-Book-AI-x.x.x.dmg
  linux/
    latest-linux.yml
    Proverbs-Book-AI-x.x.x.AppImage
```

## Security

1. **HTTPS Required**: All downloads must be over HTTPS
2. **File Verification**: Provide SHA256 checksums for verification
3. **Rate Limiting**: Implement rate limiting on download endpoints
4. **Privacy Compliance**: Ensure GDPR/CCPA compliance

## Testing

1. Test privacy policy acceptance flow
2. Test downloads on all platforms
3. Verify installer functionality
4. Test automatic updates
