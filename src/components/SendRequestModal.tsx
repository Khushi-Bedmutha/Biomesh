import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../ui/dialog';
import { supabase } from '../client/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Check, Calendar, ClipboardList, FileText, Info, AlertCircle, ArrowRight, XCircle, CheckSquare } from 'lucide-react';

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

interface DataRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDatasets: DataItem[];
  onRequestSubmit: (requestData: {
    title: string;
    purpose: string;
    requestType: string;
    startDate: string;
    endDate: string;
    dataIds: string[];
  }) => Promise<void>;
}

const DataRequestModal: React.FC<DataRequestModalProps> = ({
  isOpen,
  onClose,
  selectedDatasets,
  onRequestSubmit
}) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    requestType: 'research',
    startDate: '',
    endDate: '',
    agreeToTerms: false
  });

  const totalCost = selectedDatasets.reduce((sum, dataset) => sum + dataset.price, 0);
  const totalRecords = selectedDatasets.reduce((sum, dataset) => sum + dataset.recordCount, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Request title is required';
    }
    
    if (!formData.purpose.trim()) {
      errors.purpose = 'Research purpose is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms of use';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      await onRequestSubmit({
        title: formData.title,
        purpose: formData.purpose,
        requestType: formData.requestType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        dataIds: selectedDatasets.map(dataset => dataset.id)
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting request:', error);
      setFormErrors({
        submit: 'There was an error submitting your request. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitted) {
      // Reset form when closing after successful submission
      setFormData({
        title: '',
        purpose: '',
        requestType: 'research',
        startDate: '',
        endDate: '',
        agreeToTerms: false
      });
      setSubmitted(false);
    }
    onClose();
  };

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const renderSuccessScreen = () => (
    <>
      <div className="h-[80vh] w-16 text-center py-6">
      <div className="bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted Successfully</h3>
        <p className="text-gray-600 mb-6">St
          Your data request has been submitted and is pending approval. You'll receive a notification once it's reviewed.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200 max-w-md mx-auto">
          <div className="text-sm text-gray-700">
            <div className="font-medium mb-1">Request Reference ID:</div>
            <div className="text-gray-900 font-mono bg-gray-100 py-1 px-2 rounded">{`REQ-${Math.random().toString(36).substring(2, 10).toUpperCase()}`}</div>
          </div>
        </div>
      </div>
      
      <DialogFooter className="bg-gray-50 border-t px-6 py-4">
        <button
          onClick={handleClose}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Return to Marketplace
        </button>
      </DialogFooter>
    </>
  );

  const renderRequestForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Selected Datasets ({selectedDatasets.length})</h3>
          <div className="max-h-40 overflow-y-auto mb-4 border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease Area</th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                  <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost (BMT)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedDatasets.map((dataset) => (
                  <tr key={dataset.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{dataset.dataType.replace('_', ' ')}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{dataset.diseaseType}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-right">{dataset.recordCount.toLocaleString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{dataset.price} BMT</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={2} className="px-4 py-2 text-sm font-medium text-gray-700">Total</td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-700 text-right">{totalRecords.toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm font-medium text-indigo-600 text-right">{totalCost} BMT</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Request Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm focus:outline-none focus:ring-2`}
              placeholder="Enter a descriptive title for your request"
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-1">
              Request Type*
            </label>
            <select
              id="requestType"
              name="requestType"
              value={formData.requestType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="research">Academic Research</option>
              <option value="clinical">Clinical Study</option>
              <option value="commercial">Commercial Use</option>
              <option value="educational">Educational</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              Research Purpose*
            </label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border ${formErrors.purpose ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm focus:outline-none focus:ring-2`}
              placeholder="Describe how you intend to use this data and the goals of your research"
            />
            {formErrors.purpose && (
              <p className="mt-1 text-sm text-red-600">{formErrors.purpose}</p>
            )}
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date*
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={getToday()}
                className={`w-full px-3 py-2 border ${formErrors.startDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm focus:outline-none focus:ring-2`}
              />
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
              )}
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date*
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || getToday()}
                className={`w-full px-3 py-2 border ${formErrors.endDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm focus:outline-none focus:ring-2`}
              />
              {formErrors.endDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
              )}
            </div>
          </div> */}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              
            </div>
          </div>

          <div className={`flex items-start ${formErrors.agreeToTerms ? 'border border-red-300 rounded-md p-2' : ''}`}>
            <div className="flex items-center h-5">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                I agree to the data usage terms and conditions*
              </label>
              <p className="text-gray-500">
                By requesting this data, I agree to use it only for the stated purpose, maintain confidentiality, and comply with all applicable data protection regulations.
              </p>
              {formErrors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">{formErrors.agreeToTerms}</p>
              )}
            </div>
          </div>
        </div>

        {formErrors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{formErrors.submit}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="bg-gray-50 border-t px-6 py-4 space-x-2">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing...
            </>
          ) : (
            <>
              Submit Request <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </button>
      </DialogFooter>
    </form>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-white max-w-3xl p-0 rounded-lg overflow-hidden">
        <DialogHeader className="bg-indigo-600 px-6 py-4">
          <DialogTitle className="text-xl font-semibold text-white flex items-center">
            <ClipboardList className="h-5 w-5 mr-2" />
            {submitted ? 'Request Submitted' : 'Request Dataset Access'}
          </DialogTitle>
        </DialogHeader>

        {submitted ? renderSuccessScreen() : renderRequestForm()}
      </DialogContent>
    </Dialog>
  );
};

export default DataRequestModal;