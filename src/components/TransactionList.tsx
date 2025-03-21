import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { transactionsApi, Transaction } from '../services/api';

export default function TransactionList() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await transactionsApi.getAll();
        // Get only the most recent transactions for the list view
        setTransactions(data.slice(0, 5));
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  // Helper function to get transaction icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        
        {isLoading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-500">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No recent transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <span className="font-medium">
                      {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} BMT
                    </span>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <button
          onClick={() => navigate("/wallet")}
          className="m-4 bg-blue-600 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200 ease-in-out"
        >
          Manage Wallet
        </button>
      </div>
    </div>
  );
}