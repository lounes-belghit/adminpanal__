// Maintenance API shell - Backend implementation pending
import apiClient from './axios';

export interface MaintenanceLog {
    maintenanceId: number;
    bikeId: number;
    bikeModel?: string;
    maintenanceDate: string;
    description: string;
    cost: number;
    performedBy: string;
}

export interface CreateMaintenanceRequest {
    bikeId: number;
    maintenanceDate: string;
    description: string;
    cost: number;
    performedBy: string;
}

// Mock data for initial UI development
const mockLogs: MaintenanceLog[] = [
    {
        maintenanceId: 1,
        bikeId: 10,
        bikeModel: 'City Pro X1',
        maintenanceDate: '2026-03-10',
        description: 'Brake pad replacement and chain lubrication',
        cost: 15.5,
        performedBy: 'John Doe'
    },
    {
        maintenanceId: 2,
        bikeId: 5,
        bikeModel: 'Mountain Trek',
        maintenanceDate: '2026-03-08',
        description: 'Tire pressure check and gear adjustment',
        cost: 5.0,
        performedBy: 'Jane Smith'
    }
];

export const getMaintenanceLogs = async (): Promise<MaintenanceLog[]> => {
    // return apiClient.get('/maintenance/logs').then(res => res.data.data);
    console.warn('Using mock data for maintenance logs');
    return Promise.resolve(mockLogs);
};

export const createMaintenanceLog = async (data: CreateMaintenanceRequest): Promise<MaintenanceLog> => {
    // return apiClient.post('/maintenance/logs', data).then(res => res.data.data);
    console.warn('Simulating maintenance log creation');
    const newLog: MaintenanceLog = {
        ...data,
        maintenanceId: Math.floor(Math.random() * 1000)
    };
    return Promise.resolve(newLog);
};
