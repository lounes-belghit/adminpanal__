import apiClient from './axios';

export interface Station {
    stationId: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    capacity: number;
    availableBikes: number;
}

export const getStations = async (): Promise<Station[]> => {
    try {
        const response = await apiClient.get('/stations');
        const stations: Station[] = response.data.data;

        // Populate real available bikes count for each station
        const stationWithBikesPromises = stations.map(async (station) => {
            try {
                const bikesResponse = await apiClient.get(`/bikes/available?stationId=${station.stationId}`);
                const bikes = bikesResponse.data.data || [];
                // Only count bikes that are actually 'available'
                const availableCount = bikes.filter((b: any) => b.status === 'available').length;
                return { ...station, availableBikes: availableCount };
            } catch (error) {
                console.error(`Failed to fetch bikes for station ${station.stationId}`, error);
                return station;
            }
        });

        return await Promise.all(stationWithBikesPromises);
    } catch (error) {
        console.error('Failed to fetch stations', error);
        return [];
    }
};

export const getStation = async (id: number): Promise<Station> => {
    const response = await apiClient.get(`/stations/${id}`);
    return response.data.data;
};

export const createStation = async (data: Partial<Station>): Promise<Station> => {
    const response = await apiClient.post('/stations', data);
    return response.data.data;
};

// Note: Backend currently missing PUT and DELETE for stations as per plan
export const updateStation = async (id: number, data: Partial<Station>): Promise<Station> => {
    const response = await apiClient.put(`/stations/${id}`, data);
    return response.data.data;
};

export const deleteStation = async (id: number): Promise<void> => {
    await apiClient.delete(`/stations/${id}`);
};
