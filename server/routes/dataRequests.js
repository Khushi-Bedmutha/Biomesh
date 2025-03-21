import express from 'express';
import { body } from 'express-validator';
import { 
  createDataRequest, 
  getDataRequests, 
  getDataRequestById, 
  updateDataRequestStatus, 
  addBlockchainVerification 
} from '../controllers/dataRequests.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create a new data request
router.post('/', protect, [
  body('providerId').isMongoId().withMessage('Valid provider institution ID is required'),
  body('requestType').isIn(['research', 'clinical_trial', 'analysis', 'other'])
    .withMessage('Valid request type is required'),
  body('dataTypes').isArray().withMessage('Data types must be an array'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('terms').notEmpty().withMessage('Terms are required')
], createDataRequest);

// Get all data requests
router.get('/', protect, getDataRequests);

// Get specific data request by ID
router.get('/:id', protect, getDataRequestById);

// Update data request status
router.patch('/status', protect, [
  body('requestId').isMongoId().withMessage('Valid request ID is required'),
  body('status').isIn(['pending', 'approved', 'rejected', 'revoked', 'expired'])
    .withMessage('Valid status is required')
], updateDataRequestStatus);

// Add blockchain verification to a data request
router.patch('/blockchain-verify', protect, [
  body('requestId').isMongoId().withMessage('Valid request ID is required'),
  body('transactionHash').notEmpty().withMessage('Transaction hash is required')
], addBlockchainVerification);

export default router;