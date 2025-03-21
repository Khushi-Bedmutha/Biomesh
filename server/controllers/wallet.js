import { validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/wallet.js';

export const getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });

    res.json({ balance: wallet?.balance || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const creditWallet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, description, source, transactionHash } = req.body;

    // Update wallet balance
    let wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id, balance: amount });
    } else {
      wallet.balance += amount;
      await wallet.save();
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'credit',
      amount,
      description,
      source,
      transactionHash,
      status: 'completed'
    });

    res.status(201).json({ wallet, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const debitWallet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, description, source, transactionHash } = req.body;

    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    wallet.balance -= amount;
    await wallet.save();

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'debit',
      amount,
      description,
      source,
      transactionHash,
      status: 'completed'
    });

    res.status(201).json({ wallet, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
