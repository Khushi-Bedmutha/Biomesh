import mongoose from 'mongoose';

const clinicalTrialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  funding: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'BMT'
    }
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  duration: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  eligibilityCriteria: [String],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  onChainVerification: Boolean
}, {
  timestamps: true
});

export default mongoose.model('ClinicalTrial', clinicalTrialSchema);