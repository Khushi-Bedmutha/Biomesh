import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();  // This loads the .env file

// Helper function to log request details and errors
const logRequestDetails = (req, action) => {
  console.log(`[${new Date().toISOString()}] ${action} request received`);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
};

const logError = (error, action) => {
  console.error(`[${new Date().toISOString()}] Error during ${action}:`, error.message || error);
};

// Generate JWT token
const generateToken = (id) => {
  console.log(`JWT Token: ${process.env.JWT_SECRET}`);
  console.log(`[${new Date().toISOString()}] Generating JWT token for user ID: ${id}`);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};


// Register new user
export const register = async (req, res) => {
  logRequestDetails(req, 'POST /register');
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors during registration:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(`Checking if user with email ${email} already exists...`);

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`User with email ${email} already exists`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Set both publicKey and walletAddress to null initially
    // Set dummy values for publicKey and walletAddress
    const publicKey = "dummyPublicKey12345";  // Dummy public key
    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";  // Dummy wallet address


    console.log(`Creating new user with email ${email}`);
    const user = await User.create({
      email,
      password,
      publicKey,       // Set publicKey to null
      walletAddress    // Set walletAddress to null
    });

    const token = generateToken(user._id);

    console.log(`User created successfully, sending response with token for user ID: ${user._id}`);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        dataConsent: user.dataConsent,
        role: user.role
      }
    });
  } catch (error) {
    logError(error, 'register');
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  logRequestDetails(req, 'POST /login');
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors during login:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log(`Attempting to find user with email ${email}`);

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      console.log(`Invalid credentials for user with email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    console.log(`User logged in successfully, sending response with token for user ID: ${user._id}`);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        dataConsent: user.dataConsent,
        role: user.role
      }
    });
  } catch (error) {
    logError(error, 'login');
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user data
export const getMe = async (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /me request received`);
  
  try {
    const user = await User.findById(req.user._id).select('-password');
    console.log(`Found user with ID ${user._id}, sending user data response`);

    res.json({
      id: user._id,
      email: user.email,
      dataConsent: user.dataConsent,
      role: user.role,
      walletBalance: user.walletBalance
    });
  } catch (error) {
    logError(error, 'getMe');
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user consent data
export const updateConsent = async (req, res) => {
  logRequestDetails(req, 'PATCH /consent');
  
  try {
    const { dataConsent } = req.body;
    console.log(`Updating consent data for user with ID ${req.user._id}`);

    const user = await User.findById(req.user._id);
    user.dataConsent = {
      ...user.dataConsent,
      ...dataConsent
    };
    await user.save();

    console.log(`Consent data updated successfully for user ID ${req.user._id}`);
    res.json({
      dataConsent: user.dataConsent
    });
  } catch (error) {
    logError(error, 'updateConsent');
    res.status(500).json({ message: 'Server error' });
  }
};
