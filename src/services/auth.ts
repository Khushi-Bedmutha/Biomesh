import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  institutionName: string;
  institutionType: 'hospital' | 'clinic' | 'research_center' | 'university' | 'pharma_company' | 'other';
  email: string;
  password: string;
  registrationNumber: string;
  contacts: {
    name: string;
    position: string;
    email: string;
    phone: string;
  }[];
}


export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  console.log("me: ", response.data)
  return response.data;
};