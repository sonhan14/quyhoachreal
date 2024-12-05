import React, { memo } from 'react';
import { Tooltip as LTooltip, Marker, Popup } from 'react-leaflet';
import { icons } from '../../../assets';
import L from 'leaflet';


const redMarkerIcon = new L.Icon({
    iconUrl: icons.redMarker,
    iconSize: [24, 24],
    iconAnchor: [22, 38],
    popupAnchor: [-10, -50],
});
const MarkerItem = ({ item }) => {
    const location = item.location.split(',');
    return (
        <Marker
            position={location}
            icon={redMarkerIcon}
            eventHandlers={{
                click: (e) => e.target.openPopup(),
                // mouseover: (e) => e.target.openPopup(),
                // mouseout: (e) => e.target.closePopup(),
            }}
        >
            <LTooltip
                permanent
                direction="top"
                offset={[-10, -30]}
                opacity={1}
                className="no-background-tooltip no-arrow-bg"
            >
                {item.description}
            </LTooltip>
            <Popup>
                <div
                    style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                    }}
                >
                    <img src={item.imageHttp} alt="" style={{ width: '100%', height: 'auto' }} />
                </div>
            </Popup>
        </Marker>
    );
};

export default memo(MarkerItem);
