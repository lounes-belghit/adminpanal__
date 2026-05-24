// Audit Logs API shell - Backend implementation pending
import apiClient from './axios';

export interface AuditLog {
    logId: number;
    tableName: string;
    recordId: number;
    action: string;
    changedByUserId: number | null;
    changeTime: string;
    oldValue: string | null;
    newValue: string | null;
    userName?: string; // Optinally joined
}

// Mock data for initial UI development
const mockLogs: AuditLog[] = [
    {
        logId: 101,
        tableName: 'Bikes',
        recordId: 1,
        action: 'UPDATE',
        changedByUserId: 1,
        changeTime: '2026-03-12T10:30:00',
        oldValue: 'status: available',
        newValue: 'status: maintenance',
        userName: 'Admin User'
    },
    {
        logId: 102,
        tableName: 'Stations',
        recordId: 5,
        action: 'INSERT',
        changedByUserId: 1,
        changeTime: '2026-03-12T09:15:00',
        oldValue: null,
        newValue: 'Name: North Plaza Station',
        userName: 'Admin User'
    }
];

export const getAuditLogs = async (): Promise<AuditLog[]> => {
    const response = await apiClient.get('/admin/audit-logs');
    return response.data.data;
};
