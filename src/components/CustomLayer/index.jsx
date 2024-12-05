import React from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CustomTileLayer = ({ urls }) => {
    const map = useMap();

    React.useEffect(() => {
        const layers = urls.map((url) => L.tileLayer(url));
        layers.forEach((layer) => layer.addTo(map));
        return () => layers.forEach((layer) => map.removeLayer(layer));
    }, [map, urls]);

    return null;
};

export default CustomTileLayer;
