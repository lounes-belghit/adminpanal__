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
    Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { getAuditLogs, AuditLog } from '../../api/auditLogs';

const AuditLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const data = await getAuditLogs();
                setLogs(data);
            } catch (err) {
                setError('Failed to fetch audit logs');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                System Audit Logs
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Table</TableCell>
                            <TableCell>Record ID</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Changes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.logId}>
                                <TableCell>{log.logId}</TableCell>
                                <TableCell>{log.tableName}</TableCell>
                                <TableCell>{log.recordId}</TableCell>
                                <TableCell>
                                    <Box sx={{
                                        fontWeight: 'bold',
                                        color: log.action === 'DELETE' ? 'error.main' : (log.action === 'INSERT' ? 'success.main' : 'primary.main')
                                    }}>
                                        {log.action}
                                    </Box>
                                </TableCell>
                                <TableCell>{log.userName || log.changedByUserId || 'System'}</TableCell>
                                <TableCell>{new Date(log.changeTime).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Tooltip title={
                                        <Box>
                                            <Typography variant="caption" display="block">Old: {log.oldValue || 'N/A'}</Typography>
                                            <Typography variant="caption" display="block">New: {log.newValue || 'N/A'}</Typography>
                                        </Box>
                                    }>
                                        <InfoIcon color="action" cursor="help" />
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AuditLogsPage;
