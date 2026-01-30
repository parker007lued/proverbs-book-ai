const { pool } = require('../config/database');

async function checkFeatureAccess(featureName) {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;

      // Get user's subscription
      const result = await pool.query(
        'SELECT plan_type, status, end_date FROM subscriptions WHERE user_id = $1',
        [userId]
      );

      const planType = result.rows[0]?.plan_type || 'free';
      const isActive = !result.rows[0] || (result.rows[0].status === 'active' && (!result.rows[0].end_date || new Date(result.rows[0].end_date) > new Date()));

      // Define feature access by plan
      const featurePlans = {
        'bible_summary': ['premium', 'pro'],
        'pdf_export': ['premium', 'pro'],
        'epub_export': ['premium', 'pro'],
        'ai_images': ['pro'],
        'unlimited_chapters': ['pro'],
        'basic_chapters': ['free', 'premium', 'pro'],
        'basic_export': ['free', 'premium', 'pro']
      };

      const allowedPlans = featurePlans[featureName] || [];
      const hasAccess = isActive && allowedPlans.includes(planType);

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: 'Feature requires premium subscription',
          requiredPlan: allowedPlans[0] || 'premium',
          currentPlan: planType
        });
      }

      req.subscription = { planType, isActive };
      next();
    } catch (error) {
      console.error('Feature check error:', error);
      res.status(500).json({ success: false, error: 'Failed to check feature access' });
    }
  };
}

module.exports = { checkFeatureAccess };
