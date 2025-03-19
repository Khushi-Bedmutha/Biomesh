import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['clinical_trial', 'data_contribution', 'withdrawal', 'deposit'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: mongoose.Schema.Types.Mixed,
  transactionHash: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Transaction', transactionSchema);