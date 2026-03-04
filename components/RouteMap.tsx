import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom Icons
const farmIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png', // Tractor/Farm icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2764/2764448.png', // Truck icon
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
});

const destIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3712/3712214.png', // Market/Destination icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

interface RouteMapProps {
    originCoords: [number, number];
    destCoords: [number, number];
    originName: string;
    destName: string;
    driverName?: string;
}

// Component to dynamically set map bounds
function SetBounds({ origin, dest }: { origin: [number, number], dest: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        const bounds = L.latLngBounds([origin, dest]);
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [map, origin, dest]);
    return null;
}

export const RouteMap: React.FC<RouteMapProps> = ({
    originCoords,
    destCoords,
    originName,
    destName,
    driverName = "Transporter"
}) => {
    const [truckPos, setTruckPos] = useState<[number, number]>(originCoords);
    const [progress, setProgress] = useState(0);

    // Animation Loop
    useEffect(() => {
        let animationFrameId: number;
        // Speed: 0.001 roughly represents how fast it moves per frame
        const speed = 0.002;

        const animate = () => {
            setProgress((prev) => {
                let next = prev + speed;
                if (next >= 1) {
                    next = 0; // Restart loop for endless demo effect
                }
                return next;
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Calculate current truck position based on progress
    useEffect(() => {
        const lat = originCoords[0] + (destCoords[0] - originCoords[0]) * progress;
        const lng = originCoords[1] + (destCoords[1] - originCoords[1]) * progress;
        setTruckPos([lat, lng]);
    }, [progress, originCoords, destCoords]);

    const polylineCoords: [number, number][] = [originCoords, destCoords];

    return (
        <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden shadow-inner border border-slate-200 z-0 relative">
            <MapContainer
                center={originCoords}
                zoom={6}
                scrollWheelZoom={false}
                className="h-full w-full z-0"
                style={{ background: '#f8fafc' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <SetBounds origin={originCoords} dest={destCoords} />

                {/* Route Line */}
                <Polyline
                    positions={polylineCoords}
                    color="#0ea5e9" // sky-500
                    weight={4}
                    opacity={0.6}
                    dashArray="10, 10"
                />

                {/* Origin Marker */}
                <Marker position={originCoords} icon={farmIcon}>
                    <Popup>
                        <div className="font-bold text-sm">Pickup:</div>
                        <div className="text-slate-600">{originName}</div>
                    </Popup>
                </Marker>

                {/* Destination Marker */}
                <Marker position={destCoords} icon={destIcon}>
                    <Popup>
                        <div className="font-bold text-sm">Drop-off:</div>
                        <div className="text-slate-600">{destName}</div>
                    </Popup>
                </Marker>

                {/* Moving Truck Marker */}
                <Marker position={truckPos} icon={truckIcon} zIndexOffset={1000}>
                    <Popup>
                        <div className="font-bold text-sm">{driverName}</div>
                        <div className="text-green-600 text-xs font-semibold">Active Transit</div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};
