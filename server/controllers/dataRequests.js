import { validationResult } from 'express-validator';
import DataRequest from '../models/DataRequest.js';
import User from '../models/User.js';

// Helper functions
const logRequestDetails = (req, action) => {
  console.log(`[${new Date().toISOString()}] ${action} request received`);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
};

const logError = (error, action) => {
  console.error(`[${new Date().toISOString()}] Error during ${action}:`, error.message || error);
};

// Create a new data request
export const createDataRequest = async (req, res) => {
  logRequestDetails(req, 'POST /data-requests');
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      providerId, 
      requestType, 
      dataTypes, 
      purpose, 
      startDate, 
      endDate, 
      compensation,
      terms,
      complianceVerification
    } = req.body;
    
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider institution not found' });
    }
    
    const dataRequest = await DataRequest.create({
      requester: req.user._id,
      provider: providerId,
      requestType,
      dataTypes,
      purpose,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      compensation,
      terms,
      complianceVerification
    });

    await dataRequest.populate([
      { path: 'requester', select: 'institutionName institutionType email' },
      { path: 'provider', select: 'institutionName institutionType email' }
    ]);
    
    res.status(201).json(dataRequest);
  } catch (error) {
    logError(error, 'createDataRequest');
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all data requests for the current institution (either as requester or provider)
export const getDataRequests = async (req, res) => {
  try {
    const { role, status } = req.query;
    let query = {};
    
    // Filter by role (requester or provider)
    if (role === 'requester') {
      query.requester = req.user._id;
    } else if (role === 'provider') {
      query.provider = req.user._id;
    } else {
      // If no role specified, get all requests where the institution is either requester or provider
      query = {
        $or: [
          { requester: req.user._id },
          { provider: req.user._id }
        ]
      };
    }
    
    // Filter by status if provided
    if (status && ['pending', 'approved', 'rejected', 'revoked', 'expired'].includes(status)) {
      query.status = status;
    }
    
    const dataRequests = await DataRequest.find(query)
      .populate('requester', 'institutionName institutionType email')
      .populate('provider', 'institutionName institutionType email')
      .sort({ createdAt: -1 });
    
    res.json(dataRequests);
  } catch (error) {
    logError(error, 'getDataRequests');
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific data request by ID
export const getDataRequestById = async (req, res) => {
  try {
    const dataRequest = await DataRequest.findById(req.params.id)
      .populate('requester', 'institutionName institutionType email')
      .populate('provider', 'institutionName institutionType email');
    
    if (!dataRequest) {
      return res.status(404).json({ message: 'Data request not found' });
    }
    
    // Ensure the user is either the requester or provider
    if (!dataRequest.requester._id.equals(req.user._id) && !dataRequest.provider._id.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to access this data request' });
    }
    
    res.json(dataRequest);
  } catch (error) {
    logError(error, 'getDataRequestById');
    res.status(500).json({ message: 'Server error' });
  }
};

// Update data request status (approve/reject/revoke)
export const updateDataRequestStatus = async (req, res) => {
  logRequestDetails(req, 'PATCH /data-requests/status');
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { requestId, status, rejectionReason, approvedDataFields, blockchainVerification } = req.body;
    
    const dataRequest = await DataRequest.findById(requestId);
    if (!dataRequest) {
      return res.status(404).json({ message: 'Data request not found' });
    }
    
    // Ensure the user is the provider for approval/rejection actions
    if (status === 'approved' || status === 'rejected') {
      if (!dataRequest.provider.equals(req.user._id)) {
        return res.status(403).json({ message: 'Only the provider can approve or reject data requests' });
      }
    }
    
    // Ensure the user is the requester for revocation
    if (status === 'revoked' && !dataRequest.requester.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the requester can revoke data requests' });
    }
    
    // Update the data request
    dataRequest.status = status;
    
    if (rejectionReason) {
      dataRequest.rejectionReason = rejectionReason;
    }
    
    if (approvedDataFields) {
      dataRequest.approvedDataFields = approvedDataFields;
    }
    
    if (blockchainVerification) {
      dataRequest.blockchainVerification = {
        ...dataRequest.blockchainVerification,
        ...blockchainVerification,
        timestamp: new Date()
      };
    }
    
    await dataRequest.save();
    
    await dataRequest.populate([
      { path: 'requester', select: 'institutionName institutionType email' },
      { path: 'provider', select: 'institutionName institutionType email' }
    ]);
    
    res.json(dataRequest);
  } catch (error) {
    logError(error, 'updateDataRequestStatus');
    res.status(500).json({ message: 'Server error' });
  }
};

// Add blockchain verification to a data request
export const addBlockchainVerification = async (req, res) => {
  logRequestDetails(req, 'PATCH /data-requests/blockchain-verify');
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { requestId, transactionHash, smartContractId } = req.body;
    
    const dataRequest = await DataRequest.findById(requestId);
    if (!dataRequest) {
      return res.status(404).json({ message: 'Data request not found' });
    }
    
    // Ensure the user is either the requester or provider
    if (!dataRequest.requester.equals(req.user._id) && !dataRequest.provider.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this data request' });
    }
    
    // Update blockchain verification
    dataRequest.blockchainVerification = {
      verified: true,
      transactionHash,
      timestamp: new Date()
    };
    
    if (smartContractId) {
      dataRequest.smartContractId = smartContractId;
    }
    
    await dataRequest.save();
    
    await dataRequest.populate([
      { path: 'requester', select: 'institutionName institutionType email' },
      { path: 'provider', select: 'institutionName institutionType email' }
    ]);
    
    res.json(dataRequest);
  } catch (error) {
    logError(error, 'addBlockchainVerification');
    res.status(500).json({ message: 'Server error' });
  }
};