# 🧪 Complete Testing Guide

## ✅ Automated Tests Completed

### 1. Code Structure ✓
- ✅ All backend routes exist and are properly structured
- ✅ Database schema includes donations table
- ✅ Stripe integration code is syntactically correct
- ✅ Frontend donation page has Stripe integration
- ✅ All imports and dependencies are correct

### 2. File Verification ✓
- ✅ `backend-api/routes/donations.js` - Donation API routes
- ✅ `backend-api/config/database.js` - Donations table schema
- ✅ `backend-api/server.js` - Donation routes registered
- ✅ `website/donate.html` - Stripe publishable key added
- ✅ `backend-api/env.template` - Secret key template

---

## 🔧 Manual Testing Required

### Step 1: Backend API Setup

#### 1.1 Create `.env` File

```bash
cd backend-api
cp env.template .env
```

Edit `backend-api/.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proverbs_book
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=generate_a_random_string_here_min_32_chars

# Server
PORT=3000

# Stripe
STRIPE_SECRET_KEY=mk_1QvQa2C18TJUjM0RG0t7XW2x
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Optional
OPENAI_API_KEY=your_openai_key_if_using
```

#### 1.2 Install Dependencies

```bash
cd backend-api
npm install
```

#### 1.3 Test Database Connection

```bash
# Make sure PostgreSQL is running
npm start
```

**Expected**: Server starts on port 3000, database connects successfully

**If error**: Check PostgreSQL is running and credentials are correct

---

### Step 2: Stripe Webhook Setup

#### 2.1 Create Webhook Endpoint

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `http://localhost:3000/api/donations/webhook` (for testing)
   - For production: `https://your-domain.com/api/donations/webhook`
4. Select events:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **"Signing secret"** (starts with `whsec_`)
7. Add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_COPIED_SECRET
   ```

#### 2.2 Test Webhook Locally (Optional)

For local testing, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/donations/webhook
```

---

### Step 3: Test Donation Flow

#### 3.1 Start Backend Server

```bash
cd backend-api
npm start
```

**Expected**: 
```
✓ Database connected
✓ Database tables initialized
Server running on port 3000
```

#### 3.2 Test Donation API

**Test 1: Create Payment Intent**

```bash
curl -X POST http://localhost:3000/api/donations/create-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10,
    "currency": "usd",
    "email": "test@example.com",
    "name": "Test Donor",
    "message": "Test donation"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

**If error**: Check Stripe secret key is correct

#### 3.3 Test Donation Page

1. Open `website/donate.html` in browser
2. Update API URL in the file:
   ```javascript
   const API_URL = 'http://localhost:3000/api'; // For testing
   ```
3. Try making a test donation:
   - Amount: $5
   - Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)

**Expected**: Payment processes successfully, success message appears

---

### Step 4: Database Verification

#### 4.1 Check Donations Table

```sql
-- Connect to PostgreSQL
psql -U postgres -d proverbs_book

-- Check table exists
\dt donations

-- Check donations (after test)
SELECT * FROM donations;
```

**Expected**: Table exists, donations are recorded

---

### Step 5: Frontend Integration Test

#### 5.1 Update Donation Page API URL

Edit `website/donate.html`:
```javascript
// For local testing
const API_URL = 'http://localhost:3000/api';

// For production (update when deployed)
// const API_URL = 'https://your-api-domain.com/api';
```

#### 5.2 Test Complete Flow

1. Open `website/donate.html` in browser
2. Fill donation form:
   - Select amount: $10
   - Name: Test User
   - Email: test@example.com (optional)
   - Message: Test donation
3. Click "Donate Securely via Stripe"
4. Use test card: `4242 4242 4242 4242`
5. Complete payment

**Expected**:
- ✅ Payment intent created
- ✅ Stripe checkout opens
- ✅ Payment succeeds
- ✅ Success message appears
- ✅ Donation recorded in database

---

### Step 6: Production Deployment Test

#### 6.1 Update URLs

**Backend** (`backend-api/.env`):
```env
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.com
```

**Frontend** (`website/donate.html`):
```javascript
const API_URL = 'https://your-api-domain.com/api';
```

#### 6.2 Update Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Update endpoint URL to production:
   ```
   https://your-api-domain.com/api/donations/webhook
   ```
3. Ensure HTTPS is enabled

#### 6.3 Test Live Payment

Use a real card (small amount like $1) to test:
- ✅ Payment processes
- ✅ Webhook receives event
- ✅ Database updates
- ✅ Receipt email sent (if email provided)

---

## 🐛 Troubleshooting

### Issue: "Stripe secret key invalid"

**Solution**:
- Verify key starts with `sk_live_` or `sk_test_`
- Check key is correct in Stripe Dashboard
- Ensure no extra spaces in `.env` file

### Issue: "Webhook signature verification failed"

**Solution**:
- Verify webhook secret is correct
- Check webhook URL matches exactly
- Ensure using HTTPS in production

### Issue: "Payment intent creation failed"

**Solution**:
- Check Stripe secret key is correct
- Verify amount is valid (>= $1)
- Check API URL is correct

### Issue: "Database connection failed"

**Solution**:
- Verify PostgreSQL is running
- Check database credentials
- Ensure database exists: `CREATE DATABASE proverbs_book;`

---

## ✅ Testing Checklist

### Backend
- [ ] `.env` file created with all keys
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors
- [ ] Database connects successfully
- [ ] Donations table exists
- [ ] Payment intent creation works
- [ ] Webhook receives events

### Frontend
- [ ] Donation page loads correctly
- [ ] Stripe publishable key is correct
- [ ] API URL points to backend
- [ ] Payment form works
- [ ] Test payment succeeds
- [ ] Success message displays

### Integration
- [ ] Payment intent → Stripe → Webhook → Database flow works
- [ ] Donations are recorded in database
- [ ] Receipt emails sent (if email provided)
- [ ] Error handling works correctly

### Production
- [ ] HTTPS enabled
- [ ] Webhook URL updated
- [ ] API URL updated
- [ ] Live payment tested
- [ ] Security verified

---

## 🚀 Quick Test Command

Run this to test the donation API quickly:

```bash
# Start backend
cd backend-api
npm start

# In another terminal, test API
curl -X POST http://localhost:3000/api/donations/create-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 5, "currency": "usd"}'
```

**Expected**: Returns `clientSecret` for payment

---

## 📞 Need Help?

If tests fail:
1. Check error messages in console
2. Verify all environment variables are set
3. Ensure Stripe keys are correct
4. Check database is running
5. Review `STRIPE-SETUP.md` for detailed setup

---

**Ready to test! Follow the steps above.** 🧪
