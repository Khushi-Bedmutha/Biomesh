import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One wallet per user
    },
    balance: {
      type: Number,
      default: 0,
      min: 0, // Optional safeguard
    },
    currency: {
      type: String,
      default: 'BMT', // Assuming BMT is your token
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Wallet', walletSchema);
