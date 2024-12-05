import { memo } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';

const GoToLocation = () => {
    const map = useMap();
    const zoom = 20;
    const location = useSelector((state) => state.locationSlice.location);

    if (Object.values(location).length > 0) {
        map.flyTo(location, zoom, { duration: 1 });
    }

    return null;
};

export default memo(GoToLocation);
