import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

const useUpdateMapCenter = (locationLink) => {
    const map = useMap();
    const previousVitriRef = useRef();

    useEffect(() => {
        const searchParams = new URLSearchParams(locationLink.search);
        const vitri = searchParams.get('vitri')?.split(',').map(Number);

        if (vitri) {
            // Only update the map center if vitri has changed
            const previousVitri = previousVitriRef.current;
            if (!previousVitri || previousVitri[0] !== vitri[0] || previousVitri[1] !== vitri[1]) {
                map.setView([vitri[0], vitri[1]]);
                previousVitriRef.current = vitri;
            }
        }
    }, [locationLink.search, map]);
};

export default useUpdateMapCenter;
