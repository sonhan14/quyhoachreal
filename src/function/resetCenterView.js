import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
export default function ResetCenterView({ lat, lon, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (lat && lon) {
            map.setView([lat, lon], zoom || map.getZoom(), {
                animate: true,
            });
        }
    }, [lat, lon]);
}
