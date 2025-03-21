export interface Transaction {
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
  }
  
  // types.ts
export interface DataRequest {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'revoked' | 'expired';
  date: string;
  providerId?: string;
  requestType?: 'research' | 'clinical_trial' | 'analysis' | 'other';
  dataTypes?: string[];
  purpose?: string;
  startDate?: string;
  endDate?: string;
  terms?: string;
  blockchainVerification?: {
    transactionHash: string;
    timestamp: string;
  };
}
  
  export interface Dataset {
    id: string;
    title: string;
    type: 'dataset' | 'ai_insight';
    icon: string;
    description: string;
    price: number;
  }