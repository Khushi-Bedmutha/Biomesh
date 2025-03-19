import { validationResult } from 'express-validator';
import Research from '../models/Research.js';

export const createResearch = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user.role.includes('researcher')) {
      return res.status(403).json({ message: 'Only researchers can create research projects' });
    }

    const research = await Research.create({
      ...req.body,
      researchers: [req.user._id]
    });

    res.status(201).json(research);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getResearchProjects = async (req, res) => {
  try {
    const research = await Research.find()
      .populate('researchers', 'email')
      .sort({ createdAt: -1 });
    res.json(research);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateResearchFindings = async (req, res) => {
  try {
    const { researchId, findings } = req.body;
    
    const research = await Research.findOneAndUpdate(
      { 
        _id: researchId,
        researchers: req.user._id
      },
      { findings },
      { new: true }
    );

    if (!research) {
      return res.status(404).json({ message: 'Research not found' });
    }

    res.json(research);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};