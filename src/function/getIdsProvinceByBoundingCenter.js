import axios from 'axios';
import { API_KEYS_MAP, BASE_URL_API_MAP } from '../configs/apiKeyMap';
import { getRandomIntegerBelow } from '../utils/getRandomIntegerBelow';

export const getIdsProvinceByBoundingCenter = async (dataSearch) => {
    const provinceNames = dataSearch.map((item) => item.TenTinhThanhPho);
    const promises = dataSearch.map((item) =>
        axios.get(BASE_URL_API_MAP + '/geocode/search', {
            params: {
                apiKey: API_KEYS_MAP[getRandomIntegerBelow(API_KEYS_MAP.length)],
                country: 'Vietnam',
                city: item.TenTinhThanhPho,
            },
        }),
    );

    const responses = await Promise.all(promises.flat());
    const ok = await Promise.all(promises);
    console.log(ok, 'ok');
    console.log(responses, 'responses');
    const result = responses
        .map((response) => {
            const items = response.data.features;
            const dataSources = [];

            if (items.length > 0) {
                const data = items
                    .map((item) => {
                        const isVietnam =
                            item.properties.country === 'Vietnam' || item.properties.country_code === 'vn';
                        const isMatch = provinceNames.some((name) => {
                            return (
                                item.properties.state?.includes(name) ||
                                item.properties.city?.includes(name) ||
                                item.properties.formatted?.includes(name) ||
                                item.properties.address_line1?.includes(name) ||
                                item.properties.address_line2?.includes(name)
                            );
                        });

                        if (isVietnam && isMatch) {
                            return item.properties.place_id;
                        } else {
                            return null;
                        }
                    })
                    .filter((item) => item !== null);
                dataSources.push(...data);
            }
            return dataSources;
        })
        .filter((item) => item.length > 0);
    console.log(result, 'data');
    return result.flat();
};
