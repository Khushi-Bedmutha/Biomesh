import React from 'react';
import { DataRequest } from '../types';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const requests: DataRequest[] = [
  {
    id: '1',
    title: 'Brain MRI Data',
    status: 'pending',
    date: '2024-03-15'
  },
  {
    id: '2',
    title: "Alzheimer's Study",
    status: 'approved',
    date: '2024-03-14'
  },
  {
    id: '3',
    title: 'Wearable Heart Data',
    status: 'rejected',
    date: '2024-03-13'
  }
];

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle
};

const statusColors = {
  pending: 'text-yellow-500',
  approved: 'text-green-500',
  rejected: 'text-red-500'
};

export default function RequestList() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Data Requests</h2>
        <div className="space-y-4">
          {requests.map((request) => {
            const StatusIcon = statusIcons[request.status];
            return (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <StatusIcon className={`h-5 w-5 ${statusColors[request.status]}`} />
                  <span className="font-medium">{request.title}</span>
                </div>
                <span className="text-sm text-gray-500">{request.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}