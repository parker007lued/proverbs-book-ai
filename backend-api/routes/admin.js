const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const { pool } = require('../config/database');

const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { search, planType, status } = req.query;
    
    let query = `
      SELECT u.id, u.email, u.display_name, u.created_at, u.last_login, u.is_active,
             s.plan_type, s.status as subscription_status, s.discount_percent, s.admin_notes
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (u.email ILIKE $${paramCount} OR u.display_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (planType) {
      query += ` AND s.plan_type = $${paramCount}`;
      params.push(planType);
      paramCount++;
    }

    if (status) {
      query += ` AND s.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ' ORDER BY u.created_at DESC LIMIT 100';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      users: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, error: 'Failed to get users' });
  }
});

// Get user by email (for granting access)
router.get('/user/:email', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { email } = req.params;

    const result = await pool.query(`
      SELECT u.id, u.email, u.display_name, u.created_at,
             s.plan_type, s.status, s.discount_percent, s.admin_notes
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id
      WHERE u.email = $1
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
});

// Grant free/premium access (e.g., for Sarah)
router.post('/grant-access', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId, email, planType = 'premium', endDate = null, discountPercent = 100, adminNotes } = req.body;
    const adminId = req.user.userId;

    let targetUserId = userId;

    // If email provided, find user
    if (email && !userId) {
      const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      targetUserId = userResult.rows[0].id;
    }

    await pool.query(
      `INSERT INTO subscriptions (user_id, plan_type, status, end_date, discount_percent, admin_notes, created_by_admin_id)
       VALUES ($1, $2, 'active', $3, $4, $5, $6)
       ON CONFLICT (user_id)
       DO UPDATE SET
         plan_type = $2,
         status = 'active',
         end_date = $3,
         discount_percent = $4,
         admin_notes = $5,
         updated_at = CURRENT_TIMESTAMP`,
      [targetUserId, planType, endDate, discountPercent, adminNotes || `Free access granted by admin ${adminId}`, adminId]
    );

    res.json({
      success: true,
      message: `Access granted: ${planType} plan${endDate ? ` until ${endDate}` : ' (permanent)'}`
    });
  } catch (error) {
    console.error('Grant access error:', error);
    res.status(500).json({ success: false, error: 'Failed to grant access' });
  }
});

// Update user subscription
router.put('/subscription/:userId', authenticateToken, isAdmin, async (req, res) => {
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
    res.status(500).json({ success: false, error: 'Failed to update subscription' });
  }
});

// Analytics dashboard
router.get('/analytics', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    const activeSubscriptions = await pool.query("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'");
    const planBreakdown = await pool.query('SELECT plan_type, COUNT(*) as count FROM subscriptions GROUP BY plan_type');
    const recentUsers = await pool.query('SELECT COUNT(*) as count FROM users WHERE created_at > NOW() - INTERVAL \'30 days\'');

    res.json({
      success: true,
      analytics: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        activeSubscriptions: parseInt(activeSubscriptions.rows[0].count),
        planBreakdown: planBreakdown.rows,
        recentUsers: parseInt(recentUsers.rows[0].count)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get analytics' });
  }
});

module.exports = router;
