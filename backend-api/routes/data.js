const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Sync data (chapters, progress, etc.)
router.post('/sync', authenticateToken, [
  body('data').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: 'Validation failed' });
    }

    const userId = req.user.userId;
    const { data } = req.body;

    // Sync chapters
    if (data.chapters && Array.isArray(data.chapters)) {
      for (const chapter of data.chapters) {
        await pool.query(
          `INSERT INTO user_chapters (user_id, chapter_number, content_type, content)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id, chapter_number, content_type)
           DO UPDATE SET content = $4, updated_at = CURRENT_TIMESTAMP`,
          [userId, chapter.number, chapter.contentType, chapter.content]
        );
      }
    }

    // Sync progress
    if (data.progress) {
      await pool.query(
        `INSERT INTO user_progress (user_id, progress_data)
         VALUES ($1, $2)
         ON CONFLICT (user_id)
         DO UPDATE SET progress_data = $2, last_synced = CURRENT_TIMESTAMP`,
        [userId, JSON.stringify(data.progress)]
      );
    }

    // Sync settings
    if (data.settings) {
      await pool.query(
        `INSERT INTO user_settings (user_id, settings)
         VALUES ($1, $2)
         ON CONFLICT (user_id)
         DO UPDATE SET settings = $2, updated_at = CURRENT_TIMESTAMP`,
        [userId, JSON.stringify(data.settings)]
      );
    }

    res.json({
      success: true,
      synced: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ success: false, error: 'Sync failed' });
  }
});

// Get synced data
router.get('/get', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get chapters
    const chaptersResult = await pool.query(
      'SELECT chapter_number, content_type, content, created_at, updated_at FROM user_chapters WHERE user_id = $1 ORDER BY chapter_number',
      [userId]
    );

    // Get progress
    const progressResult = await pool.query(
      'SELECT progress_data FROM user_progress WHERE user_id = $1',
      [userId]
    );

    // Get settings
    const settingsResult = await pool.query(
      'SELECT settings FROM user_settings WHERE user_id = $1',
      [userId]
    );

    const chapters = chaptersResult.rows.map(row => ({
      number: row.chapter_number,
      contentType: row.content_type,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

    res.json({
      success: true,
      data: {
        chapters,
        progress: progressResult.rows[0]?.progress_data || {},
        settings: settingsResult.rows[0]?.settings || {}
      }
    });
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve data' });
  }
});

// Delete chapter
router.delete('/chapter/:chapterNumber', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const chapterNumber = parseInt(req.params.chapterNumber);

    await pool.query(
      'DELETE FROM user_chapters WHERE user_id = $1 AND chapter_number = $2',
      [userId, chapterNumber]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Delete chapter error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete chapter' });
  }
});

module.exports = router;
