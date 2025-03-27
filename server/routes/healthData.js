import express from 'express';
import { body } from 'express-validator';
import { uploadHealthData, getUserHealthData, updateHealthDataPermissions } from '../controllers/healthData.js';
import { protect } from '../middleware/auth.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware for logging request details
const logRequest = (req, action) => {
  console.log(`[${new Date().toISOString()}] ${action} request received`);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
};

// POST / - Upload health data
router.post('/', protect, [
  body('dataType').notEmpty(),
  body('source').notEmpty(),
  body('data').notEmpty(),
  body('diseaseType').notEmpty(),
  body('description').notEmpty(),
  body('hash').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Received request body:', req.body);

    // send success response
    return res.status(200).json({
      message: 'File uploaded successfully',
      publicUrl: req.body.data
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', protect, (req, res, next) => {
  logRequest(req, 'GET /healthdata');
  getUserHealthData(req, res, next);
});

router.patch('/permissions', protect, [
  body('dataId').isMongoId(),
  body('permissions').isArray()
], (req, res, next) => {
  logRequest(req, 'PATCH /healthdata/permissions');
  updateHealthDataPermissions(req, res, next);
});

export default router;
