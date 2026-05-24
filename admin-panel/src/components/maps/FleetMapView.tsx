import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Paper } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { getStations, Station } from '../../api/stations';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const FleetMapView: React.FC = () => {
    const [stations, setStations] = useState<Station[]>([]);

    useEffect(() => {
        getStations().then(setStations).catch(console.error);
    }, []);

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', p: 1 }}>
            <Typography variant="h4" gutterBottom>Fleet Map</Typography>
            <Paper sx={{ height: '100%', overflow: 'hidden' }}>
                <MapContainer center={[36.7538, 3.0588]} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {stations.map((station) => (
                        <Marker key={station.stationId} position={[station.latitude, station.longitude]}>
                            <Popup>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{station.name}</Typography>
                                <Typography variant="body2">{station.address}</Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" display="block">
                                        Available Bikes: <strong>{station.availableBikes}</strong> / {station.capacity}
                                    </Typography>
                                </Box>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </Paper>
        </Box>
    );
};

export default FleetMapView;
