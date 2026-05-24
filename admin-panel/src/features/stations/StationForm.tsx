import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box
} from '@mui/material';
import { Station } from '../../api/stations';

interface StationFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Station>) => void;
    initialData?: Station;
}

const StationForm: React.FC<StationFormProps> = ({ open, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = React.useState<Partial<Station>>(initialData || {});

    React.useEffect(() => {
        setFormData(initialData || {});
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
            <DialogTitle>{initialData ? 'Edit Station' : 'Add New Station'}</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Station Name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address || ''}
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Capacity"
                                name="capacity"
                                type="number"
                                value={formData.capacity || ''}
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

export default StationForm;
