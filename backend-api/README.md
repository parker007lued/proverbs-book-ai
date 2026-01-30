# Proverbs Book AI - Backend API

Complete Node.js/Express backend with PostgreSQL database for authentication and data sync.

## 🚀 Quick Start

### 1. Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the postgres password you set

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

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE proverbs_book;

# Exit
\q
```

### 3. Install Dependencies

```bash
cd backend-api
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 5. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on http://localhost:3000

## 📡 API Endpoints

### Authentication

**POST /api/auth/register**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "displayName": "User Name",
  "platform": "win32"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "platform": "win32"
}
```

**GET /api/auth/verify**
Headers: `Authorization: Bearer <token>`

### Data Sync

**POST /api/data/sync**
Headers: `Authorization: Bearer <token>`
```json
{
  "data": {
    "chapters": [
      {
        "number": 1,
        "contentType": "commentary",
        "content": "Chapter content..."
      }
    ],
    "progress": {
      "chaptersCompleted": 5,
      "lastChapter": 5
    },
    "settings": {
      "theme": "dark",
      "notifications": true
    }
  }
}
```

**GET /api/data/get**
Headers: `Authorization: Bearer <token>`

**DELETE /api/data/chapter/:chapterNumber**
Headers: `Authorization: Bearer <token>`

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection protection (parameterized queries)

## 📦 Deployment

### Option 1: DigitalOcean App Platform
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Option 2: Heroku
```bash
heroku create proverbs-book-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Option 3: AWS/Docker
See `docker-compose.yml` for Docker setup.

## 🔧 Environment Variables

See `.env.example` for all required variables.

## 📊 Database Schema

- `users` - User accounts
- `user_chapters` - Saved chapters
- `user_progress` - User progress data
- `user_settings` - User preferences

## ✅ Testing

```bash
npm test
```

## 🆘 Troubleshooting

**Database connection failed:**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Check firewall settings

**Port already in use:**
- Change PORT in `.env`
- Or kill process using port 3000
