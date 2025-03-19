import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Shield, DollarSign, Clock, Users, Building2, ChevronRight, AlertCircle, CheckCircle2, Filter } from 'lucide-react';

const ClinicalTrials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Trials' },
    { id: 'alzheimers', name: "Alzheimer's" },
    { id: 'cancer', name: 'Cancer' },
    { id: 'diabetes', name: 'Diabetes' },
    { id: 'cardio', name: 'Cardiovascular' },
  ];

  const trials = [
    {
      id: 1,
      title: "Alzheimer's AI Study",
      institution: 'Mayo Clinic Research',
      category: 'alzheimers',
      reward: 500,
      participants: 250,
      duration: '6 months',
      description: 'Pioneering study using AI to detect early markers of Alzheimer\'s disease through comprehensive data analysis.',
      requirements: ['Age 50-75', 'No prior neurological conditions', 'Regular medical checkups'],
      verified: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1789&q=80'
    },
    {
      id: 2,
      title: 'DNA-Based Cancer Research',
      institution: 'Stanford Medical Center',
      category: 'cancer',
      reward: 700,
      participants: 500,
      duration: '12 months',
      description: 'Groundbreaking research studying genetic markers for early cancer detection using advanced AI analysis.',
      requirements: ['Age 25-65', 'No current cancer diagnosis', 'Genetic testing consent'],
      verified: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
    },
    {
      id: 3,
      title: 'Diabetes Prevention Trial',
      institution: 'Johns Hopkins Research',
      category: 'diabetes',
      reward: 400,
      participants: 300,
      duration: '9 months',
      description: 'Innovative study focusing on preventing type 2 diabetes through AI-powered lifestyle interventions.',
      requirements: ['Age 30-60', 'Pre-diabetic condition', 'No current diabetes medication'],
      verified: true,
      featured: false,
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80'
    }
  ];

  const filteredTrials = trials.filter(trial => {
    const matchesSearch = trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || trial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Find Clinical Trials</h1>
            <p className="text-xl text-blue-100 mb-8">
              Participate in groundbreaking research and earn rewards while advancing medical science
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search clinical trials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-4 top-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="flex overflow-x-auto space-x-4 pb-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-200 shadow-sm transition-colors`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Users, label: 'Active Participants', value: '1,000+' },
            { icon: Building2, label: 'Research Institutions', value: '50+' },
            { icon: DollarSign, label: 'Total Rewards Paid', value: '$500K+' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trial Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTrials.map((trial, index) => (
            <motion.div
              key={trial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={trial.image}
                  alt={trial.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{trial.title}</h3>
                  {trial.verified && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="h-5 w-5 mr-1" />
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{trial.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{trial.institution}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{trial.participants} participants</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{trial.duration}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span className="text-sm font-semibold">${trial.reward} Reward</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {trial.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Apply Now
                  <ChevronRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Data Privacy Guaranteed',
                description: 'Your information is protected with enterprise-grade encryption'
              },
              {
                icon: CheckCircle2,
                title: 'Verified Researchers',
                description: 'All research institutions are thoroughly vetted'
              },
              {
                icon: Star,
                title: 'Quality Assurance',
                description: 'Trials follow strict medical research standards'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalTrials;