const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const { pool } = require('../config/database');

const router = express.Router();

// Get user's subscription status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      // Default to free plan
      return res.json({
        success: true,
        subscription: {
          planType: 'free',
          status: 'active',
          features: getPlanFeatures('free')
        }
      });
    }

    const sub = result.rows[0];
    const isActive = sub.status === 'active' && (!sub.end_date || new Date(sub.end_date) > new Date());

    res.json({
      success: true,
      subscription: {
        planType: sub.plan_type,
        status: isActive ? 'active' : 'expired',
        startDate: sub.start_date,
        endDate: sub.end_date,
        discountPercent: sub.discount_percent,
        features: getPlanFeatures(sub.plan_type)
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ success: false, error: 'Failed to get subscription' });
  }
});

// Check feature access
router.post('/check-feature', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { feature } = req.body;

    const result = await pool.query(
      'SELECT plan_type, status, end_date FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    const planType = result.rows[0]?.plan_type || 'free';
    const isActive = !result.rows[0] || (result.rows[0].status === 'active' && (!result.rows[0].end_date || new Date(result.rows[0].end_date) > new Date()));

    const features = getPlanFeatures(planType);
    const hasAccess = isActive && features.includes(feature);

    res.json({
      success: true,
      hasAccess,
      planType,
      message: hasAccess ? 'Access granted' : `Feature requires ${getRequiredPlan(feature)} plan`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to check feature' });
  }
});

// Admin: Get all subscriptions
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, u.email, u.display_name
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `);

    res.json({
      success: true,
      subscriptions: result.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get subscriptions' });
  }
});

// Admin: Update user subscription
router.put('/admin/:userId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { planType, status, endDate, discountPercent, discountCode, adminNotes } = req.body;
    const adminId = req.user.userId;

    await pool.query(
      `INSERT INTO subscriptions (user_id, plan_type, status, end_date, discount_percent, discount_code, admin_notes, created_by_admin_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id)
       DO UPDATE SET
         plan_type = $2,
         status = $3,
         end_date = $4,
         discount_percent = $5,
         discount_code = $6,
         admin_notes = $7,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, planType, status, endDate, discountPercent, discountCode, adminNotes, adminId]
    );

    res.json({ success: true, message: 'Subscription updated' });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ success: false, error: 'Failed to update subscription' });
  }
});

// Admin: Grant free access
router.post('/admin/grant-free', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId, planType = 'premium', endDate = null, adminNotes } = req.body;
    const adminId = req.user.userId;

    await pool.query(
      `INSERT INTO subscriptions (user_id, plan_type, status, end_date, discount_percent, admin_notes, created_by_admin_id)
       VALUES ($1, $2, 'active', $3, 100, $4, $5)
       ON CONFLICT (user_id)
       DO UPDATE SET
         plan_type = $2,
         status = 'active',
         end_date = $3,
         discount_percent = 100,
         admin_notes = $4,
         updated_at = CURRENT_TIMESTAMP`,
      [userId, planType, endDate, adminNotes || 'Free access granted by admin', adminId]
    );

    res.json({ success: true, message: 'Free access granted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to grant free access' });
  }
});

function getPlanFeatures(planType) {
  const plans = {
    free: ['basic_chapters', 'basic_export'],
    premium: ['basic_chapters', 'basic_export', 'advanced_chapters', 'pdf_export', 'epub_export', 'bible_summary', 'priority_support'],
    pro: ['basic_chapters', 'basic_export', 'advanced_chapters', 'pdf_export', 'epub_export', 'bible_summary', 'priority_support', 'unlimited_chapters', 'ai_images', 'custom_templates']
  };
  return plans[planType] || plans.free;
}

function getRequiredPlan(feature) {
  const featurePlans = {
    'bible_summary': 'premium',
    'pdf_export': 'premium',
    'epub_export': 'premium',
    'ai_images': 'pro',
    'unlimited_chapters': 'pro'
  };
  return featurePlans[feature] || 'premium';
}

module.exports = router;
