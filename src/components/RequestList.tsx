import React, { useState } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { DataRequest } from "../types";
import DataRequestModal from "./DataRequestModal";
import { useNavigate } from "react-router-dom";

const requests: DataRequest[] = [
  {
    id: "1",
    title: "Brain MRI Data",
    status: "pending",
    date: "2024-03-15",
    requestType: "research",
    dataTypes: ["MRI Scans", "Patient Demographics"],
    purpose: "Investigating correlation between brain structure and early-onset dementia",
    startDate: "2024-04-01",
    endDate: "2024-10-01",
    providerId: "60d21b4667d0d8992e610c85",
  },
  {
    id: "2",
    title: "Alzheimer's Study",
    status: "approved",
    date: "2024-03-14",
    requestType: "clinical_trial",
    dataTypes: ["Cognitive Assessments", "Medication History"],
    purpose: "Phase 2 clinical trial for experimental Alzheimer's treatment",
    startDate: "2024-03-20",
    endDate: "2025-03-20",
    providerId: "60d21b4667d0d8992e610c86",
  },
  {
    id: "3",
    title: "Wearable Heart Data",
    status: "rejected",
    date: "2024-03-13",
    requestType: "analysis",
    dataTypes: ["ECG Readings", "Activity Metrics"],
    purpose: "Analyzing patterns in heart rate variability among athletes",
    startDate: "2024-03-15",
    endDate: "2024-06-15",
    providerId: "60d21b4667d0d8992e610c87",
  },
];

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

const statusColors = {
  pending: "text-yellow-600",
  approved: "text-green-600",
  rejected: "text-red-600",
};

export default function RequestList() {
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpenModal = (request: DataRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleStatusChange = async (
    requestId: string,
    status: "approved" | "rejected",
    reason?: string
  ) => {
    console.log(
      `Changing request ${requestId} status to ${status}${reason ? ` with reason: ${reason}` : ""}`
    );
    // API call can go here
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Data Requests</h2>

      <div className="space-y-3">
        {requests.map((request) => {
          const StatusIcon = statusIcons[request.status as keyof typeof statusIcons];
          const statusColor = statusColors[request.status as keyof typeof statusColors];

          return (
            <div
              key={request.id}
              onClick={() => handleOpenModal(request)}
              className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-colors border-white-200 dark:border-gray-700 hover:bg-white-50 dark:hover:bg-white-700`}
            >
              <div className="flex items-center gap-3">
                <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                <span className="font-medium">{request.title}</span>
              </div>
              <span className="text-sm text-gray-500">{request.date}</span>
            </div>
          );
        })}
        <div className="flex flex-col items-center">
          <button
            onClick={() => navigate("/manage-requests")}
            className="m-4 bg-blue-600 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200 ease-in-out"
          >
            Manage Requests
          </button>
        </div>

      </div>

      <DataRequestModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
