import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    Box
} from '@mui/material';
import { Bike } from '../../api/bikes';

interface BikeFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Bike>) => void;
    initialData?: Bike;
}

const BikeForm: React.FC<BikeFormProps> = ({ open, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = React.useState<Partial<Bike>>(initialData || {
        status: 'available',
        batteryLevel: 100
    });

    React.useEffect(() => {
        setFormData(initialData || { status: 'available', batteryLevel: 100 });
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        // BigDecimal often safer as string in JSON to avoid precision issues
        const finalValue = (name === 'latitude' || name === 'longitude') 
            ? (value === '' ? null : value)
            : (type === 'number' ? (value === '' ? null : Number(value)) : value);
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Edit Bike' : 'Add New Bike'}</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Model"
                                name="model"
                                value={formData.model || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Serial Number"
                                name="serialNumber"
                                value={formData.serialNumber || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Current Station ID"
                                name="currentStationId"
                                type="number"
                                value={formData.currentStationId || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={formData.status || 'available'}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="available">Available</MenuItem>
                                <MenuItem value="rented">Rented</MenuItem>
                                <MenuItem value="maintenance">Maintenance</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Battery Level (%)"
                                name="batteryLevel"
                                type="number"
                                value={formData.batteryLevel || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="NFC Tag"
                                name="nfcTag"
                                value={formData.nfcTag || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="QR Code"
                                name="qrCode"
                                value={formData.qrCode || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Latitude"
                                name="latitude"
                                type="number"
                                value={formData.latitude || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Longitude"
                                name="longitude"
                                type="number"
                                value={formData.longitude || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {initialData ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BikeForm;
