# ⚡ Quick Test Instructions

## ✅ What I've Verified (Automated)

- ✅ **No code errors** - All files pass linting
- ✅ **Routes registered** - Donation routes properly connected
- ✅ **Database schema** - Donations table exists
- ✅ **Stripe integration** - Code structure is correct
- ✅ **Frontend** - Donation page has Stripe key

---

## 🔧 What YOU Need to Do (Manual Steps)

### Step 1: Create `.env` File (5 minutes)

```bash
cd backend-api
```

Create `backend-api/.env` file with:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proverbs_book
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT (generate random string)
JWT_SECRET=your_random_secret_key_min_32_characters

# Server
PORT=3000

# Stripe
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Optional
OPENAI_API_KEY=optional_if_using_bible_summaries
```

**⚠️ IMPORTANT**: Replace `your_postgres_password` with your actual PostgreSQL password!

---

### Step 2: Install Dependencies (2 minutes)

```bash
cd backend-api
npm install
```

**Expected**: All packages install without errors

---

### Step 3: Set Up Database (5 minutes)

```bash
# Make sure PostgreSQL is running
# Then run the setup script:
cd backend-api
.\setup-databases.ps1
```

Or manually:
```sql
CREATE DATABASE proverbs_book;
```

---

### Step 4: Start Backend Server (1 minute)

```bash
cd backend-api
npm start
```

**Expected Output**:
```
✓ Database connected
✓ Database tables initialized
═══════════════════════════════════════════════════════════════
  Proverbs Book AI - Backend API Server
  Running on port 3000
═══════════════════════════════════════════════════════════════
```

**If error**: Check PostgreSQL is running and `.env` file is correct

---

### Step 5: Set Up Stripe Webhook (10 minutes)

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/webhooks

2. **Click "Add endpoint"**

3. **Endpoint URL**:
   - For testing: `http://localhost:3000/api/donations/webhook`
   - For production: `https://your-domain.com/api/donations/webhook`

4. **Select Events**:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. **Click "Add endpoint"**

6. **Copy Signing Secret** (starts with `whsec_`)

7. **Add to `.env`**:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_COPIED_SECRET
   ```

8. **Restart server**:
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```

---

### Step 6: Test Donation API (2 minutes)

**Test 1: Health Check**

Open browser: http://localhost:3000/health

**Expected**: `{"status":"ok","timestamp":"..."}`

**Test 2: Create Payment Intent**

```bash
curl -X POST http://localhost:3000/api/donations/create-intent ^
  -H "Content-Type: application/json" ^
  -d "{\"amount\": 10, \"currency\": \"usd\", \"name\": \"Test\"}"
```

**Expected**: Returns JSON with `clientSecret`

**If error**: Check Stripe secret key is correct

---

### Step 7: Test Donation Page (5 minutes)

1. **Open** `website/donate.html` in browser

2. **Update API URL** (line ~261):
   ```javascript
   const API_URL = 'http://localhost:3000/api';
   ```

3. **Fill form**:
   - Amount: $5
   - Name: Test User
   - Email: test@example.com (optional)

4. **Click "Donate Securely via Stripe"**

5. **Use Test Card**:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25` (any future date)
   - CVC: `123` (any 3 digits)
   - ZIP: `12345` (any 5 digits)

6. **Complete Payment**

**Expected**: 
- ✅ Payment processes
- ✅ Success message appears
- ✅ Donation recorded in database

---

### Step 8: Verify Database (2 minutes)

```sql
-- Connect to PostgreSQL
psql -U postgres -d proverbs_book

-- Check donations
SELECT * FROM donations;
```

**Expected**: See your test donation

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module 'stripe'"
**Fix**: Run `npm install` in `backend-api/`

### Issue: "Database connection failed"
**Fix**: 
- Check PostgreSQL is running
- Verify credentials in `.env`
- Run `setup-databases.ps1`

### Issue: "Stripe secret key invalid"
**Fix**: 
- Verify key in Stripe Dashboard
- Check no extra spaces in `.env`
- Ensure key starts with `sk_live_` or `sk_test_`

### Issue: "Webhook signature verification failed"
**Fix**: 
- Verify webhook secret is correct
- Check webhook URL matches exactly
- Ensure using HTTPS in production

---

## ✅ Testing Checklist

- [ ] `.env` file created
- [ ] Dependencies installed
- [ ] Database created
- [ ] Server starts successfully
- [ ] Health check works
- [ ] Payment intent creation works
- [ ] Webhook configured
- [ ] Donation page loads
- [ ] Test payment succeeds
- [ ] Donation recorded in database

---

## 🚀 Production Deployment

After testing works locally:

1. **Deploy backend** to server (Heroku, DigitalOcean, etc.)
2. **Update webhook URL** in Stripe Dashboard
3. **Update API_URL** in `website/donate.html`
4. **Test with real card** (small amount)

---

## 📞 Need Help?

See `TEST-EVERYTHING.md` for detailed troubleshooting.

**Ready to test! Follow steps 1-8 above.** 🧪
