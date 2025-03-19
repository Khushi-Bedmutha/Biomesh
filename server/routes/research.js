import express from 'express';
import { body } from 'express-validator';
import { createResearch, getResearchProjects, updateResearchFindings } from '../controllers/research.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('researcher'), [
  body('title').notEmpty(),
  body('institution').notEmpty(),
  body('description').notEmpty()
], createResearch);

router.get('/', protect, getResearchProjects);

router.patch('/findings', protect, authorize('researcher'), [
  body('researchId').isMongoId(),
  body('findings').isObject()
], updateResearchFindings);

export default router;