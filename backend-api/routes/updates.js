const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Get latest update for platform (for Electron auto-updater)
router.get('/check/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const currentVersion = req.query.currentVersion || '0.0.0';

    const result = await pool.query(
      `SELECT * FROM app_updates 
       WHERE platform = $1 AND is_active = TRUE 
       ORDER BY created_at DESC LIMIT 1`,
      [platform]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        updateAvailable: false,
        message: 'No updates available'
      });
    }

    const update = result.rows[0];
    const updateAvailable = compareVersions(update.version, currentVersion) > 0;

    res.json({
      success: true,
      updateAvailable,
      version: update.version,
      releaseNotes: update.release_notes,
      downloadUrl: update.download_url,
      fileSize: update.file_size,
      sha256: update.sha256_hash,
      isMandatory: update.is_mandatory,
      platform: update.platform
    });
  } catch (error) {
    console.error('Check update error:', error);
    res.status(500).json({ success: false, error: 'Failed to check updates' });
  }
});

// Admin: Create new update
router.post('/create', async (req, res) => {
  try {
    // In production, add admin authentication
    const { platform, version, releaseNotes, downloadUrl, fileSize, sha256Hash, isMandatory } = req.body;

    await pool.query(
      `INSERT INTO app_updates (platform, version, release_notes, download_url, file_size, sha256_hash, is_mandatory)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (platform, version) DO NOTHING`,
      [platform, version, releaseNotes, downloadUrl, fileSize, sha256Hash, isMandatory || false]
    );

    res.json({ success: true, message: 'Update created' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create update' });
  }
});

// Compare version numbers
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  return 0;
}

module.exports = router;
