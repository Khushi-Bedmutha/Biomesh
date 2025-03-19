import express from 'express';
import { body } from 'express-validator';
import { uploadHealthData, getUserHealthData, updateHealthDataPermissions } from '../controllers/healthData.js';
import { protect } from '../middleware/auth.js';

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
  body('hash').notEmpty()
], (req, res, next) => {
  // Log the request body for debugging
  console.log('Received request body:', req.body);

  // // Log validation errors, if any
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   console.error('Validation errors:', errors.array());
  //   return res.status(400).json({ errors: errors.array() });
  // }

  // Log details of the incoming request
  logRequest(req, 'POST /healthdata');
  
  try {
    // Log the data being processed for debugging purposes
    console.log('Data to upload:', {
      dataType: req.body.dataType,
      source: req.body.source,
      data: req.body.data,
      hash: req.body.hash
    });

    // Proceed with the upload function
    uploadHealthData(req, res, next);
  } catch (err) {
    // Log the error if the upload fails
    console.error('Error during health data upload:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET / - Get user health data
router.get('/', protect, (req, res, next) => {
  logRequest(req, 'GET /healthdata');
  getUserHealthData(req, res, next);
});

// PATCH /permissions - Update health data permissions
router.patch('/permissions', protect, [
  body('dataId').isMongoId(),
  body('permissions').isArray()
], (req, res, next) => {
  logRequest(req, 'PATCH /healthdata/permissions');
  updateHealthDataPermissions(req, res, next);
});

export default router;
