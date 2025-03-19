import express from 'express';
import { body } from 'express-validator';
import { createClinicalTrial, getClinicalTrials, joinClinicalTrial, updateTrialStatus } from '../controllers/clinicalTrials.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('researcher'), [
  body('title').notEmpty(),
  body('institution').notEmpty(),
  body('description').notEmpty(),
  body('funding').isObject(),
  body('duration').isObject()
], createClinicalTrial);

router.get('/', protect, getClinicalTrials);

router.post('/join', protect, [
  body('trialId').isMongoId()
], joinClinicalTrial);

router.patch('/status', protect, authorize('researcher'), [
  body('trialId').isMongoId(),
  body('status').isIn(['draft', 'active', 'completed', 'cancelled'])
], updateTrialStatus);

export default router;