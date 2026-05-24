import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Box,
    IconButton,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { getBikes, Bike, createBike, updateBike, deleteBike } from '../../api/bikes';
import BikeForm from './BikeForm';
import { exportToCSV } from '../../utils/exportUtils';

const BikeListPage: React.FC = () => {
    const [bikes, setBikes] = useState<Bike[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedBike, setSelectedBike] = useState<Bike | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchBikes();
    }, []);

    const filteredBikes = bikes.filter(bike => {
        const matchesSearch = bike.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bike.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || bike.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const fetchBikes = async () => {
        try {
            const data = await getBikes();
            setBikes(data);
        } catch (error) {
            console.error('Failed to fetch bikes', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedBike(undefined);
        setFormOpen(true);
    };

    const handleEdit = (bike: Bike) => {
        setSelectedBike(bike);
        setFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this bike?')) {
            try {
                await deleteBike(id);
                fetchBikes();
            } catch (error) {
                alert('Failed to delete bike');
            }
        }
    };

    const handleFormSubmit = async (data: Partial<Bike>) => {
        try {
            if (selectedBike) {
                await updateBike(selectedBike.bikeId, data);
            } else {
                await createBike(data);
            }
            setFormOpen(false);
            fetchBikes();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to save bike';
            alert(message);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'success';
            case 'rented': return 'primary';
            case 'maintenance': return 'warning';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Bike Fleet Management</Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => exportToCSV(bikes, 'bike_fleet')}
                        sx={{ mr: 1 }}
                    >
                        Export
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                        Add Bike
                    </Button>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    label="Search Model or Serial"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as string)}
                        label="Status"
                    >
                        <MenuItem value="all">All Statuses</MenuItem>
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="rented">Rented</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Serial Number</TableCell>
                            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Current Station</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Battery</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBikes.map((bike) => (
                            <TableRow key={bike.bikeId}>
                                <TableCell>{bike.bikeId}</TableCell>
                                <TableCell>{bike.model}</TableCell>
                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{bike.serialNumber}</TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{bike.stationName || bike.currentStationId}</TableCell>
                                <TableCell>
                                    <Chip label={bike.status} color={getStatusColor(bike.status) as any} size="small" />
                                </TableCell>
                                <TableCell>{bike.batteryLevel}%</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleEdit(bike)}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(bike.bikeId)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredBikes.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No bikes found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <BikeForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedBike}
            />
        </Box>
    );
};

export default BikeListPage;
