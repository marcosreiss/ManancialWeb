import React from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

export interface MapViewerProps {
    center: { lat: number; lng: number };
    markers?: { lat: number; lng: number }[];
    polylinePath?: { lat: number; lng: number }[];
    zoom?: number;
    mapContainerStyle?: React.CSSProperties;
}

const defaultContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '300px',
};

const MapViewer: React.FC<MapViewerProps> = ({
    center,
    markers,
    polylinePath,
    zoom = 14,
    mapContainerStyle = defaultContainerStyle,
}) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
            >
                {markers?.map((pos, idx) => (
                    <Marker key={idx} position={pos} />
                ))}
                {polylinePath && <Polyline path={polylinePath} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapViewer;
