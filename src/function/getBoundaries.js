import axios from 'axios';
import { API_KEYS_MAP } from '../configs/apiKeyMap';
import { getRandomIntegerBelow } from '../utils/getRandomIntegerBelow';
import * as turf from '@turf/turf';

export const getBoundaries = async (ids) => {
    const boundaryPromises = ids.map((id, i) => {
        return axios.get('https://api.geoapify.com/v1/boundaries/part-of', {
            params: {
                id: id,
                apiKey: API_KEYS_MAP[getRandomIntegerBelow(API_KEYS_MAP.length)],
                geometry: 'geometry_1000',
            },
        });
    });
    const boundaryPromises2 = ids.map((id, i) => {
        return axios.get('https://api.geoapify.com/v1/boundaries/consists-of', {
            params: {
                id: id,
                apiKey: API_KEYS_MAP[getRandomIntegerBelow(API_KEYS_MAP.length)],
                geometry: 'geometry_1000',
            },
        });
    });

    const boundaries = await Promise.all(boundaryPromises.filter((promise) => promise !== null));
    const boundaries2 = await Promise.all(boundaryPromises2.filter((promise) => promise !== null));
    let ok = boundaries.map((response) => {
        return response.data.features
            .map((feature) => {
                if (feature.geometry.type === 'Polygon') {
                    return turf.polygon([feature.geometry.coordinates[0]]);
                }
                // if (feature.geometry.type === 'MultiPolygon') {
                //     return turf.multiPolygon(feature.geometry.coordinates);
                // }
                return null;
            })
            .filter((coordinates) => coordinates !== null);
    });
    let ok2 = boundaries2.map((response) => {
        return response.data.features
            .map((feature) => {
                if (feature.geometry.type === 'Polygon') {
                    return turf.polygon([feature.geometry.coordinates[0]], {
                        name: feature.properties.city || feature.properties.state,
                    });
                }
                // if (feature.geometry.type === 'MultiPolygon') {
                //     return turf.multiPolygon(feature.geometry.coordinates);
                // }
                return null;
            })
            .filter((coordinates) => coordinates !== null);
    });
    ok = ok.filter((item) => item.length > 0);
    ok2 = ok2.filter((item) => item.length > 0);
    const dataSources = [...ok.flat(), ...ok2.flat()];

    // try {
    //     console.log(dataSources, 'dataSources');

    //     const result = [];
    //     let i = 0;
    //     let count = 0;

    //     console.log(dataSources, 'initial dataSources');

    //     while (i < dataSources.length) {
    //         console.log(`Outer loop - i: ${i}, dataSources.length: ${dataSources.length}`);
    //         let isMerging = false;

    //         for (let j = i + 1; j < dataSources.length; j++) {
    //             console.log(`Inner loop - i: ${i}, j: ${j}`);
    //             count++;
    //             try {
    //                 if (
    //                     dataSources[i] &&
    //                     dataSources[j] &&
    //                     (dataSources[i].geometry.type === 'Polygon' ||
    //                         dataSources[i].geometry.type === 'MultiPolygon') &&
    //                     (dataSources[j].geometry.type === 'Polygon' || dataSources[j].geometry.type === 'MultiPolygon')
    //                 ) {
    //                     const intersect = turf.intersect(dataSources[i], dataSources[j]);
    //                     console.log(intersect, `turf.intersect result between dataSources[${i}] and dataSources[${j}]`);

    //                     if (intersect) {
    //                         const merged = turf.union(dataSources[i], dataSources[j]);
    //                         console.log(merged, 'merged');

    //                         dataSources[i] = merged;
    //                         dataSources.splice(j, 1);
    //                         isMerging = true;
    //                         console.log(`Merged and removed j: ${j}, new dataSources length: ${dataSources.length}`);
    //                         break;
    //                     }
    //                 }
    //             } catch (error) {
    //                 console.error(`Error intersecting dataSources[${i}] and dataSources[${j}]:`, error);
    //             }
    //         }

    //         if (!isMerging) {
    //             console.log(`Pushing dataSources[${i}] to result`, dataSources[i]);
    //             result.push(dataSources[i]);
    //             i++;
    //         }
    //         if (count === 10000) {
    //             break;
    //         }
    //     }

    //     console.log(result, 'final result');
    //     console.log('End of script');
    //     return result;
    // } catch (error) {
    //     console.log(error, '12345678');
    // }
    return dataSources;
};
