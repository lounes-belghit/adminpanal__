import apiClient from './axios';

export interface Bike {
    bikeId: number;
    model: string;
    serialNumber: string;
    currentStationId: number;
    stationName?: string;
    latitude: number;
    longitude: number;
    nfcTag: string;
    qrCode: string;
    status: 'available' | 'rented' | 'maintenance' | 'stolen';
    batteryLevel: number;
}

import { getStations } from './stations';

export const getBikes = async (stationId?: number): Promise<Bike[]> => {
    if (stationId) {
        const response = await apiClient.get(`/bikes/available?stationId=${stationId}`);
        return response.data.data;
    }

    // Use admin endpoint for full fleet view as per endpoints_guide.md
    try {
        const response = await apiClient.get('/admin/bikes');
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch bikes fleet', error);
        return [];
    }
};

export const getBike = async (id: number): Promise<Bike> => {
    const response = await apiClient.get(`/bikes/${id}`);
    return response.data.data;
};

export const createBike = async (data: Partial<Bike>): Promise<Bike> => {
    const response = await apiClient.post('/bikes', data);
    return response.data.data;
};

// Note: Backend currently missing PUT and DELETE for bikes as per plan
export const updateBike = async (id: number, data: Partial<Bike>): Promise<Bike> => {
    const response = await apiClient.put(`/bikes/${id}`, data);
    return response.data.data;
};

export const deleteBike = async (id: number): Promise<void> => {
    await apiClient.delete(`/bikes/${id}`);
};
