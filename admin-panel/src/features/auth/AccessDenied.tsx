import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const AccessDenied: React.FC = () => {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2
                }}
            >
                <LockIcon sx={{ fontSize: 64, color: 'error.main' }} />
                <Typography variant="h4" component="h1" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1">
                    You do not have the necessary permissions to access this page.
                    Please contact a super admin if you believe this is an error.
                </Typography>
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Back to Dashboard
                </Button>
            </Box>
        </Container>
    );
};

export default AccessDenied;
