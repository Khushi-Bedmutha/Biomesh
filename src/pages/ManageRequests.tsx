import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Filter, SlidersHorizontal, Download, Send, FileText, Search, AlertCircle } from 'lucide-react';
import { supabase } from '../client/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

interface DataRequest {
  id: string;
  title: string;
  purpose: string;
  requestType: string;
  startDate: string;
  endDate: string;
  dataIds: string[];
  dataTypes: string[];
  userId: string;
  providerId?: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  responseDate?: string;
  responseNote?: string;
}

interface DataItem {
  id: string;
  dataType: string;
  diseaseType: string;
  source: string;
  price: number;
  createdAt: string;
  recordCount: number;
  verified: boolean;
  description: string;
}

const getDataTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'medical_records': 'Medical Records',
    'fitness': 'Fitness Data',
    'genetic': 'Genetic Data',
    'wearable': 'Wearable Data',
    'mental': 'Mental Health',
    'lab_result': 'Lab Results'
  };

  return typeMap[type] || type;
};

const ManageRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sent');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [dataTypeFilter, setDataTypeFilter] = useState('');
  const [sentRequests, setSentRequests] = useState<DataRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<DataRequest[]>([]);
  const [datasetDetails, setDatasetDetails] = useState<Record<string, DataItem>>({});

  useEffect(() => {
    fetchRequests();
    fetchDatasetDetails();
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Mock data for sent requests
      const mockSentRequests: DataRequest[] = [
        {
          id: '1',
          title: 'Cardiovascular Research Project',
          purpose: 'Studying correlation between blood pressure and heart disease',
          requestType: 'academic',
          startDate: '2025-04-01',
          endDate: '2025-10-01',
          dataIds: ['1', '4'],
          dataTypes: ['medical_records', 'wearable'],
          userId: user?.id || '',
          status: 'approved',
          date: '2025-03-10T09:45:00Z',
          responseDate: '2025-03-15T14:23:00Z',
          responseNote: 'Approved for research use. Please reference data source in publications.'
        },
        {
          id: '2',
          title: 'Genetic Markers in Neurological Disorders',
          purpose: 'Identifying genetic markers associated with early-onset neurological conditions',
          requestType: 'academic',
          startDate: '2025-04-15',
          endDate: '2025-09-15',
          dataIds: ['2'],
          dataTypes: ['genetic'],
          userId: user?.id || '',
          status: 'pending',
          date: '2025-03-18T11:30:00Z'
        },
        {
          id: '3',
          title: 'Obesity Treatment Efficacy Study',
          purpose: 'Comparing effectiveness of lifestyle interventions on weight management',
          requestType: 'clinical',
          startDate: '2025-05-01',
          endDate: '2025-11-01',
          dataIds: ['5'],
          dataTypes: ['fitness'],
          userId: user?.id || '',
          status: 'rejected',
          date: '2025-03-05T10:15:00Z',
          responseDate: '2025-03-12T16:45:00Z',
          responseNote: 'Request denied due to insufficient justification for commercial use.'
        }
      ];

      // Mock data for received requests
      const mockReceivedRequests: DataRequest[] = [
        {
          id: '4',
          title: 'Thyroid Disease Risk Factors',
          purpose: 'Analyzing lab results to identify key risk factors for thyroid disorders',
          requestType: 'academic',
          startDate: '2025-04-10',
          endDate: '2025-07-10',
          dataIds: ['3'],
          dataTypes: ['lab_result'],
          userId: 'requester-123',
          providerId: user?.id,
          status: 'pending',
          date: '2025-03-17T13:20:00Z'
        },
        {
          id: '5',
          title: 'Mental Health Assessment Study',
          purpose: 'Evaluating effectiveness of digital mental health screening tools',
          requestType: 'clinical',
          startDate: '2025-04-05',
          endDate: '2025-08-05',
          dataIds: ['6'],
          dataTypes: ['mental'],
          userId: 'requester-456',
          providerId: user?.id,
          status: 'approved',
          date: '2025-03-08T09:30:00Z',
          responseDate: '2025-03-11T11:15:00Z',
          responseNote: 'Approved with condition that all identifiers are removed before publication.'
        },
        {
          id: '6',
          title: 'Infection Rate Analysis',
          purpose: 'Studying patterns in infection rates across demographic groups',
          requestType: 'public_health',
          startDate: '2025-05-15',
          endDate: '2025-08-15',
          dataIds: ['7'],
          dataTypes: ['lab_result'],
          userId: 'requester-789',
          providerId: user?.id,
          status: 'rejected',
          date: '2025-03-02T14:45:00Z',
          responseDate: '2025-03-05T10:30:00Z',
          responseNote: 'Request denied due to limited scope of current data availability.'
        }
      ];

      setSentRequests(mockSentRequests);
      setReceivedRequests(mockReceivedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasetDetails = async () => {
    try {
      // Mock dataset details that would normally come from an API
      const mockDataItems: DataItem[] = [
        {
          id: '1',
          dataType: 'medical_records',
          diseaseType: 'Cardiovascular Disease',
          source: 'Anonymous',
          price: 50,
          createdAt: '2025-02-15',
          recordCount: 145,
          verified: true,
          description: 'Medical records from patients with cardiovascular conditions.'
        },
        {
          id: '2',
          dataType: 'genetic',
          diseaseType: 'Neuroscience',
          source: 'Anonymous',
          price: 120,
          createdAt: '2025-03-01',
          recordCount: 89,
          verified: true,
          description: 'Genetic sequencing data from participants with neurological disorders.'
        },
        {
          id: '3',
          dataType: 'lab_result',
          diseaseType: 'Thyroid',
          source: 'Anonymous',
          price: 75,
          createdAt: '2025-03-10',
          recordCount: 204,
          verified: false,
          description: 'Comprehensive thyroid panel results.'
        },
        {
          id: '4',
          dataType: 'wearable',
          diseaseType: 'Hypertension',
          source: 'Anonymous',
          price: 35,
          createdAt: '2025-02-28',
          recordCount: 312,
          verified: true,
          description: 'Continuous blood pressure monitoring data.'
        },
        {
          id: '5',
          dataType: 'fitness',
          diseaseType: 'Obesity',
          source: 'Anonymous',
          price: 30,
          createdAt: '2025-03-05',
          recordCount: 178,
          verified: true,
          description: 'Physical activity data including step counts and exercise duration.'
        },
        {
          id: '6',
          dataType: 'mental',
          diseaseType: 'Other',
          source: 'Anonymous',
          price: 45,
          createdAt: '2025-03-12',
          recordCount: 96,
          verified: false,
          description: 'Mental health assessment results.'
        },
        {
          id: '7',
          dataType: 'lab_result',
          diseaseType: 'Infection',
          source: 'Anonymous',
          price: 80,
          createdAt: '2025-03-08',
          recordCount: 127,
          verified: true,
          description: 'Laboratory test results from patients with infections.'
        }
      ];

      // Convert array to object with id as key for easy lookup
      const datasetMap = mockDataItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, DataItem>);

      setDatasetDetails(datasetMap);
    } catch (error) {
      console.error('Error fetching dataset details:', error);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      // In a real app, you'd update the database
      setReceivedRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId
            ? {
                ...req,
                status: 'approved',
                responseDate: new Date().toISOString(),
                responseNote: 'Request approved.'
              }
            : req
        )
      );
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      // In a real app, you'd update the database
      setReceivedRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId
            ? {
                ...req,
                status: 'rejected',
                responseDate: new Date().toISOString(),
                responseNote: 'Request rejected.'
              }
            : req
        )
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredRequests = (requests: DataRequest[]) => {
    return requests.filter(request => {
      // Apply status filter
      if (statusFilter !== 'all' && request.status !== statusFilter) {
        return false;
      }

      // Apply date range filter
      if (dateRange.start && new Date(request.date) < new Date(dateRange.start)) {
        return false;
      }
      if (dateRange.end && new Date(request.date) > new Date(dateRange.end)) {
        return false;
      }

      // Apply data type filter
      if (dataTypeFilter && !request.dataTypes.includes(dataTypeFilter)) {
        return false;
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          request.title.toLowerCase().includes(query) ||
          request.purpose.toLowerCase().includes(query)
        );
      }

      return true;
    });
  };

  const displayRequests = activeTab === 'sent' 
    ? filteredRequests(sentRequests) 
    : filteredRequests(receivedRequests);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mt-8 mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Request Management</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage your data requests, track approvals, and handle access permissions for research data.
          </p>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
                <select
                  value={dataTypeFilter}
                  onChange={(e) => setDataTypeFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Types</option>
                  <option value="medical_records">Medical Records</option>
                  <option value="fitness">Fitness Data</option>
                  <option value="genetic">Genetic Data</option>
                  <option value="wearable">Wearable Data</option>
                  <option value="mental">Mental Health</option>
                  <option value="lab_result">Lab Results</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setDataTypeFilter('');
                    setDateRange({ start: '', end: '' });
                    setSearchQuery('');
                  }}
                  className="ml-auto text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 border-b-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                activeTab === 'sent'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center">
                <Send className="h-4 w-4 mr-2" />
                Sent Requests
              </div>
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                activeTab === 'received'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Received Requests
              </div>
            </button>
          </div>
        </div>

        {/* Request List */}
        {loading ? (
          <div className="flex justify-center items-center py-12 bg-white rounded-b-xl shadow-sm border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 mb-12">
            {displayRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Details</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Types</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      {activeTab === 'received' && (
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">{request.title}</div>
                            <div className="text-sm text-gray-500 mt-1">{request.purpose}</div>
                            <div className="text-xs text-gray-500 mt-2">Submitted: {formatDate(request.date)}</div>
                            {request.responseDate && (
                              <div className="text-xs text-gray-500">
                                Response: {formatDate(request.responseDate)}
                              </div>
                            )}
                            {request.responseNote && (
                              <div className="text-xs italic text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                                "{request.responseNote}"
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            {request.dataIds.map((dataId) => {
                              const dataset = datasetDetails[dataId];
                              if (!dataset) return null;
                              return (
                                <div key={dataId} className="flex items-center">
                                  <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                  <div className="text-sm text-gray-600">
                                    {getDataTypeLabel(dataset.dataType)} - {dataset.diseaseType}
                                    {dataset.verified ? (
                                      <span className="inline-flex items-center ml-2 text-xs text-green-600">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Verified
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center ml-2 text-xs text-amber-600">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {request.requestType === 'academic' ? 'Academic Research' : 
                             request.requestType === 'clinical' ? 'Clinical Study' : 
                             request.requestType === 'public_health' ? 'Public Health' : 
                             'Commercial Use'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        {activeTab === 'received' && request.status === 'pending' && (
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Reject
                              </button>
                            </div>
                          </td>
                        )}
                        {activeTab === 'received' && request.status !== 'pending' && (
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-xs text-gray-500 italic">
                              Responded on {formatDate(request.responseDate || '')}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {activeTab === 'sent' ? (
                    <Send className="h-6 w-6 text-gray-400" />
                  ) : (
                    <Download className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No {activeTab} requests found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {activeTab === 'sent'
                    ? 'You haven\'t sent any data requests yet. Visit the marketplace to request data.'
                    : 'You haven\'t received any data requests yet.'}
                </p>
                {activeTab === 'sent' && (
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go to Marketplace
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gray-100 rounded-xl p-6 mb-12">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About Data Requests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Request Processing</h4>
                  <p className="text-sm text-gray-600">Data requests are typically processed within 3-5 business days. You'll receive a notification when your request status changes.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Data Access</h4>
                  <p className="text-sm text-gray-600">Once approved, you'll receive secure access credentials to download or access the requested datasets for the specified time period.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRequests;