import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../ui/dialog';

import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  FileText, 
  Briefcase, 
  Tag as TagIcon,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { DataRequest } from "../types";

interface DataRequestModalProps {
  request: DataRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (requestId: string, status: "approved" | "rejected", reason?: string) => void;
}

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  revoked: Clock,
  expired: Clock
};

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  revoked: "bg-purple-100 text-purple-800 border-purple-300",
  expired: "bg-gray-100 text-gray-800 border-gray-300"
};

export const DataRequestModal: React.FC<DataRequestModalProps> = ({
  request,
  isOpen,
  onClose,
  onStatusChange
}) => {
  const [rejectReason, setRejectReason] = useState("");
  const [isConfirmingAction, setIsConfirmingAction] = useState<"approve" | "reject" | null>(null);

  if (!request) return null;

  const StatusIcon = statusIcons[request.status as keyof typeof statusIcons] || Clock;
  const statusStyle = statusStyles[request.status as keyof typeof statusStyles] || "";

  const handleApprove = () => {
    onStatusChange(request.id, "approved");
    setIsConfirmingAction(null);
    onClose();
  };

  const handleReject = () => {
    onStatusChange(request.id, "rejected", rejectReason);
    setRejectReason("");
    setIsConfirmingAction(null);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="bg-white max-w-xl rounded-lg shadow-xl p-0 overflow-hidden">
        <div className="bg-gray-50 border-b px-6 py-4">
          <DialogHeader>
            <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
              <DialogTitle className="text-xl font-semibold text-gray-900">{request.title}</DialogTitle>
              <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${statusStyle}`}>
                <StatusIcon className="w-4 h-4 mr-1.5" />
                <span className="capitalize">{request.status}</span>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Requested On</p>
                <p className="text-sm text-gray-600">{formatDate(request.date)}</p>
              </div>
            </div>

            {request.requestType && (
              <div className="flex items-start space-x-3">
                <TagIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Request Type</p>
                  <p className="text-sm text-gray-600 capitalize">{request.requestType}</p>
                </div>
              </div>
            )}
            
            {request.startDate && request.endDate && (
              <div className="flex items-start space-x-3 col-span-full">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Time Period</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(request.startDate)} — {formatDate(request.endDate)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {request.purpose && (
            <div className="pt-2">
              <div className="flex items-center mb-2">
                <Briefcase className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Purpose</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">{request.purpose}</p>
              </div>
            </div>
          )}

          {request.dataTypes?.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center mb-2">
                <FileText className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Data Types</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {request.dataTypes.map((type, index) => (
                  <span key={index} className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-full border border-blue-200">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isConfirmingAction === "reject" && (
            <div className="mt-4 border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start mb-3">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                <h3 className="font-medium text-red-800">Reason for rejection</h3>
              </div>
              <textarea
                placeholder="Provide details about why this request is being rejected..."
                className="w-full p-3 border border-red-200 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end mt-3 space-x-2">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={() => setIsConfirmingAction(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}

          {isConfirmingAction === "approve" && (
            <div className="mt-4 border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">Confirm Approval</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    You're about to approve this data request, which will grant access to the requested data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={() => setIsConfirmingAction(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleApprove}
                >
                  Confirm Approval
                </button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-gray-50 border-t px-6 py-4 flex justify-end space-x-2">
          {request.status === "pending" && !isConfirmingAction ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                onClick={() => setIsConfirmingAction("reject")}
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                Reject
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                onClick={() => setIsConfirmingAction("approve")}
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Approve
              </button>
            </>
          ) : !isConfirmingAction ? (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-offset-2 focus:ring-gray-500"
            >
              Close
            </button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataRequestModal;