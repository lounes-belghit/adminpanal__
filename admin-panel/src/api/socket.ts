/**
 * Simple WebSocket Simulation Service
 * In a real application, this would connect to a Socket.io or native WebSocket server.
 */

type Listener = (data: any) => void;

class SocketService {
    private listeners: { [event: string]: Listener[] } = {};

    constructor() {
        // Start simulation loop
        this.startSimulation();
    }

    on(event: string, callback: Listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: Listener) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(l => l !== callback);
    }

    private emit(event: string, data: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(l => l(data));
        }
    }

    private startSimulation() {
        // Simulate random bike status updates
        setInterval(() => {
            const bikeIds = [1, 2, 3, 4, 10, 25];
            const statuses = ['available', 'rented', 'maintenance'];
            const randomBike = bikeIds[Math.floor(Math.random() * bikeIds.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            this.emit('BIKE_STATUS_UPDATE', {
                bikeId: randomBike,
                status: randomStatus,
                timestamp: new Date().toISOString()
            });
        }, 15000); // Every 15 seconds

        // Simulate notification events
        setInterval(() => {
            this.emit('NOTIFICATION', {
                type: 'info',
                message: `New rental started for Bike #${Math.floor(Math.random() * 50) + 1}`,
                timestamp: new Date().toISOString()
            });
        }, 45000); // Every 45 seconds
    }
}

export const socketService = new SocketService();
