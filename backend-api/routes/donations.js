const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Donations table will be created in database.js
// This route handles Stripe payment intents

// Create donation payment intent
router.post('/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', email, name, message } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        project: 'proverbs-book-ai',
        email: email || 'anonymous',
        name: name || 'Anonymous',
        message: message || ''
      },
      description: `Donation to Proverbs Book AI - ${name || 'Anonymous'}`,
      receipt_email: email || undefined
    });

    // Store donation record (pending)
    if (email) {
      await pool.query(
        `INSERT INTO donations (email, name, amount, currency, status, stripe_payment_intent_id, message)
         VALUES ($1, $2, $3, $4, 'pending', $5, $6)`,
        [email, name || 'Anonymous', amount, currency, paymentIntent.id, message || '']
      );
    }

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create donation intent error:', error);
    res.status(500).json({ success: false, error: 'Failed to create donation' });
  }
});

// Webhook handler for Stripe (verify payment completion)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Update donation status
      await pool.query(
        `UPDATE donations 
         SET status = 'completed', completed_at = CURRENT_TIMESTAMP
         WHERE stripe_payment_intent_id = $1`,
        [paymentIntent.id]
      );
      
      console.log('Donation completed:', paymentIntent.id);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      
      await pool.query(
        `UPDATE donations 
         SET status = 'failed'
         WHERE stripe_payment_intent_id = $1`,
        [failedPayment.id]
      );
      
      console.log('Donation failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Get donation stats (public, aggregated)
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_donations,
        SUM(amount) as total_amount,
        AVG(amount) as average_amount,
        MAX(amount) as largest_donation
      FROM donations
      WHERE status = 'completed'
    `);

    res.json({
      success: true,
      stats: {
        totalDonations: parseInt(result.rows[0].total_donations) || 0,
        totalAmount: parseFloat(result.rows[0].total_amount) || 0,
        averageAmount: parseFloat(result.rows[0].average_amount) || 0,
        largestDonation: parseFloat(result.rows[0].largest_donation) || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
});

// Get user's donations (authenticated)
router.get('/my-donations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user email
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const userEmail = userResult.rows[0].email;

    const donations = await pool.query(
      `SELECT amount, currency, status, created_at, message
       FROM donations
       WHERE email = $1
       ORDER BY created_at DESC`,
      [userEmail]
    );

    res.json({
      success: true,
      donations: donations.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get donations' });
  }
});

module.exports = router;
