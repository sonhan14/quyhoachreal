import axios from 'axios';

export const getPolygonsByNames = async (names) => {
    const promises = names.map((name, i) => {
        if (i === 1) {
            return null;
        }
        return axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                city: name.TenTinhThanhPho,
                format: 'json',
                polygon_geojson: 1,
            },
        });
    });

    const res = await Promise.all(promises);
    console.log(res, 'res');
    console.log('object');
};
