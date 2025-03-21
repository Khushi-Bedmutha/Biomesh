import { validationResult } from 'express-validator';
import HealthData from '../models/HealthData.js';

export const uploadHealthData = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { dataType, source, data, diseaseType,description, encryption, hash, smartContractId } = req.body;

    const healthData = await HealthData.create({
      user: req.user._id,
      dataType,
      source,
      data,
      diseaseType,
      description,
      encryption,
      hash,
      smartContractId
    });

    res.status(201).json(healthData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserHealthData = async (req, res) => {
  try {
    const healthData = await HealthData.find({ user: req.user._id });
    res.json(healthData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateHealthDataPermissions = async (req, res) => {
  try {
    const { dataId, permissions } = req.body;
    
    const healthData = await HealthData.findOne({ 
      _id: dataId,
      user: req.user._id
    });

    if (!healthData) {
      return res.status(404).json({ message: 'Health data not found' });
    }

    healthData.permissions = permissions;
    await healthData.save();

    res.json(healthData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};