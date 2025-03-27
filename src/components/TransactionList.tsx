import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '../services/api'; // Keep this for type

export default function TransactionList() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMockTransactions = async () => {
      try {
        setIsLoading(true);

        // Mock data
        const mockData: Transaction[] = [
          {
            _id: "txn1",
            type: "credit",
            amount: 150.0,
            description: "Clinical trial participation reward",
            source: "clinical_trial",
            status: "completed",
            transactionHash: "0xabc123456789",
            createdAt: "2025-03-20T10:00:00Z",
            updatedAt: "2025-03-20T10:00:00Z"
          },
          {
            _id: "txn2",
            type: "debit",
            amount: 50.0,
            description: "Withdrawal to bank account",
            source: "withdrawal",
            status: "completed",
            transactionHash: "0xdef987654321",
            createdAt: "2025-03-21T14:30:00Z",
            updatedAt: "2025-03-21T14:30:00Z"
          },
          {
            _id: "txn3",
            type: "credit",
            amount: 25.0,
            description: "Uploaded health data",
            source: "data_contribution",
            status: "pending",
            transactionHash: "0x123abc456def",
            createdAt: "2025-03-22T08:15:00Z",
            updatedAt: "2025-03-22T08:15:00Z"
          },
          
        ];

        setTransactions(mockData.slice(0, 5));
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMockTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

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
