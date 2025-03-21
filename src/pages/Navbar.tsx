import React, { useEffect, useState } from "react";
import { Brain, Bell, Upload, Search, Guitar as Hospital, Heart, Activity, FileText, Lock, Wallet, FlaskRound as Flask, BarChart, ChevronRight, Settings, LogOut, AlertCircle, MessageCircle, X, Send, Paperclip, Brain as BrainIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { walletApi } from "../services/api";

const Navbar = () => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const[walletBalance, setWalletBalance] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
          try {
            
            const balance = await walletApi.getBalance();
            setWalletBalance(balance);
            
            
          } catch (err) {
            console.error('Error fetching wallet data:', err);
          } 
        };
        
        fetchData();
      }, []);
    const handleLogout = () => {
        // Clear user session or authentication data if stored
        localStorage.removeItem('token'); // Example: Remove authentication token
        sessionStorage.removeItem('token'); // Example: Remove session data
    
        // Redirect to the login page after logging out
        navigate('/');
      };

    return (
        <nav className="bg-white shadow-sm fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center" onClick={()=>navigate('/dashboard')}>
                        <Brain className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-gray-900">BioMesh</span>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div
                            onClick={() => navigate('/wallet')}
                            className="bg-blue-50 px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-blue-100 transition-colors"
                        >
                            <Wallet className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-blue-600 font-semibold">{walletBalance} BMT</span>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 rounded-full hover:bg-gray-100 relative"
                            >
                                <Bell className="h-6 w-6 text-gray-600" />
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                                    </div>
                                    {[
                                        "New research opportunity available",
                                        "Your data was used in a study (+5 BMT)",
                                        "Weekly health report ready"
                                    ].map((notification, index) => (
                                        <div key={index} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center">
                                            <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                                            <span className="text-sm text-gray-600">{notification}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <Settings className="h-6 w-6 text-gray-600" />
                        </button>

                        <button className="p-2 rounded-full hover:bg-gray-100" onClick={handleLogout}>
                            <LogOut className="h-6 w-6 text-gray-600" onClick={handleLogout} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;