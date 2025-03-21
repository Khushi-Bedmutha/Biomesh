import mongoose from 'mongoose';

const dataRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the institution making the request
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the institution receiving the request
    required: true
  },
  requestType: {
    type: String,
    enum: ['research', 'clinical_trial', 'analysis', 'other'],
    required: true
  },
  dataTypes: [{
    type: String,
    required: true
  }],
  purpose: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'revoked', 'expired'],
    default: 'pending'
  },
  amount: {
    type: Number,
    default: 0
  },
  terms: {
    type: String,
    required: true
  },
  smartContractId: String,
  blockchainVerification: {
    verified: {
      type: Boolean,
      default: false
    },
    transactionHash: String,
    timestamp: Date
  },
  rejectionReason: String,
  approvedDataFields: [String], 
  complianceVerification: {
    hipaa: Boolean,
    gdpr: Boolean,
    dpdpact: Boolean
  }
}, {
  timestamps: true
});

export default mongoose.model('DataRequest', dataRequestSchema);
