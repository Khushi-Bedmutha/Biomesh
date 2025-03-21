import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, getMe } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper function for detailed logging
const logRequestDetails = (req, route) => {
  console.log(`[${new Date().toISOString()}] ${route} request received`);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
};

router.post('/register', [
  body('institutionName').notEmpty().withMessage('Institution name is required'),
  body('institutionType').isIn(['hospital', 'clinic', 'research_center', 'university', 'pharma_company', 'other']),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('registrationNumber').notEmpty().withMessage('Registration number is required'),
  body('contacts').isArray().withMessage('Contacts should be an array')
], register);

router.post('/login', [
  // Validation checks for login
  body('email').isEmail().normalizeEmail(),
  body('password').exists()

], async (req, res, next) => {
  logRequestDetails(req, 'POST /login');

  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await login(req, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/me', protect, async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] GET /me request received`);
  console.log('Request headers:', req.headers);
  try {
    await getMe(req, res);
  } catch (err) {
    console.error('Error getting user data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// router.patch('/consent', protect, [
//   // Validation check for consent update
//   body('dataConsent').isObject()
// ], async (req, res, next) => {
//   logRequestDetails(req, 'PATCH /consent');

//   // Check validation errors
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.error('Validation errors:', errors.array());
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     await updateConsent(req, res);
//   } catch (err) {
//     console.error('Consent update error:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

export default router;
