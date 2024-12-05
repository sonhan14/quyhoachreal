import instance from '../utils/axios-customize';

export const getAllBoundingCenterPlans = async () => {
    try {
        const { data } = await instance.get('/all_quyhoach');
        return data.map((plan) => {
            const boundingBox = plan.boundingbox.replace(/[\[\]]/g, '').split(',');
            const [lonMin, latMin, lonMax, latMax] = boundingBox.map(Number);
            const lat_center = (latMin + latMax) / 2;
            const lon_center = (lonMin + lonMax) / 2;
            return { lat: lat_center, lon: lon_center, description: plan.description };
            // return [lonMin, latMin, lonMax, latMax];
        });
    } catch (error) {
        console.error('Error fetching all quy hoach: ', error);
        return [];
    }
};
