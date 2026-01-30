# Quick Start Guide - Proverbs Book AI

## 🎯 What You Have

1. **Proverbs Book AI Backend** (`backend-api/`)
   - Custom Node.js/Express API
   - PostgreSQL database
   - Authentication & data sync

---

## ⚡ Quick Start (30 Minutes)

### Step 1: Install PostgreSQL

**Windows:**
- Download: https://www.postgresql.org/download/windows/
- Install with default settings

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Databases

```bash
psql -U postgres

# Create Proverbs database
CREATE DATABASE proverbs_book;

\q
```

### Step 3: Set Up Proverbs Backend

```bash
cd backend-api
npm install
cp .env.example .env
# Edit .env with database credentials
npm start
```

**Test**: http://localhost:3000/health

### Step 4: Update Desktop App

Edit `desktop_app/auth.js`:
```javascript
this.apiUrl = 'http://localhost:3000'; // Local
// or
this.apiUrl = 'https://your-api-domain.com'; // Production
```

---

## 🌐 Deploy to Production

### Option 1: DigitalOcean (Easiest)

1. Create account
2. Create App Platform project
3. Connect GitHub repo
4. Add PostgreSQL database
5. Set environment variables
6. Deploy!

**Cost**: ~$12/month per system

### Option 2: Heroku

```bash
# Proverbs API
heroku create proverbs-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main

```

**Cost**: $7/month per system (or free tier)

---

## 📊 Cost Comparison

**Proverbs Backend:**
- Development: Free (local)
- Production: $7-12/month

**Total**: ~$7-12/month for the system

---

## ✅ What's Next

1. ✅ Backend is ready
2. ✅ Deploy to production
3. ✅ Update desktop app API URLs
4. ✅ Start using!

---

## 📝 Notes

- Uses PostgreSQL
- Can run on a single server
- Production-ready
