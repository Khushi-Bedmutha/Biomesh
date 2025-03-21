import React from 'react';
import { Search, Brain, CreditCard } from 'lucide-react';

const stats = [
  {
    title: 'Browse Data',
    icon: Search,
    link: '/browse'
  },
  {
    title: 'Purchase AI Insights',
    icon: Brain,
    link: '/insights'
  },
  {
    title: 'Billing & Payments',
    icon: CreditCard,
    link: '/billing'
  }
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <stat.icon className="h-8 w-8 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">{stat.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}