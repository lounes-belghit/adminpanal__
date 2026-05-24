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
    Box,
    Alert,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid
} from '@mui/material';
import HandymanIcon from '@mui/icons-material/Handyman';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { getMaintenanceLogs, createMaintenanceLog, MaintenanceLog } from '../../api/maintenance';
import { exportToCSV } from '../../utils/exportUtils';

const MaintenanceLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<MaintenanceLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        bikeId: '',
        maintenanceDate: new Date().toISOString().split('T')[0],
        description: '',
        cost: '',
        performedBy: ''
    });

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await getMaintenanceLogs();
            setLogs(data);
        } catch (err) {
            setError('Failed to fetch maintenance logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSubmit = async () => {
        try {
            await createMaintenanceLog({
                bikeId: parseInt(formData.bikeId),
                maintenanceDate: formData.maintenanceDate,
                description: formData.description,
                cost: parseFloat(formData.cost),
                performedBy: formData.performedBy
            });
            setOpen(false);
            fetchLogs();
        } catch (err) {
            alert('Failed to create log');
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">
                    Maintenance Logs
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => exportToCSV(logs, 'maintenance_logs')}
                        sx={{ mr: 1 }}
                    >
                        Export
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                        Add Log
                    </Button>
                </Box>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Bike ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Cost</TableCell>
                            <TableCell>Performed By</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.maintenanceId}>
                                <TableCell>{log.maintenanceId}</TableCell>
                                <TableCell>{log.bikeId} {log.bikeModel && `(${log.bikeModel})`}</TableCell>
                                <TableCell>{log.maintenanceDate}</TableCell>
                                <TableCell>{log.description}</TableCell>
                                <TableCell>{log.cost.toFixed(2)} DZD</TableCell>
                                <TableCell>{log.performedBy}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Maintenance Record</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="Bike ID" type="number"
                                value={formData.bikeId}
                                onChange={(e) => setFormData({ ...formData, bikeId: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="Date" type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.maintenanceDate}
                                onChange={(e) => setFormData({ ...formData, maintenanceDate: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Description" multiline rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="Cost (DZD)" type="number"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="Performed By"
                                value={formData.performedBy}
                                onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">Save Record</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MaintenanceLogsPage;
