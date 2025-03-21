export interface Transaction {
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    date: string;
  }
  
  export interface DataRequest {
    id: string;
    title: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
  }
  
  export interface Dataset {
    id: string;
    title: string;
    type: 'dataset' | 'ai_insight';
    icon: string;
    description: string;
    price: number;
  }