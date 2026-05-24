import { useEffect, useState } from 'react';
import { socketService } from '../api/socket';

export const useSocket = (event: string) => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const handler = (newData: any) => {
            setData(newData);
        };

        socketService.on(event, handler);

        return () => {
            socketService.off(event, handler);
        };
    }, [event]);

    return data;
};
