import mongoose from 'mongoose';

const researchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  researchers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  institution: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  funding: {
    amount: Number,
    currency: {
      type: String,
      default: 'BMT'
    },
    dataTypes: [String],
    minimumParticipants: Number,
    timeframe: {
      start: Date,
      end: Date
    }
  },
  fundingSource: String,
  status: {
    type: String,
    enum: ['proposed', 'active', 'completed', 'cancelled'],
    default: 'proposed'
  },
  findings: {
    summary: String,
    publications: [{
      title: String,
      url: String,
      date: Date
    }],
    aiInsights: [{
      type: String,
      description: String,
      confidence: Number,
      date: Date
    }]
  },
  participants: {
    verifiedOnChain: Boolean,
    blockchainId: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Research', researchSchema);