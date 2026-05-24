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
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getStations, Station, createStation, updateStation, deleteStation } from '../../api/stations';
import StationForm from './StationForm';

const StationListPage: React.FC = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedStation, setSelectedStation] = useState<Station | undefined>();

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            const data = await getStations();
            setStations(data);
        } catch (error) {
            console.error('Failed to fetch stations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedStation(undefined);
        setFormOpen(true);
    };

    const handleEdit = (station: Station) => {
        setSelectedStation(station);
        setFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this station?')) {
            try {
                await deleteStation(id);
                fetchStations();
            } catch (error) {
                alert('Failed to delete station');
            }
        }
    };

    const handleFormSubmit = async (data: Partial<Station>) => {
        try {
            if (selectedStation) {
                await updateStation(selectedStation.stationId, data);
            } else {
                await createStation(data);
            }
            setFormOpen(false);
            fetchStations();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to save station';
            alert(message);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Station Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
                    Add Station
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Capacity</TableCell>
                            <TableCell>Available Bikes</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stations.map((station) => (
                            <TableRow key={station.stationId}>
                                <TableCell>{station.stationId}</TableCell>
                                <TableCell>{station.name}</TableCell>
                                <TableCell>{station.address}</TableCell>
                                <TableCell>{station.capacity}</TableCell>
                                <TableCell>{station.availableBikes}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleEdit(station)}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(station.stationId)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {stations.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No stations found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <StationForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedStation}
            />
        </Box>
    );
};

export default StationListPage;
