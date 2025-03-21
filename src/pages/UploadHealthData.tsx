import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Activity, Heart, Brain, Dna, Watch, ArrowLeft, Shield, Lock, FileCheck, FlaskRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client/supabaseClient';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileData {
    id: string;
    file: File;
    status: UploadStatus;
    progress: number;
    diseaseType: string | null;
    publicUrl?: string;
}

interface HealthData {
    type: string | null;
    description: string;
    diseaseType: string[];
    hash: string | null;
}

const diseaseOptions = [
    'Neuroscience',
    'Thyroid',
    'Cardiovascular Disease',
    'Obesity',
    'Hypertension',
    'Infection',
    'Fatty Liver',
    'Other'
];

const UploadHealth = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [healthData, setHealthData] = useState<HealthData>({
        type: null,
        description: '',
        diseaseType: [],
        hash: null,
    });
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [datasetDescription, setDatasetDescription] = useState<string>('');
    const [files, setFiles] = useState<FileData[]>([]);

    useEffect(() => {
        if (!user) {
            setError('You need to be logged in to upload dataset.');
            console.log("Not Authenticated.");
        } else {
            setError(null);
            console.log("Authenticated: ", user);
        }
    }, [user]);

    const dataTypes = [
        { id: 'medical_records', name: 'Medical Records', icon: FileText, description: 'Upload medical history, lab results, or doctor\'s notes'},
        { id: 'fitness', name: 'Fitness Data', icon: Activity, description: 'Share workout data, steps, and physical activity'},
        { id: 'genetic', name: 'Genetic Data', icon: Dna, description: 'DNA test results and genetic information' },
        { id: 'wearable', name: 'Wearable Data', icon: Watch, description: 'Data from smartwatches and health monitoring devices' },
        { id: 'mental', name: 'Mental Health', icon: Brain, description: 'Mental health assessments and records' },
        { id: 'lab_result', name: 'Lab Results', icon: FlaskRound, description: 'Laboratory test results, medical screenings, and diagnostic reports' }
    ];

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            processFiles(selectedFiles);
        }
    };

    const processFiles = (newFiles: File[]) => {
        const processedFiles = newFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            status: 'idle' as UploadStatus,
            progress: 0,
            diseaseType: null,
        }));

        setFiles(prev => [...prev, ...processedFiles]);
    };

    const uploadFile = async (fileId: string) => {
        const fileIndex = files.findIndex(f => f.id === fileId);
        if (fileIndex === -1) return;

        const fileData = files[fileIndex];
        
        // Update file status to uploading
        setFiles(prev => 
            prev.map(f => 
                f.id === fileId ? { ...f, status: 'uploading', progress: 10 } : f
            )
        );
        
        try {
            if (!user || !healthData.type) {
                throw new Error("Missing user ID or data type");
            }
            
            const fileName = `${user.id}/${healthData.type}/${fileData.file.name}`;
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('health-data')
                .upload(fileName, fileData.file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            // Update progress
            setFiles(prev => 
                prev.map(f => 
                    f.id === fileId ? { ...f, progress: 50 } : f
                )
            );

            const { data: { publicUrl } } = supabase.storage.from('health-data').getPublicUrl(fileName);

            // Now submit metadata to your API
            await api.post('/health-data', {
                dataType: healthData.type,
                source: user.id,
                diseaseType: fileData.diseaseType || 'Unknown',
                fileName: fileData.file.name,
                fileSize: fileData.file.size,
                fileType: fileData.file.type,
                description: healthData.description,
                datasetDescription: datasetDescription,
                url: publicUrl, // Store the reference, not the file itself
                hash: Math.random().toString(36).substring(7) // Consider using a proper hash function in production
            });

            // Update file status to success
            setFiles(prev => 
                prev.map(f => 
                    f.id === fileId ? { ...f, status: 'success', progress: 100, publicUrl } : f
                )
            );

        } catch (error) {
            console.error("Error uploading file:", error);
            // Update file status to error
            setFiles(prev => 
                prev.map(f => 
                    f.id === fileId ? { ...f, status: 'error', progress: 0 } : f
                )
            );
        }
    };

    const handleSubmitAll = async () => {
        const pendingFiles = files.filter(f => f.status === 'idle');
        for (const fileData of pendingFiles) {
            await uploadFile(fileData.id);
        }
    };

    const updateDiseaseType = (fileId: string, disease: string) => {
        setFiles(prev => 
            prev.map(f => 
                f.id === fileId ? { ...f, diseaseType: disease } : f
            )
        );
    };

    const removeFile = (fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const setSelectedType = (type: string) => {
        setHealthData(prev => ({
            ...prev,
            type
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Dashboard
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-600">
                                <Lock className="h-5 w-5 mr-2" />
                                <span>End-to-End Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Health Dataset</h1>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                {/* Data Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {dataTypes.map(type => (
                        <motion.div
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedType(type.id)}
                            className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all cursor-pointer ${healthData.type === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                }`}
                        >
                            <div className="flex items-center mb-4">
                                <div className={`p-3 rounded-lg ${healthData.type === type.id ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>
                                    <type.icon className={`h-6 w-6 ${healthData.type === type.id ? 'text-blue-600' : 'text-gray-600'
                                        }`} />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-gray-900">{type.name}</h3>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{type.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Dataset Description Field */}
                {healthData.type && (
                    <div className="mb-8">
                        <label htmlFor="datasetDescription" className="block text-sm font-medium text-gray-700 mb-2">
                            Dataset Description
                        </label>
                        <textarea
                            id="datasetDescription"
                            placeholder="Describe your dataset (e.g., time period covered, collection methods, relevant health conditions)"
                            value={datasetDescription}
                            onChange={(e) => setDatasetDescription(e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-4 py-3 w-full h-32 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            A detailed description helps researchers understand the context of your data.
                        </p>
                    </div>
                )}

                {/* Upload Area */}
                <div
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileSelect}
                        disabled={!healthData.type}
                    />

                    <div className="flex flex-col items-center">
                        <Upload className="h-16 w-16 text-blue-600 mb-6" />
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                            {healthData.type ? 'Drag and drop your files here' : 'Select a data type to begin'}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                            {healthData.type
                                ? 'or click to select files from your computer'
                                : 'Choose from the data types above to specify what kind of health data you\'re uploading'
                            }
                        </p>
                        {healthData.type && (
                            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
                                Select Files
                            </button>
                        )}
                    </div>
                </div>
                
                <AnimatePresence>
                    {files.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">Selected Files</h3>
                                    <span className="text-sm text-gray-600">
                                        {files.length} file{files.length !== 1 ? 's' : ''} selected
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {files.map((fileData) => (
                                    <div key={fileData.id} className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <FileCheck className="h-6 w-6 text-gray-400 mr-3" />
                                                <div>
                                                    <span className="font-medium text-gray-900">{fileData.file.name}</span>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(fileData.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="mb-4">
                                            <select
                                                value={fileData.diseaseType || ''}
                                                onChange={(e) => updateDiseaseType(fileData.id, e.target.value)}
                                                className="text-sm border border-gray-300 rounded-lg px-4 py-2 w-full md:w-auto"
                                            >
                                                <option value="">Select Disease/Diagnosis</option>
                                                {diseaseOptions.map((disease, idx) => (
                                                    <option key={idx} value={disease}>
                                                        {disease}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex items-center space-x-6 mb-4">
                                            <span className="text-sm text-green-600 font-medium">
                                                {/* Earn {dataTypes.find(t => t.id === healthData.type)?.reward} */}
                                                Earn 150 BMT
                                            </span>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-6">
                                                <div
                                                    className={`h-2 rounded-full ${fileData.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${fileData.progress}%` }}
                                                />
                                            </div>
                                            {fileData.status === 'idle' && (
                                                <button
                                                    onClick={() => uploadFile(fileData.id)}
                                                    className={`bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors ${!fileData.diseaseType ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700'
                                                        }`}
                                                    disabled={!fileData.diseaseType}
                                                >
                                                    Upload
                                                </button>
                                            )}
                                            {fileData.status === 'uploading' && (
                                                <span className="text-sm text-blue-600 font-medium">
                                                    Uploading... {fileData.progress}%
                                                </span>
                                            )}
                                            {fileData.status === 'success' && (
                                                <span className="flex items-center text-green-600">
                                                    <CheckCircle2 className="h-5 w-5 mr-2" />
                                                    Upload Complete
                                                </span>
                                            )}
                                            {fileData.status === 'error' && (
                                                <span className="flex items-center text-red-600">
                                                    <AlertCircle className="h-5 w-5 mr-2" />
                                                    Upload Failed
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {files.length > 0 && files.some(f => f.status === 'idle') && (
                    <div className='flex flex-col items-center'>
                        <button 
                            onClick={handleSubmitAll}
                            className='m-4 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors'
                        >
                            Upload All Files
                        </button>
                    </div>
                )}
                
                {/* Privacy Notice */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            icon: Lock,
                            title: 'End-to-End Encryption',
                            description: 'All files are encrypted before being transmitted and stored'
                        },
                        {
                            icon: Brain,
                            title: 'AI-Powered Anonymization',
                            description: 'Advanced AI ensures your personal information remains private'
                        }
                    ].map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <feature.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="ml-3 font-semibold text-gray-900">{feature.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UploadHealth;