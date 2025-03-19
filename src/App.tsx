import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import { Brain, Upload, Sparkles, Coins, Lock, Database, BarChart as ChartBar, Users, Award, Shield, TrendingUp, PlayCircle, ChevronRight, Guitar as Hospital, FlaskRound as Flask, Building2 } from 'lucide-react';

function App() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">BioMesh</span>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen bg-white overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=2970&q=80"
            alt="AI and Healthcare Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Own Your Health Data.
              <span className="block text-blue-200">Monetize It.</span>
              <span className="block text-blue-300">Power AI Research.</span>
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Turn your health records into medical breakthroughs while ensuring privacy & control.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center">
                Start Earning from Your Data
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="px-8 py-4 bg-blue-700/50 text-white rounded-lg font-semibold hover:bg-blue-700/60 transition-colors flex items-center justify-center"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch How It Works
              </button>
            </div>
          </motion.div>

          {/* Live Metrics */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <CountUp
                end={100}
                suffix="K+"
                duration={2.5}
                className="text-5xl font-bold text-white"
              />
              <p className="mt-2 text-xl text-blue-200">Active Users</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <CountUp
                end={500}
                suffix="K+"
                duration={2.5}
                className="text-5xl font-bold text-white"
              />
              <p className="mt-2 text-xl text-blue-200">AI Insights Generated</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <CountUp
                prefix="$"
                end={5}
                suffix="M+"
                duration={2.5}
                className="text-5xl font-bold text-white"
              />
              <p className="mt-2 text-xl text-blue-200">Total Rewards Paid</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">How BioMesh Works</h2>
            <p className="mt-4 text-xl text-gray-500">Your journey to data ownership and monetization</p>
          </div>

          <div className="mt-20 grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Upload className="h-8 w-8 text-white" />,
                title: "Upload Your Health Data",
                description: "Connect your wearables, genetic tests, and medical records securely"
              },
              {
                icon: <Sparkles className="h-8 w-8 text-white" />,
                title: "AI Generates Insights",
                description: "Get personalized health predictions and risk assessments"
              },
              {
                icon: <Lock className="h-8 w-8 text-white" />,
                title: "Control Access",
                description: "Manage permissions with smart contracts and blockchain security"
              },
              {
                icon: <Coins className="h-8 w-8 text-white" />,
                title: "Earn Tokens",
                description: "Receive rewards when researchers use your anonymous data"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full p-4">
                  {step.icon}
                </div>
                <div className="pt-8 px-6 pb-6 bg-white rounded-xl shadow-xl border border-gray-100">
                  <h3 className="mt-8 text-xl font-semibold text-gray-900 text-center">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-gray-500 text-center">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">AI-Powered Health Insights</h2>
            <p className="mt-4 text-xl text-gray-500">Real-time discoveries powered by collective health data</p>
          </div>

          <div className="mt-16 grid gap-8 grid-cols-1 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-xl border border-gray-100"
            >
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <h3 className="ml-4 text-xl font-semibold text-gray-900">Latest AI Discovery</h3>
              </div>
              <p className="mt-4 text-gray-600">
                AI Just Detected a New Early-Stage Cancer Biomarker from 250K Records
              </p>
              <div className="mt-6 flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                <span>5,000 Users Received Diabetes Risk Reports Today</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-xl border border-gray-100"
            >
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
                alt="AI Health Report Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Preview Your AI Health Report</h3>
              <p className="mt-2 text-gray-600">
                Get personalized insights and predictions based on your health data
              </p>
              <button className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Get Your AI Health Report Now
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Why Join BioMesh?</h2>
            <p className="mt-4 text-xl text-gray-500">Leading the future of personalized healthcare</p>
          </div>

          <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-2">
            {[
              {
                icon: <Shield className="h-12 w-12 text-blue-600" />,
                title: "Privacy-First",
                description: "Your data is encrypted, anonymized & 100% user-controlled"
              },
              {
                icon: <Flask className="h-12 w-12 text-blue-600" />,
                title: "Medical Research Acceleration",
                description: "Your data helps AI discover life-saving treatments"
              },
              {
                icon: <Coins className="h-12 w-12 text-blue-600" />,
                title: "Earn While Helping Science",
                description: "Get rewarded every time your data powers a study"
              },
              {
                icon: <Database className="h-12 w-12 text-blue-600" />,
                title: "Decentralized & Transparent",
                description: "Blockchain ensures no middlemen control your health records"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex p-8 bg-gray-50 rounded-xl"
              >
                <div className="shrink-0">{benefit.icon}</div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="mt-2 text-gray-500">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Research Partners</h2>
            <p className="mt-4 text-xl text-gray-500">Trusted by leading healthcare institutions</p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { icon: <Hospital className="h-12 w-12" />, name: "Mayo Clinic" },
              { icon: <Building2 className="h-12 w-12" />, name: "Stanford Health" },
              { icon: <Hospital className="h-12 w-12" />, name: "Johns Hopkins" },
              { icon: <Building2 className="h-12 w-12" />, name: "Cleveland Clinic" }
            ].map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm"
              >
                <div className="text-blue-600">{partner.icon}</div>
                <span className="mt-4 text-lg font-medium text-gray-900">{partner.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white p-8 rounded-xl shadow-xl"
          >
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xl text-gray-600 italic">
                "I earned $500 from clinical trials while staying completely anonymous. BioMesh has revolutionized how we participate in medical research!"
              </p>
              <div className="mt-4">
                <span className="text-gray-900 font-medium">Sarah K.</span>
                <span className="text-gray-500"> • BioMesh User</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Take Control of Your Health Data Today!
            </h2>
            <p className="mt-4 text-xl text-blue-200">
              Join thousands of users already earning from their health data
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Sign Up & Earn
              </button>
              <button className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors">
                Explore the AI Marketplace
              </button>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-12 max-w-xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-transparent focus:border-blue-300 focus:ring-0"
                />
                <button className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="mt-2 text-sm text-blue-200">
                Get the latest AI health insights & token rewards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">About</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase">Connect</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Twitter</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">&copy; 2025 BioMesh. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full mx-4">
            <div className="flex justify-end">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9 mt-4">
              {/* Replace with actual video embed */}
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Video Player Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;