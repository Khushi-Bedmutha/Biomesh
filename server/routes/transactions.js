import express from 'express';
import { body } from 'express-validator';
import { createTransaction, getUserTransactions, updateTransactionStatus } from '../controllers/transactions.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, [
  body('type').isIn(['credit', 'debit']),
  body('amount').isNumeric(),
  body('description').notEmpty(),
  body('source').isIn(['clinical_trial', 'data_contribution', 'withdrawal', 'deposit']),
  body('transactionHash').notEmpty()
], createTransaction);

router.get('/', protect, getUserTransactions);

router.patch('/status', protect, [
  body('transactionId').isMongoId(),
  body('status').isIn(['pending', 'completed', 'failed'])
], updateTransactionStatus);

export default router;