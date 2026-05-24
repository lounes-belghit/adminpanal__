import axios from './axios';

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        refreshToken: string;
    };
}

export interface UserProfileResponse {
    success: boolean;
    message: string;
    data: {
        userId: number;
        name: string;
        email: string;
        phone: string;
        pointBalance: number;
        isVerified: boolean;
        registrationDate: string;
        isActive: boolean;
        userType: 'user' | 'admin' | 'super_admin';
    };
}

export const loginRequest = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
};

export const logoutRequest = async (): Promise<void> => {
    await axios.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
};

export const refreshTokenRequest = async (refreshToken: string): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>('/auth/refresh-token', { refreshToken });
    return response.data;
};

export const getMeRequest = async (): Promise<UserProfileResponse> => {
    const response = await axios.get<UserProfileResponse>('/auth/me');
    return response.data;
};
