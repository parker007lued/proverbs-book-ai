# Deployment Guide - Backend API

## 🚀 Quick Deployment Options

### Option 1: DigitalOcean App Platform (Easiest)

1. **Create Account**: https://www.digitalocean.com
2. **Create App**:
   - Connect GitHub repository
   - Select Node.js
   - Add PostgreSQL database
3. **Set Environment Variables**:
   ```
   DB_HOST=<database-host>
   DB_NAME=proverbs_book
   DB_USER=<user>
   DB_PASSWORD=<password>
   JWT_SECRET=<random-secret-key>
   NODE_ENV=production
   ```
4. **Deploy**: Automatic deployment on git push

**Cost**: ~$12/month (includes database)

---

### Option 2: Heroku (Free Tier Available)

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Login**: `heroku login`
3. **Create App**: `heroku create proverbs-book-api`
4. **Add Database**: `heroku addons:create heroku-postgresql:hobby-dev`
5. **Set Config**:
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set NODE_ENV=production
   ```
6. **Deploy**: `git push heroku main`

**Cost**: Free tier available, $7/month for production

---

### Option 3: AWS EC2 (Most Control)

1. **Launch EC2 Instance** (Ubuntu 22.04)
2. **Install Dependencies**:
   ```bash
   sudo apt update
   sudo apt install nodejs npm postgresql
   ```
3. **Set Up Database**:
   ```bash
   sudo -u postgres createdb proverbs_book
   ```
4. **Clone & Deploy**:
   ```bash
   git clone <your-repo>
   cd backend-api
   npm install
   npm start
   ```
5. **Set Up PM2** (process manager):
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 save
   pm2 startup
   ```

**Cost**: ~$5-10/month

---

### Option 4: Docker (Any Platform)

1. **Build Image**:
   ```bash
   docker build -t proverbs-api .
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

3. **Access**: http://localhost:3000

**Works on**: Any platform with Docker

---

## 📋 Pre-Deployment Checklist

- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] JWT_SECRET set (strong random key)
- [ ] CORS origins configured
- [ ] SSL certificate (for production)
- [ ] Domain name configured
- [ ] Database backups enabled
- [ ] Monitoring set up

---

## 🔧 Environment Variables

Create `.env` file:

```env
PORT=3000
NODE_ENV=production

DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=proverbs_book
DB_USER=postgres
DB_PASSWORD=secure-password
DB_SSL=true

JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRES_IN=30d

ALLOWED_ORIGINS=https://yourwebsite.com,https://app.yourwebsite.com
```

---

## ✅ Post-Deployment

1. **Test Health Endpoint**: `curl https://your-api.com/health`
2. **Test Registration**: Use Postman or curl
3. **Monitor Logs**: Check for errors
4. **Set Up Backups**: Database backups daily
5. **Update Desktop App**: Update `auth.js` API URL

---

## 🆘 Troubleshooting

**Database connection fails:**
- Check firewall rules
- Verify credentials
- Check SSL settings

**CORS errors:**
- Update ALLOWED_ORIGINS
- Check request headers

**JWT errors:**
- Verify JWT_SECRET is set
- Check token expiration
