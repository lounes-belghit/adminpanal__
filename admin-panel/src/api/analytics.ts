import apiClient from './axios';
import { getBikes } from './bikes';
import { getStations } from './stations';
import { getRentalHistory } from './rentals';

export interface DashboardStats {
    activeRentalsCount: number;
    totalUsers: number;
    availableBikesCount: number;
    pointsPurchasedToday?: number;
}

export interface RentalTrend {
    date: string;
    count: number;
}

export interface BikeDistribution {
    name: string;
    value: number;
}

export interface StationAnalytics {
    stationName: string;
    rentals: number;
    returns: number;
}

export const getRentalTrends = async (): Promise<RentalTrend[]> => {
    try {
        const history = await getRentalHistory();
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return last7Days.map(date => ({
            date,
            count: history.filter(r => r.startTime.startsWith(date)).length
        }));
    } catch (error) {
        console.error('Failed to calculate rental trends', error);
        return [];
    }
};

export const getBikeDistribution = async (): Promise<BikeDistribution[]> => {
    try {
        const bikes = await getBikes();
        const stats: Record<string, number> = {
            'Available': 0,
            'Rented': 0,
            'Maintenance': 0
        };

        bikes.forEach(bike => {
            const status = bike.status.charAt(0).toUpperCase() + bike.status.slice(1);
            if (stats[status] !== undefined) {
                stats[status]++;
            }
        });

        return Object.entries(stats).map(([name, value]) => ({ name, value }));
    } catch (error) {
        console.error('Failed to calculate bike distribution', error);
        return [];
    }
};

export const getStationAnalytics = async (): Promise<StationAnalytics[]> => {
    try {
        const [history, stations] = await Promise.all([
            getRentalHistory(),
            getStations()
        ]);

        return stations.map(s => ({
            stationName: s.name,
            rentals: history.filter(r => r.startStationId === s.stationId).length,
            returns: history.filter(r => r.endStationId === s.stationId).length
        }));
    } catch (error) {
        console.error('Failed to calculate station analytics', error);
        return [];
    }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data.data;
};
