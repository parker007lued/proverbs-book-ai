const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function verifyStripeKey() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY in .env');
    process.exit(1);
  }

  try {
    const balance = await stripe.balance.retrieve();
    console.log('✓ Stripe key verified');
    console.log(`Available balance entries: ${balance.available.length}`);
  } catch (error) {
    console.error('Stripe verification failed:', error.message);
    process.exit(1);
  }
}

verifyStripeKey();
