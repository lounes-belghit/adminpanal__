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
    Box,
    IconButton,
    Chip,
    CircularProgress,
    FormControlLabel,
    Switch
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getUsers, User, updateUserRole, updateUserStatus } from '../../api/users';
import UserForm from './UserForm';
import { useAuth } from '../../hooks/useAuth';

const UserListPage: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>();
    const [showOnlyActive, setShowOnlyActive] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setFormOpen(true);
    };

    const handleFormSubmit = async (data: { userType: string; active: boolean }) => {
        if (!selectedUser) return;

        try {
            // Only update if changed
            if (data.userType !== selectedUser.userType) {
                await updateUserRole(selectedUser.userId, data.userType);
            }
            if (data.active !== selectedUser.active) {
                await updateUserStatus(selectedUser.userId, data.active);
            }
            setFormOpen(false);
            fetchUsers();
        } catch (error) {
            alert('Failed to update user');
        }
    };

    const getRoleChipColor = (role: string) => {
        switch (role) {
            case 'super_admin': return 'error';
            case 'admin': return 'primary';
            default: return 'default';
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

    const displayedUsers = showOnlyActive ? users.filter(u => u.active) : users;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>User Management</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showOnlyActive}
                            onChange={(e) => setShowOnlyActive(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Show only active users"
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedUsers.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.firstName} {user.lastName}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.userType.toUpperCase()}
                                        size="small"
                                        color={getRoleChipColor(user.userType)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.active ? 'ACTIVE' : 'INACTIVE'}
                                        size="small"
                                        variant="outlined"
                                        color={user.active ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(user)}
                                        disabled={currentUser?.role !== 'super_admin' && user.userType === 'super_admin'}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <UserForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedUser}
            />
        </Box>
    );
};

export default UserListPage;
