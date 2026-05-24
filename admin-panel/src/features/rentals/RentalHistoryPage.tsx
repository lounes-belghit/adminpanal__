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
    Chip,
    Box,
    Alert,
    CircularProgress,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { getRentalHistory, Rental } from '../../api/rentals';
import { exportToCSV } from '../../utils/exportUtils';

const RentalHistoryPage: React.FC = () => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                setLoading(true);
                const data = await getRentalHistory();
                setRentals(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch rental history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, []);

    const filteredRentals = rentals.filter(r => {
        const matchesSearch = r.bikeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.rentalId.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

        let matchesDate = true;
        if (startDate || endDate) {
            const rentalDate = new Date(r.startTime).toISOString().split('T')[0];
            if (startDate && rentalDate < startDate) matchesDate = false;
            if (endDate && rentalDate > endDate) matchesDate = false;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'active': return <Chip label="Active" color="success" size="small" />;
            case 'completed': return <Chip label="Completed" color="info" size="small" />;
            case 'cancelled': return <Chip label="Cancelled" color="error" size="small" />;
            default: return <Chip label={status} size="small" />;
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">
                    Rental History
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => exportToCSV(filteredRentals, 'rental_history')}
                >
                    Export
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Search by ID or Bike Model"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as string)}
                                label="Status"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            fullWidth
                            label="End Date"
                            type="date"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button fullWidth variant="text" onClick={handleClearFilters}>
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Bike</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Duration (min)</TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Points</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRentals.map((rental) => (
                            <TableRow key={rental.rentalId}>
                                <TableCell>{rental.rentalId}</TableCell>
                                <TableCell>{rental.bikeModel}</TableCell>
                                <TableCell>{new Date(rental.startTime).toLocaleString()}</TableCell>
                                <TableCell>{rental.endTime ? new Date(rental.endTime).toLocaleString() : '-'}</TableCell>
                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{rental.durationMinutes ?? '-'}</TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{rental.pointsDeducted ?? '-'}</TableCell>
                                <TableCell>{getStatusChip(rental.status)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default RentalHistoryPage;
