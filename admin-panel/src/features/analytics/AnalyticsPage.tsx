import React, { useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    useTheme
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import {
    getRentalTrends,
    getBikeDistribution,
    getStationAnalytics,
    getDashboardStats,
    RentalTrend,
    BikeDistribution,
    StationAnalytics,
    DashboardStats
} from '../../api/analytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsPage: React.FC = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [trends, setTrends] = useState<RentalTrend[]>([]);
    const [distribution, setDistribution] = useState<BikeDistribution[]>([]);
    const [stations, setStations] = useState<StationAnalytics[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [trendData, distData, stationData, dashboardStats] = await Promise.all([
                    getRentalTrends(),
                    getBikeDistribution(),
                    getStationAnalytics(),
                    getDashboardStats()
                ]);
                setTrends(trendData);
                setDistribution(distData);
                setStations(stationData);
                setStats(dashboardStats);
            } catch (error) {
                console.error('Failed to fetch analytics data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                System Analytics
            </Typography>

            <Grid container spacing={3}>
                {/* Summary Metrics */}
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Active Rentals</Typography>
                            <Typography variant="h3">{stats?.activeRentalsCount ?? '...'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Users</Typography>
                            <Typography variant="h3">{stats?.totalUsers ?? '...'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Available Bikes</Typography>
                            <Typography variant="h3">{stats?.availableBikesCount ?? '...'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Today's Revenue (Pts)</Typography>
                            <Typography variant="h3">{stats?.pointsPurchasedToday ?? 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Rental Trends Line Chart */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Rental Trends (Last 7 Days)</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                                <YAxis stroke={theme.palette.text.secondary} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}
                                />
                                <Line type="monotone" dataKey="count" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Bike Distribution Pie Chart */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Fleet Status</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie
                                    data={distribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Station Performance Bar Chart */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>Station Activity</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={stations}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                <XAxis dataKey="stationName" stroke={theme.palette.text.secondary} />
                                <YAxis stroke={theme.palette.text.secondary} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}
                                />
                                <Legend />
                                <Bar dataKey="rentals" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="returns" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsPage;
