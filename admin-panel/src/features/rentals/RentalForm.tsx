import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Alert
} from '@mui/material';
import { getBikes, Bike } from '../../api/bikes';
import { getStations, Station } from '../../api/stations';
import { startRental } from '../../api/rentals';
import { getUsers, User } from '../../api/users';

interface RentalFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const RentalForm: React.FC<RentalFormProps> = ({ open, onClose, onSuccess }) => {
    const [bikes, setBikes] = useState<Bike[]>([]);
    const [stations, setStations] = useState<Station[]>([]);
    const [selectedBikeId, setSelectedBikeId] = useState<number | ''>('');
    const [selectedStationId, setSelectedStationId] = useState<number | ''>('');
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            getBikes().then(b => setBikes(b.filter(bike => bike.status === 'available')));
            getStations().then(setStations);
            // Load only active users (normalized in api/users.ts)
            getUsers().then(u => setUsers(u.filter(user => user.active)));
            setSelectedBikeId('');
            setSelectedStationId('');
            setSelectedUserId('');
            setError(null);
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!selectedBikeId || !selectedStationId || !selectedUserId) {
            setError('Please select a user, a bike and a station.');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await startRental({
                bikeId: selectedBikeId as number,
                startStationId: selectedStationId as number,
                userId: selectedUserId as number
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            const message = err?.response?.data?.error?.message || 'Failed to start rental. Check bike availability and admin points balance.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Start New Rental</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Alert severity="info">
                        Select the <strong>user</strong>, <strong>bike</strong> and <strong>start station</strong> for this rental.
                    </Alert>

                    {error && <Alert severity="error">{error}</Alert>}

                    <FormControl fullWidth>
                        <InputLabel>User</InputLabel>
                        <Select
                            value={selectedUserId}
                            label="User"
                            onChange={(e) => setSelectedUserId(e.target.value as number)}
                        >
                            {users.length === 0 ? (
                                <MenuItem disabled>No users found</MenuItem>
                            ) : (
                                users.map(user => (
                                    <MenuItem key={user.userId} value={user.userId}>
                                        {user.firstName} {user.lastName} (ID: {user.userId})
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Available Bike</InputLabel>
                        <Select
                            value={selectedBikeId}
                            label="Available Bike"
                            onChange={(e) => setSelectedBikeId(e.target.value as number)}
                        >
                            {bikes.map(bike => (
                                <MenuItem key={bike.bikeId} value={bike.bikeId}>
                                    #{bike.bikeId} — {bike.model} (S/N: {bike.serialNumber})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Start Station</InputLabel>
                        <Select
                            value={selectedStationId}
                            label="Start Station"
                            onChange={(e) => setSelectedStationId(e.target.value as number)}
                        >
                            {stations.map(station => (
                                <MenuItem key={station.stationId} value={station.stationId}>
                                    {station.name} — {station.address}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
                    {loading ? 'Starting...' : 'Start Rental'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RentalForm;
