import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Institution information instead of individual user
  institutionName: {
    type: String,
    required: true,
    trim: true
  },
  institutionType: {
    type: String,
    enum: ['hospital', 'clinic', 'research_center', 'university', 'pharma_company', 'other'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  // Verification status for institution
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'verified'
  },
  // Institution details
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  registrationNumber: {
    type: String,
    unique: true
  },
  // Contact people at the institution
  contacts: [{
    name: String,
    position: String,
    email: String,
    phone: String
  }],
  // Blockchain integration
  walletAddress: {
    type: String,
    required: true,
    // unique: true
  },
  publicKey: {
    type: String,
    required: true
  },
  blockchainIdentity: {
    identityId: String,
    network: String
  },  
  // Compliance tracking
  compliance: {
    hipaaCompliant: Boolean,
    gdprCompliant: Boolean,
    dpdpact: Boolean,
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);