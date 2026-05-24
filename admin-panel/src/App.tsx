import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography as MuiTypography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AccessDenied from './features/auth/AccessDenied';
import StationListPage from './features/stations/StationListPage';
import BikeListPage from './features/bikes/BikeListPage';
import FleetMapView from './components/maps/FleetMapView';
import ActiveRentalsPage from './features/rentals/ActiveRentalsPage';
import RentalHistoryPage from './features/rentals/RentalHistoryPage';
import MaintenanceLogsPage from './features/maintenance/MaintenanceLogsPage';
import AuditLogsPage from './features/auditLogs/AuditLogsPage';
import AnalyticsPage from './features/analytics/AnalyticsPage';
import LoginPage from './features/auth/LoginPage';
import UserListPage from './features/users/UserListPage';
import { useSocket } from './hooks/useSocket';
import { useAuth } from './hooks/useAuth';
import { Snackbar, Alert } from '@mui/material';

// Mock/Placeholder components for routes
const Dashboard = () => <div>Dashboard Content (Admin/Super Admin)</div>;

import { ThemeContextProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [notification, setNotification] = React.useState<{ message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);

    const socketNotification = useSocket('NOTIFICATION');

    React.useEffect(() => {
        if (socketNotification) {
            setNotification({
                message: socketNotification.message,
                type: socketNotification.type || 'info'
            });
        }
    }, [socketNotification]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Router>
            <CssBaseline />
            {user && (
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <MuiTypography variant="h6" noWrap component="div">
                            BykerAntel Admin
                        </MuiTypography>
                    </Toolbar>
                </AppBar>
            )}
            <Box sx={{ display: 'flex' }}>
                {user && <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />}
                <Box component="main" sx={{
                    flexGrow: 1,
                    p: user ? { xs: 2, sm: 3 } : 0,
                    mt: user ? 8 : 0,
                    width: user ? { sm: `calc(100% - 240px)` } : '100%'
                }}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/access-denied" element={<AccessDenied />} />

                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <AnalyticsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute>
                                    <AnalyticsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/bikes"
                            element={
                                <ProtectedRoute>
                                    <BikeListPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/stations"
                            element={
                                <ProtectedRoute>
                                    <StationListPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/map"
                            element={
                                <ProtectedRoute>
                                    <FleetMapView />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/rentals/active"
                            element={
                                <ProtectedRoute>
                                    <ActiveRentalsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/rentals/history"
                            element={
                                <ProtectedRoute>
                                    <RentalHistoryPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/maintenance"
                            element={
                                <ProtectedRoute>
                                    <MaintenanceLogsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/audit-logs"
                            element={
                                <ProtectedRoute>
                                    <AuditLogsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute>
                                    <UserListPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin-management"
                            element={
                                <ProtectedRoute requiredRole="super_admin">
                                    <UserListPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Box>
            </Box>

            <Snackbar
                open={!!notification}
                autoHideDuration={6000}
                onClose={() => setNotification(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setNotification(null)} severity={notification?.type || 'info'} sx={{ width: '100%' }}>
                    {notification?.message}
                </Alert>
            </Snackbar>
        </Router>
    );
};

const App: React.FC = () => {
    return (
        <ThemeContextProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeContextProvider>
    );
};

export default App;
