import React, { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Box,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import AddIcon from '@mui/icons-material/Add';
import { getActiveRentals, endRental, Rental } from '../../api/rentals';
import RentalForm from './RentalForm';

const ActiveRentalsPage: React.FC = () => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmEnd, setConfirmEnd] = useState<number | null>(null);
    const [rentalFormOpen, setRentalFormOpen] = useState(false);

    const fetchRentals = async () => {
        try {
            setLoading(true);
            const data = await getActiveRentals();
            setRentals(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch active rentals');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, []);

    const handleEndRental = async (rentalId: number) => {
        try {
            await endRental(rentalId, { endStationId: 1 });
            setConfirmEnd(null);
            fetchRentals();
        } catch (err) {
            alert('Failed to end rental');
            console.error(err);
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Active Rentals</Typography>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => setRentalFormOpen(true)}
                >
                    Start Rental
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!error && rentals.length === 0 ? (
                <Alert severity="info">No active rentals at the moment.</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Bike</TableCell>
                                <TableCell>Start Station</TableCell>
                                <TableCell>Start Time</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rentals.map((rental) => (
                                <TableRow key={rental.rentalId}>
                                    <TableCell>{rental.rentalId}</TableCell>
                                    <TableCell>{rental.userId}</TableCell>
                                    <TableCell>{rental.bikeModel} (#{rental.bikeId})</TableCell>
                                    <TableCell>{rental.startStationName}</TableCell>
                                    <TableCell>{new Date(rental.startTime).toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <Chip label="Active" color="success" size="small" sx={{ mr: 1 }} />
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<StopIcon />}
                                            onClick={() => setConfirmEnd(rental.rentalId)}
                                        >
                                            End
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <RentalForm
                open={rentalFormOpen}
                onClose={() => setRentalFormOpen(false)}
                onSuccess={fetchRentals}
            />

            <Dialog open={!!confirmEnd} onClose={() => setConfirmEnd(null)}>
                <DialogTitle>End Rental Exceptionally?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Force ending rental #{confirmEnd}. This will return the bike to the default administrative station (ID: 1).
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmEnd(null)}>Cancel</Button>
                    <Button onClick={() => confirmEnd && handleEndRental(confirmEnd)} color="error" autoFocus>
                        Confirm End
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ActiveRentalsPage;
