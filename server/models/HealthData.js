import mongoose from 'mongoose';

const healthDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dataType: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  diseaseType:{
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  encryption: {
    method: String,
    publicKey: String
  },
  hash: {
    type: String,
    required: true
  },
  smartContractId: String
}, {
  timestamps: true
});

export default mongoose.model('HealthData', healthDataSchema);