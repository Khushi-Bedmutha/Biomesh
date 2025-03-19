import { validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';

export const createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, amount, description, source, transactionHash } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      description,
      source,
      transactionHash
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: req.user._id },
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};