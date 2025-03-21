import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export interface Transaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  source: 'clinical_trial' | 'data_contribution' | 'withdrawal' | 'deposit';
  status: 'pending' | 'completed' | 'failed';
  transactionHash: string;
  createdAt: string;
  updatedAt: string;
}

// Wallet type
export interface Wallet {
  balance: number;
  currency: string;
}

// API functions for transactions
export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get('/transactions');
    return response.data;
  },
  
  create: async (transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },
  
  updateStatus: async (transactionId: string, status: 'pending' | 'completed' | 'failed'): Promise<Transaction> => {
    const response = await api.patch('/transactions/status', { transactionId, status });
    return response.data;
  }
};

// API functions for wallet
export const walletApi = {
  getBalance: async (): Promise<number> => {
    const response = await api.get('/wallet');
    return response.data.balance;
  },
  
  credit: async (
    amount: number, 
    description: string, 
    source: 'clinical_trial' | 'data_contribution' | 'deposit',
    transactionHash: string
  ): Promise<{ wallet: Wallet, transaction: Transaction }> => {
    const response = await api.post('/wallet/credit', {
      amount,
      description,
      source,
      transactionHash
    });
    return response.data;
  },
  
  debit: async (
    amount: number,
    description: string,
    transactionHash: string
  ): Promise<{ wallet: Wallet, transaction: Transaction }> => {
    const response = await api.post('/wallet/debit', {
      amount,
      description,
      source: 'withdrawal',
      transactionHash
    });
    return response.data;
  },
  
  // Helper function to generate simple transaction hash (in production, use a more robust approach)
  generateTransactionHash: () => {
    return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
};

export default api;