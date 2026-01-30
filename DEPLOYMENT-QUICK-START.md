# 🚀 Quick Deployment Guide

## Step 1: Set Up Databases

```powershell
cd backend-api
.\setup-databases.ps1
```

Or manually:
```sql
CREATE DATABASE proverbs_book;
```

## Step 2: Configure Backend

1. **Create `.env` file:**

`backend-api/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proverbs_book
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
OPENAI_API_KEY=your_openai_key_optional
```

2. **Install dependencies:**
```bash
cd backend-api
npm install
```

3. **Start server:**
```bash
cd backend-api
npm start
```

## Step 3: Create Admin User

1. Register via API or app
2. Make admin:
```sql
INSERT INTO admin_users (user_id, admin_level)
VALUES (
  (SELECT id FROM users WHERE email = 'your@email.com'),
  'admin'
);
```

## Step 4: Update Desktop App API URL

Edit `desktop_app/auth.js`:
```javascript
const API_URL = 'http://localhost:3000'; // Change to your deployed URL
```

## Step 5: Build Installers

```bash
cd desktop_app
npm install
npm run build:all
```

## Step 6: Deploy Website

1. Push to GitHub
2. Enable GitHub Pages
3. Update API URLs in `website/download.html`

## Step 7: Grant Access to Sarah

1. Login to admin panel
2. Search for Sarah's email
3. Click "Grant Free Access"
4. Select plan (Premium or Pro)
5. Save

Done! 🎉
