import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, getMe, updateConsent } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper function for detailed logging
const logRequestDetails = (req, route) => {
  console.log(`[${new Date().toISOString()}] ${route} request received`);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
};

router.post('/register', [
  // Validation checks for registration
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .withMessage('Password must be at least 8 characters long and contain at least one letter and one number')
], async (req, res, next) => {
  logRequestDetails(req, 'POST /register');

  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await register(req, res);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

router.patch('/consent', protect, [
  // Validation check for consent update
  body('dataConsent').isObject()
], async (req, res, next) => {
  logRequestDetails(req, 'PATCH /consent');

  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await updateConsent(req, res);
  } catch (err) {
    console.error('Consent update error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
