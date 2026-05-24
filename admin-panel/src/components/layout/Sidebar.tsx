import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    Switch,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HandymanIcon from '@mui/icons-material/Handyman';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../contexts/ThemeContext';

const drawerWidth = 240;

interface SidebarProps {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
    const { isAdmin, isSuperAdmin } = useAuth();
    const { mode, toggleTheme } = useAppTheme();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const drawerContent = (
        <Box sx={{ overflow: 'auto', mt: isMobile ? 0 : 8 }}>
            <List>
                <ListItem button component={Link} to="/analytics" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><BarChartIcon /></ListItemIcon>
                    <ListItemText primary="Analytics" />
                </ListItem>

                <ListItem button component={Link} to="/" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>

                <ListItem button component={Link} to="/bikes" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><DirectionsBikeIcon /></ListItemIcon>
                    <ListItemText primary="Bikes Fleet" />
                </ListItem>

                <ListItem button component={Link} to="/stations" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><MapIcon /></ListItemIcon>
                    <ListItemText primary="Stations" />
                </ListItem>

                <ListItem button component={Link} to="/map" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><MapIcon /></ListItemIcon>
                    <ListItemText primary="Fleet Map" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>Operations</Typography>

                <ListItem button component={Link} to="/rentals/active" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
                    <ListItemText primary="Active Rentals" />
                </ListItem>

                <ListItem button component={Link} to="/rentals/history" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><HistoryIcon /></ListItemIcon>
                    <ListItemText primary="Rental History" />
                </ListItem>

                <ListItem button component={Link} to="/maintenance" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><HandymanIcon /></ListItemIcon>
                    <ListItemText primary="Maintenance" />
                </ListItem>

                <ListItem button component={Link} to="/audit-logs" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><AssessmentIcon /></ListItemIcon>
                    <ListItemText primary="Audit Logs" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button component={Link} to="/users" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary="User Management" />
                </ListItem>

                {isSuperAdmin() && (
                    <ListItem button component={Link} to="/admin-management" sx={{ color: 'primary.main' }} onClick={isMobile ? handleDrawerToggle : undefined}>
                        <ListItemIcon><AdminPanelSettingsIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Admin Management" />
                    </ListItem>
                )}

                <ListItem button component={Link} to="/settings" onClick={isMobile ? handleDrawerToggle : undefined}>
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItem>
            </List>
            <Divider />
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {mode === 'dark' ? <DarkModeIcon fontSize="small" sx={{ mr: 1 }} /> : <LightModeIcon fontSize="small" sx={{ mr: 1 }} />}
                    <Typography variant="body2">Dark Mode</Typography>
                </Box>
                <Switch checked={mode === 'dark'} onChange={toggleTheme} size="small" />
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>
            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
