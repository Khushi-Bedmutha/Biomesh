import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, SlidersHorizontal, Download, Brain, Heart, Dna, Watch, FileText, FlaskRound, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../client/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import SendRequestModal from '../components/SendRequestModal';

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

const Marketplace = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [dataItems, setDataItems] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        dataType: '',
        diseaseType: '',
        priceRange: [0, 500],
        verifiedOnly: false
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState<DataItem | null>(null);

    const handleRequestSubmit = async (requestData: {
        title: string;
        purpose: string;
        requestType: string;
        startDate: string;
        endDate: string;
        dataIds: string[];
      }) => {
        try {
          // This is where you would submit the data to your backend
          // Example using Supabase:
          const { data, error } = await supabase
            .from('data_requests')
            .insert([
              {
                title: requestData.title,
                purpose: requestData.purpose,
                requestType: requestData.requestType,
                startDate: requestData.startDate,
                endDate: requestData.endDate,
                dataIds: [selectedDataset?.id], // Only send the currently selected dataset
                userId: user?.id,
                status: 'pending',
                date: new Date().toISOString(),
                dataTypes: selectedDataset ? [selectedDataset.dataType] : []
              }
            ]);
            
          if (error) throw error;
          
          // Clear selection after successful submission
          setSelectedDataset(null);
          
          return data;
        } catch (error) {
          console.error('Error submitting request:', error);
          throw error;
        }
      };
    const dataTypeIcons: Record<string, any> = {
        'medical_records': FileText,
        'fitness': Watch,
        'genetic': Dna,
        'wearable': Watch,
        'mental': Brain,
        'lab_result': FlaskRound,
        'default': FileText
    };

    useEffect(() => {
        fetchData();
    }, [filters, searchQuery]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // This would typically come from an API, but for demo purposes, we're generating mock data
            const mockData: DataItem[] = [
                {
                    id: '1',
                    dataType: 'medical_records',
                    diseaseType: 'Cardiovascular Disease',
                    source: 'Anonymous',
                    price: 50,
                    createdAt: '2025-02-15',
                    recordCount: 145,
                    verified: true,
                    description: 'Medical records from patients with cardiovascular conditions including blood pressure readings, ECG results, and treatment histories.'
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
                    description: 'Genetic sequencing data from participants with neurological disorders including gene expressions related to neural pathway development.'
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
                    description: 'Comprehensive thyroid panel results including TSH, T3, T4 levels and antibody tests from patients with various thyroid conditions.'
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
                    description: 'Continuous blood pressure monitoring data from wearable devices worn by patients with hypertension over a 6-month period.'
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
                    description: 'Physical activity data including step counts, exercise duration, heart rate, and calorie expenditure from participants in a weight management program.'
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
                    description: 'Mental health assessment results including standardized anxiety and depression screening tools completed over multiple timepoints.'
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
                    description: 'Laboratory test results from patients with various bacterial and viral infections including blood work, culture results, and antibody levels.'
                },
                {
                    id: '8',
                    dataType: 'medical_records',
                    diseaseType: 'Fatty Liver',
                    source: 'Anonymous',
                    price: 65,
                    createdAt: '2025-02-20',
                    recordCount: 83,
                    verified: true,
                    description: 'Medical records from patients diagnosed with fatty liver disease including liver function tests, imaging results, and treatment protocols.'
                }
            ];

            // Apply filters
            let filteredData = mockData;

            if (filters.dataType) {
                filteredData = filteredData.filter(item => item.dataType === filters.dataType);
            }

            if (filters.diseaseType) {
                filteredData = filteredData.filter(item => item.diseaseType === filters.diseaseType);
            }

            if (filters.verifiedOnly) {
                filteredData = filteredData.filter(item => item.verified);
            }

            filteredData = filteredData.filter(item =>
                item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
            );

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filteredData = filteredData.filter(item =>
                    item.diseaseType.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
                );
            }

            setDataItems(filteredData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestClick = (dataset: DataItem) => {
        setSelectedDataset(dataset);
        setShowRequestModal(true);
    };

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

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
                                placeholder="Search datasets..."
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Research Data Repository</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Access high-quality health datasets for research purposes.
                        All data is de-identified, ethically sourced, and compliant with research standards.
                    </p>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
                                <select
                                    value={filters.dataType}
                                    onChange={(e) => setFilters({ ...filters, dataType: e.target.value })}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Disease Area</label>
                                <select
                                    value={filters.diseaseType}
                                    onChange={(e) => setFilters({ ...filters, diseaseType: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">All Areas</option>
                                    <option value="Neuroscience">Neuroscience</option>
                                    <option value="Thyroid">Thyroid</option>
                                    <option value="Cardiovascular Disease">Cardiovascular Disease</option>
                                    <option value="Obesity">Obesity</option>
                                    <option value="Hypertension">Hypertension</option>
                                    <option value="Infection">Infection</option>
                                    <option value="Fatty Liver">Fatty Liver</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Range (BMT)</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        value={filters.priceRange[0]}
                                        onChange={(e) => setFilters({ ...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]] })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        min="0"
                                    />
                                    <span>to</span>
                                    <input
                                        type="number"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="flex items-end">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.verifiedOnly}
                                        onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Verified Datasets Only</span>
                                </label>

                                <button
                                    onClick={() => setFilters({ dataType: '', diseaseType: '', priceRange: [0, 500], verifiedOnly: false })}
                                    className="ml-auto text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    Reset All
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-12">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dataset</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost (BMT)</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dataItems.map((item) => {
                                    const IconComponent = dataTypeIcons[item.dataType] || dataTypeIcons.default;
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-start">
                                                    <div className={`p-2 rounded-lg ${item.verified ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                                        <IconComponent className={`h-6 w-6 ${item.verified ? 'text-indigo-600' : 'text-gray-600'}`} />
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{getDataTypeLabel(item.dataType)}</div>
                                                        <div className="text-sm text-gray-500">{item.diseaseType}</div>
                                                        {item.verified ? (
                                                            <span className="flex items-center text-xs text-green-600 mt-1">
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Verified
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center text-xs text-amber-600 mt-1">
                                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                                Pending Verification
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-md">{item.description}</div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center">
                                                        <Lock className="h-3 w-3 mr-1" />
                                                        De-identified
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.recordCount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(item.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.price} BMT
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleRequestClick(item)}
                                                    className="flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                                                >
                                                    <Download className="h-3 w-3 mr-1" />
                                                    Request
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {dataItems.length === 0 && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200 mb-12">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No datasets found</h3>
                        <p className="text-gray-600 mb-6">
                            We couldn't find any datasets matching your current filters. Try adjusting your search criteria.
                        </p>
                        <button
                            onClick={() => {
                                setFilters({ dataType: '', diseaseType: '', priceRange: [0, 500], verifiedOnly: false });
                                setSearchQuery('');
                            }}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Send Request Modal - Now for individual dataset only */}
                {selectedDataset && (
                    <SendRequestModal
                        isOpen={showRequestModal}
                        onClose={() => {
                            setShowRequestModal(false);
                            setSelectedDataset(null);
                        }}
                        selectedDatasets={selectedDataset ? [selectedDataset] : []}
                        onRequestSubmit={handleRequestSubmit}
                    />
                )}

                {/* Research Ethics Information */}
                <div className="bg-gray-100 rounded-xl p-6 mb-12">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Compliance & Ethics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start">
                                <Lock className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                                <div>
                                    <h4 className="font-medium text-gray-900">Secure Data Transfer</h4>
                                    <p className="text-sm text-gray-600">All datasets are securely transferred and only accessible to approved researchers with proper credentials.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Brain className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                                <div>
                                    <h4 className="font-medium text-gray-900">IRB-Compliant</h4>
                                    <p className="text-sm text-gray-600">Datasets are collected following ethical guidelines and are suitable for IRB-approved research protocols.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;