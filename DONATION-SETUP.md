# 💝 Donation Setup Guide

## Stripe Integration

This project uses **Stripe** for secure donation processing.

### Setup Steps

1. **Create Stripe Account**:
   - Go to https://stripe.com
   - Sign up for free account
   - Complete verification

2. **Get API Keys**:
   - Dashboard → Developers → API keys
   - Copy **Publishable key** (starts with `pk_`)
   - Copy **Secret key** (starts with `sk_`)

3. **Configure Backend**:
   
   Add to `backend-api/.env`:
   ```env
   STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```

4. **Set Up Webhook**:
   - Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-api-domain.com/api/donations/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret to `.env`

5. **Update Frontend**:
   
   Edit `website/donate.html`:
   ```javascript
   const STRIPE_PUBLIC_KEY = 'pk_live_YOUR_PUBLIC_KEY';
   const API_URL = 'https://your-api-domain.com/api';
   ```

6. **Test Mode**:
   - Use test keys (`pk_test_` and `sk_test_`) for development
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date, any CVC

### Donation Features

- ✅ One-time donations
- ✅ Custom amounts
- ✅ Optional name/email
- ✅ Optional message
- ✅ Secure Stripe processing
- ✅ Receipt emails (if email provided)
- ✅ Donation tracking in database

### Database

Donations are stored in `donations` table:
- Email (optional)
- Name (optional)
- Amount
- Status (pending/completed/failed)
- Stripe payment intent ID
- Message (optional)
- Timestamps

### Privacy

- All donations are optional
- Email is optional (for receipts only)
- Name can be "Anonymous"
- No personal data required
- Secure Stripe processing

---

**Remember**: This project is FREE. Donations are optional and appreciated, but never required!
