const path = require('path');
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4242;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Stripe webhook endpoint (raw body required)
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(400).send('Missing STRIPE_WEBHOOK_SECRET');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Checkout completed:', event.data.object.id);
      break;
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object.id);
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
    case 'customer.subscription.created':
      console.log('Subscription created:', event.data.object.id);
      break;
    case 'customer.subscription.updated':
      console.log('Subscription updated:', event.data.object.id);
      break;
    case 'invoice.payment_succeeded':
      console.log('Invoice payment succeeded:', event.data.object.id);
      break;
    case 'invoice.payment_failed':
      console.log('Invoice payment failed:', event.data.object.id);
      break;
    case 'charge.refunded':
      console.log('Charge refunded:', event.data.object.id);
      break;
    default:
      break;
  }

  res.json({ received: true });
});

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/checkout', async (req, res) => {
  try {
    const items = req.body.items || [];
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const mode = req.body.mode || items[0].billing || 'payment';
    const isSubscription = mode === 'subscription';
    const hasMixed = items.some((i) => (i.billing || 'payment') !== mode);
    if (hasMixed) {
      return res.status(400).json({ error: 'Mixed billing types not allowed in one checkout' });
    }

    const lineItems = items.map((item) => {
      const price = Math.round(Number(item.price || 0) * 100);
      if (!price || price < 50) {
        throw new Error('Invalid price');
      }
      const priceData = {
        currency: item.currency || 'usd',
        product_data: {
          name: item.title || item.name || 'Product',
          description: item.description || ''
        },
        unit_amount: price
      };

      if (isSubscription) {
        priceData.recurring = { interval: item.interval || 'month' };
      }

      return {
        price_data: priceData,
        quantity: item.quantity || 1
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: lineItems,
      success_url: `${BASE_URL}/?success=1`,
      cancel_url: `${BASE_URL}/?cancel=1`
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Stripe processor running on ${BASE_URL}`);
});
