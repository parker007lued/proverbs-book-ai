# 🔐 Stripe Configuration Complete

## ✅ Keys Configured

### Publishable Key (Frontend)
- **Location**: `website/donate.html`
- **Key**: `pk_live_51QvQX2C18TJUjM0RW8mIoZ1QooTLwQ19dQj7k6039uhJCifdtbH9ZFmGzdKeLx2ZE6hFocxb3XeolH29TitHFnMj00XO8kXEAf`
- ✅ **Added and ready**

### Secret Key (Backend)
- **Location**: `backend-api/.env` (create this file)
- **Key**: `sk_live_...` (or `sk_test_...` for testing)
- ⚠️ **Note**: Never commit secret keys to GitHub

## 📝 Setup Steps

### 1. Create `.env` File

Copy the template:
```bash
cd backend-api
cp env.template .env
```

Or create `backend-api/.env` manually with:
```env
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
```

### 2. Set Up Webhook

1. Go to Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Enter endpoint URL:
   ```
   https://your-api-domain.com/api/donations/webhook
   ```
   (Replace `your-api-domain.com` with your actual domain)
4. Select events:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **"Signing secret"** (starts with `whsec_`)
7. Add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
   ```

### 3. Update API URL

Edit `website/donate.html`:
```javascript
const API_URL = 'https://your-api-domain.com/api';
```
(Replace with your actual backend URL)

### 4. Test

For testing, use Stripe test mode:
- Test publishable key: `pk_test_...`
- Test secret key: `sk_test_...`
- Test card: `4242 4242 4242 4242`

### 5. Verify Keys Programmatically

Run the Stripe verification script (requires `STRIPE_SECRET_KEY` in `.env`):
```bash
cd backend-api
npm run verify-stripe
```

## ⚠️ Important Notes

1. **Secret Key Format**: Your secret key starts with `mk_` which is unusual. Standard Stripe secret keys start with:
   - `sk_live_` (live mode)
   - `sk_test_` (test mode)
   
   Please verify this is the correct key from your Stripe Dashboard.

2. **Never Commit `.env`**: The `.env` file is gitignored - never commit it to GitHub!

3. **Webhook Secret**: You still need to set up the webhook and add the webhook secret.

4. **HTTPS Required**: Webhooks require HTTPS in production.

## ✅ Checklist

- [x] Publishable key added to donation page
- [ ] Secret key added to `.env` file
- [ ] Webhook endpoint created in Stripe
- [ ] Webhook secret added to `.env`
- [ ] API URL updated in donation page
- [ ] Test donation completed successfully

---

**Ready to accept donations!** 💝
