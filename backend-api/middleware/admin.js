const { pool } = require('../config/database');

async function isAdmin(req, res, next) {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT * FROM admin_users WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    req.admin = result.rows[0];
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify admin access' });
  }
}

module.exports = { isAdmin };
