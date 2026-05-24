import apiClient from './axios';

export interface Rental {
    rentalId: number;
    userId: number;
    bikeId: number;
    bikeModel: string;
    startStationId: number;
    startStationName: string;
    endStationId: number | null;
    endStationName: string | null;
    startTime: string;
    endTime: string | null;
    durationMinutes: number | null;
    pointsDeducted: number | null;
    status: 'active' | 'completed' | 'cancelled';
}

export interface EndRentalRequest {
    endStationId: number;
    latitude?: number;
    longitude?: number;
}

export interface StartRentalRequest {
    bikeId: number;
    startStationId: number;
    userId?: number;
    latitude?: number;
    longitude?: number;
}

export const getRentalHistory = async (): Promise<Rental[]> => {
    const response = await apiClient.get('/rentals/history');
    return response.data.data;
};

export const getActiveRentals = async (): Promise<Rental[]> => {
    const response = await apiClient.get('/rentals/active');
    return response.data.data;
};

export const startRental = async (data: StartRentalRequest): Promise<Rental> => {
    const response = await apiClient.post('/rentals/start', data);
    return response.data.data;
};

export const endRental = async (rentalId: number, data: EndRentalRequest): Promise<Rental> => {
    const response = await apiClient.post(`/rentals/end/${rentalId}`, data);
    return response.data.data;
};
