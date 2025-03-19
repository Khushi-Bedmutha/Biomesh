import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { Brain, Bell, Upload, Search, Guitar as Hospital, Heart, Activity, FileText, Lock, Wallet, FlaskRound as Flask, BarChart, ChevronRight, Settings, LogOut, AlertCircle, MessageCircle, X, Send, Paperclip, Brain as BrainIcon } from 'lucide-react';
import Navbar from './navbar';
const Dashboard = () => {
  const [showChat, setShowChat] = useState(false);
  const [activeChat, setActiveChat] = useState('Pharma Inc.');
  const navigate = useNavigate();
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const conversations = [
    {
      id: 1,
      name: 'Pharma Inc.',
      lastMessage: 'Diabetes AI Reports',
      unread: 1,
      active: true
    },
    {
      id: 2,
      name: 'GenAI Labs',
      lastMessage: 'Genetic Research',
      unread: 0,
      active: false
    },
    {
      id: 3,
      name: 'Dr. Smith',
      lastMessage: 'Clinical Trial Inquiry',
      unread: 0,
      active: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'BioMesh AI',
      content: 'Our AI model can analyze 500K+ diabetes datasets. Pricing: $10K/month.',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      sender: 'Pharma Inc.',
      content: 'Can we get a sample report?',
      timestamp: '10:32 AM'
    },
    {
      id: 3,
      sender: 'BioMesh AI',
      content: '[Attached: Sample_Diabetes.pdf]',
      timestamp: '10:35 AM',
      attachment: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <Navbar/>

      {/* Main Content */}
      <div className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center" onClick={() => navigate('/upload-health-data')}>
              <div className="bg-blue-100 rounded-lg p-3">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Health Data</h3>
                <p className="text-sm text-gray-500">Share medical records securely</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">View AI Insights</h3>
                <p className="text-sm text-gray-500">Personalized health analysis</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/clinical-trials')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <Hospital className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Research Requests</h3>
                <p className="text-sm text-gray-500">Browse active studies</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Insights Panel */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Health Insights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-red-700 font-medium">Heart Risk</span>
                    </div>
                    <span className="text-2xl font-bold text-red-700">
                      <CountUp end={80} suffix="%" duration={2} />
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-red-200 rounded-full">
                    <div className="h-2 bg-red-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="text-orange-700 font-medium">Diabetes Risk</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-700">
                      <CountUp end={25} suffix="%" duration={2} />
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-orange-200 rounded-full">
                    <div className="h-2 bg-orange-500 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Reports</h3>
                <div className="space-y-4">
                  {[
                    { title: "Monthly Health Summary", date: "Mar 15, 2025" },
                    { title: "Genetic Analysis Report", date: "Mar 10, 2025" },
                    { title: "Lifestyle Recommendations", date: "Mar 5, 2025" }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{report.title}</h4>
                          <p className="text-xs text-gray-500">{report.date}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Sharing Controls</h2>
            <div className="space-y-4">
              {[
                { title: "Clinical Research", icon: Flask, enabled: true },
                { title: "AI Training", icon: Brain, enabled: true },
                { title: "Anonymous Statistics", icon: BarChart, enabled: false }
              ].map((control, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <control.icon className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-sm font-medium text-gray-900">{control.title}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={control.enabled} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-700">Total Earnings</span>
                  <span className="text-2xl font-bold text-green-700">150 BMT</span>
                </div>
                <button className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Withdraw Tokens
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            onClick={() => navigate('/clinical-trials')}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white cursor-pointer"
          >
            <h3 className="text-xl font-semibold mb-2">Join Clinical Trials</h3>
            <p className="text-purple-100 mb-4">Participate in groundbreaking research and earn additional tokens</p>
            <button className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition-colors">
              Browse Trials
            </button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white"
          >
            <h3 className="text-xl font-semibold mb-2">Data Marketplace</h3>
            <p className="text-blue-100 mb-4">Explore opportunities to contribute your data to research</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              View Marketplace
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating Message Button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Interface */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200"
          >
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BrainIcon className="h-8 w-8 text-blue-600" />
                  <h3 className="ml-2 text-lg font-semibold text-gray-900">BioMesh Chat</h3>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex h-[calc(100%-144px)]">
              {/* Conversations Sidebar */}
              <div className="w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setActiveChat(conv.name)}
                    className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                      activeChat === conv.name ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{conv.name}</span>
                      {conv.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">{conv.lastMessage}</p>
                  </div>
                ))}
              </div>

              {/* Chat Window */}
              <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">{activeChat}</h4>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'BioMesh AI' ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'BioMesh AI'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs mt-1 block opacity-70">
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="p-2 text-blue-600 hover:text-blue-700">
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;