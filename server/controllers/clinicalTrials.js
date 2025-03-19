import { validationResult } from 'express-validator';
import ClinicalTrial from '../models/ClinicalTrial.js';

export const createClinicalTrial = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user.role.includes('researcher')) {
      return res.status(403).json({ message: 'Only researchers can create clinical trials' });
    }

    const clinicalTrial = await ClinicalTrial.create(req.body);
    res.status(201).json(clinicalTrial);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getClinicalTrials = async (req, res) => {
  try {
    const trials = await ClinicalTrial.find()
      .populate('participants', 'email')
      .sort({ createdAt: -1 });
    res.json(trials);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const joinClinicalTrial = async (req, res) => {
  try {
    const { trialId } = req.body;
    
    const trial = await ClinicalTrial.findById(trialId);
    if (!trial) {
      return res.status(404).json({ message: 'Clinical trial not found' });
    }

    if (trial.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already participating in this trial' });
    }

    trial.participants.push(req.user._id);
    await trial.save();

    res.json(trial);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTrialStatus = async (req, res) => {
  try {
    const { trialId, status } = req.body;
    
    const trial = await ClinicalTrial.findOneAndUpdate(
      { _id: trialId },
      { status },
      { new: true }
    );

    if (!trial) {
      return res.status(404).json({ message: 'Clinical trial not found' });
    }

    res.json(trial);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};