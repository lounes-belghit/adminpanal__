import apiClient from './axios';

export interface User {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    userType: 'user' | 'admin' | 'super_admin';
    // Backend typically exposes `isActive`; we normalize it to `active` in the client
    isActive?: boolean;
    active: boolean;
    lastLogin: string | null;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    const data = response.data.data as any[];

    // Normalize backend shape → always provide a boolean `active` flag
    return data.map((u) => ({
        ...u,
        active: typeof u.active === 'boolean'
            ? u.active
            : Boolean(u.isActive)
    }));
};

export const getUser = async (id: number): Promise<User> => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data.data;
};

export const updateUserRole = async (id: number, userType: string): Promise<User> => {
    const response = await apiClient.put(`/admin/users/${id}/role`, { userType });
    return response.data.data;
};

export const updateUserStatus = async (id: number, active: boolean): Promise<User> => {
    const response = await apiClient.put(`/admin/users/${id}/status`, { active });
    return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
};
