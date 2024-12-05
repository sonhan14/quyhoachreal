import { useState, useEffect } from 'react';

function useGetMyLocation() {
    const [location, setLocation] = useState({ lat: null, lng: null });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log(error);
                },
            );
        } else {
            console.log('Không thấy tọa độ người dùng');
        }
    }, []);

    return location;
}

export default useGetMyLocation;
