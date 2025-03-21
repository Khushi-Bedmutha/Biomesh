import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// Helper functions remain the same
const logRequestDetails = (req, action) => {
  console.log(`[${new Date().toISOString()}] ${action} request received`);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
};

const logError = (error, action) => {
  console.error(`[${new Date().toISOString()}] Error during ${action}:`, error.message || error);
};

// Generate JWT token remains the same
const generateToken = (id) => {
  console.log(`[${new Date().toISOString()}] Generating JWT token for institution ID: ${id}`);
  return jwt.sign({ id }, 'd13b35e499e999291e295b66c36b947ba76843059ab4f92b993029283e9a05f6e5cf7a39e66726dabfba866fed5e15411c78b89a0777a7cc077deea468d609d8', {
    expiresIn: '30d'
  });
};

// Institution registration (replacing user registration)
export const register = async (req, res) => {
  logRequestDetails(req, 'POST /register');
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors during registration:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      institutionName, 
      institutionType, 
      email, 
      password, 
      registrationNumber,
      contacts,
      address 
    } = req.body;
    
    console.log(`Checking if institution with email ${email} already exists...`);

    const institutionExists = await User.findOne({ email });
    if (institutionExists) {
      console.log(`Institution with email ${email} already exists`);
      return res.status(400).json({ message: 'Institution already exists' });
    }

    // Set dummy values for blockchain integration initially
    const publicKey = "dummyPublicKey12345";
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    console.log(`Creating new institution with name ${institutionName}`);
    const institution = await User.create({
      institutionName,
      institutionType,
      email,
      password,
      registrationNumber,
      contacts,
      address,
      publicKey,
      walletAddress,
      verificationStatus: 'verified'
    });

    const token = generateToken(institution._id);

    console.log(`Institution created successfully, sending response with token for institution ID: ${institution._id}`);
    res.status(201).json({
      token,
      institution: {
        id: institution._id,
        institutionName: institution.institutionName,
        institutionType: institution.institutionType,
        email: institution.email,
        verificationStatus: institution.verificationStatus,
        role: institution.role
      }
    });
  } catch (error) {
    logError(error, 'registerInstitution');
    res.status(500).json({ message: 'Server error' });
  }
};

// Institution login
export const login = async (req, res) => {
  logRequestDetails(req, 'POST /login');
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors during login:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(`Attempting to find institution with email ${email}`);

    const institution = await User.findOne({ email });
    if (!institution || !(await institution.comparePassword(password))) {
      console.log(`Invalid credentials for institution with email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if institution is verified
    if (institution.verificationStatus !== 'verified') {
      return res.status(403).json({ 
        message: 'Institution account is pending verification or has been rejected',
        status: institution.verificationStatus 
      });
    }

    const token = generateToken(institution._id);

    console.log(`Institution logged in successfully, sending response with token for institution ID: ${institution._id}`);
    res.json({
      token,
      institution: {
        id: institution._id,
        institutionName: institution.institutionName,
        institutionType: institution.institutionType,
        email: institution.email,
        verificationStatus: institution.verificationStatus,
        role: institution.role
      }
    });
  } catch (error) {
    logError(error, 'loginInstitution');
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current institution data
export const getInstitutionData = async (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /institution request received`);
  
  try {
    const institution = await User.findById(req.user._id).select('-password');
    console.log(`Found institution with ID ${institution._id}, sending institution data response`);

    res.json({
      id: institution._id,
      institutionName: institution.institutionName,
      institutionType: institution.institutionType,
      email: institution.email,
      verificationStatus: institution.verificationStatus,
      role: institution.role,
      contacts: institution.contacts,
      address: institution.address,
      compliance: institution.compliance
    });
  } catch (error) {
    logError(error, 'getInstitutionData');
    res.status(500).json({ message: 'Server error' });
  }
};

// Create data sharing agreement between institutions
// export const createDataSharingAgreement = async (req, res) => {
//   logRequestDetails(req, 'POST /agreement');
  
//   try {
//     const { targetInstitutionId, agreementType, agreementDetails, startDate, endDate } = req.body;
    
//     // Find target institution
//     const targetInstitution = await User.findById(targetInstitutionId);
//     if (!targetInstitution) {
//       return res.status(404).json({ message: 'Target institution not found' });
//     }
    
//     // Create agreement for requesting institution
//     const requestingInstitution = await User.findById(req.user._id);
//     requestingInstitution.dataAgreements.push({
//       partnerId: targetInstitutionId,
//       agreementType,
//       agreementDetails,
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       status: 'active'
//     });
    
//     await requestingInstitution.save();
    
//     // Create mirror agreement for target institution
//     targetInstitution.dataAgreements.push({
//       partnerId: req.user._id,
//       agreementType,
//       agreementDetails,
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       status: 'active'
//     });
    
//     await targetInstitution.save();
    
//     res.status(201).json({ 
//       message: 'Data sharing agreement created successfully',
//       agreementDetails: {
//         partnerId: targetInstitutionId,
//         agreementType,
//         startDate,
//         endDate,
//         status: 'active'
//       }
//     });
//   } catch (error) {
//     logError(error, 'createDataSharingAgreement');
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// Admin route to verify institutions

export const getMe = async (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /getme request received`);
  
  try {
    const institution = await User.findById(req.user._id).select('-password');
    
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }

    console.log(`Found institution with ID ${institution._id}, sending institution data response`);
    
    res.json({
      id: institution._id,
      institutionName: institution.institutionName,
      institutionType: institution.institutionType,
      email: institution.email,
      verificationStatus: institution.verificationStatus,
      role: institution.role,
      contacts: institution.contacts,
      address: institution.address,
      compliance: institution.compliance
    });
  } catch (error) {
    logError(error, 'getMe');
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyInstitution = async (req, res) => {
  logRequestDetails(req, 'PATCH /verify-institution');
  
  try {
    // Check if requesting user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to perform this action' });
    }
    
    const { institutionId, verificationStatus, verificationNotes } = req.body;
    
    const institution = await User.findById(institutionId);
    if (!institution) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    
    institution.verificationStatus = verificationStatus;
    if (verificationNotes) {
      institution.verificationNotes = verificationNotes;
    }
    
    await institution.save();
    
    res.json({
      message: `Institution verification status updated to ${verificationStatus}`,
      institution: {
        id: institution._id,
        institutionName: institution.institutionName,
        verificationStatus: institution.verificationStatus
      }
    });
  } catch (error) {
    logError(error, 'verifyInstitution');
    res.status(500).json({ message: 'Server error' });
  }
};