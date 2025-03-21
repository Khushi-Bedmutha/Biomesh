import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  creditWallet,
  debitWallet,
  getWalletBalance,
} from '../controllers/wallet.js';

const router = express.Router();

// Get current wallet balance
router.get('/', protect, getWalletBalance);

// Credit wallet (adds tokens + creates transaction)
router.post('/credit', protect, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').notEmpty(),
  body('source').isIn(['clinical_trial', 'data_contribution', 'deposit']),
  body('transactionHash').notEmpty()
], creditWallet);

// Debit wallet (subtracts tokens + creates transaction)
router.post('/debit', protect, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').notEmpty(),
  body('source').isIn(['withdrawal']),
  body('transactionHash').notEmpty()
], debitWallet);

export default router;
