import React from 'react';
import { Transaction } from '../types';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const transactions: Transaction[] = [
  {
    amount: 1000,
    description: 'AI Model',
    status: 'completed',
    date: '2024-03-15'
  },
  {
    amount: 500,
    description: 'Cancer Research',
    status: 'completed',
    date: '2024-03-14'
  }
];


export default function TransactionList() {
const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <span className="font-medium">{transaction.amount} BMT</span>
                  <p className="text-sm text-gray-500">{transaction.description}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{transaction.date}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center">
  <button
    onClick={() => navigate("/wallet")}
    className="m-4 bg-blue-600 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200 ease-in-out"
  >
    Manage Requests
  </button>
</div>

    </div>
  );
}