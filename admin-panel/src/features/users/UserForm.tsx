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
    Switch,
    FormControlLabel,
    Box
} from '@mui/material';
import { User } from '../../api/users';

interface UserFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { userType: string; active: boolean }) => void;
    initialData?: User;
}

const UserForm: React.FC<UserFormProps> = ({ open, onClose, onSubmit, initialData }) => {
    const [userType, setUserType] = useState('user');
    const [active, setActive] = useState(true);

    useEffect(() => {
        if (initialData) {
            setUserType(initialData.userType);
            setActive(initialData.active);
        }
    }, [initialData, open]);

    const handleSubmit = () => {
        onSubmit({ userType, active });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{initialData ? 'Edit User' : 'Manage User'}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={userType}
                            label="Role"
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="super_admin">Super Admin</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Account Active"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserForm;
