import axios from 'axios';
import { fetchDistrictsByProvinces, fetchProvinces } from '../services/api';
import { API_KEYS_MAP, BASE_URL_API_MAP } from '../configs/apiKeyMap';
import { getRandomIntegerBelow } from '../utils/getRandomIntegerBelow';

const fetchProvinceName = async (lat, lon) => {
    // console.log("Latitude",lat);
    // console.log("Longitude",lon);
    try {
        if (lat && lon) {
            const response = await axios.get(BASE_URL_API_MAP + '/geocode/reverse', {
                params: {
                    apiKey: API_KEYS_MAP[getRandomIntegerBelow(API_KEYS_MAP.length)],
                    lat,
                    lon,
                    type: 'city',
                },
            });

            const address = response.data.features[0]?.properties;
            let provinceName = address.state || address.province || address.city;
            let districtName =
                address.county ||
                address.district ||
                address.city_district ||
                address.suburb ||
                address.town ||
                address.village ||
                address.formatted.split(',')[0];

            if (districtName) {
                districtName = districtName?.replace(/district/i, '').trim();
            }

            if (provinceName) {
                provinceName = provinceName?.replace(/province/i, '').trim();
            }
            return { provinceName, districtName } || 'Unknown';
        }
    } catch (error) {
        console.error('Error fetching province name:', error);
        return 'Unknown';
    }
};

export const getProvince = async (provinceName) => {
    const provincesList = await fetchProvinces();
    const province = provincesList.find(
        (province) => province.TenTinhThanhPho?.toLowerCase() === provinceName?.toLowerCase(),
    );
    return province || null;
};

export const getDistrict = async (provinceId) => {
    const districtsList = await fetchDistrictsByProvinces(provinceId);
    return districtsList || null;
};

export default fetchProvinceName;
