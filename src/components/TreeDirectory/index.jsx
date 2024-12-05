import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Tree } from 'antd';
import Search from 'antd/es/input/Search';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import removeAccents from 'remove-accents';
import { useDebounce } from 'use-debounce';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import fetchProvinceName from '../../function/findProvince';
import { getTreePlans, searchTreePlans, setExpandedKeys, setTreeCheckedKey } from '../../redux/apiCache/treePlans';
import { setPlanByProvince, setPlansInfo } from '../../redux/plansSelected/plansSelected';
import { setCurrentLocation } from '../../redux/search/searchSlice';
import { fetchAllQuyHoach, getAllPlansDetails } from '../../services/api';

const TreeDirectory = ({ doRefreshTreeData, isRefreshTreeData }) => {
    const treePlans = useSelector((state) => state.treePlans);
    const quyHoachIdsStored = useSelector((state) => state.plansSelected.quyhoach);
    const [searchTerm, setSearchTerm] = useState();
    const dispatch = useDispatch();
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTreeData = useSelector((state) => state.treePlans.searchTreeData);
    const treeCheckedKeys = useSelector((state) => state.treePlans.treeCheckedKeys);
    const currentLocationIndex = 1;
    // const planningDataIndex = 1;
    // const totalMajorCities = 63;

    const onCheck = useCallback(
        async (checkedKeysValue, info) => {
            try {
                let minLon = 0;
                let minLat = 0;
                let maxLon = 0;
                let maxLat = 0;
                let center = [];
                let checkedKeys = [];
                let provineId = 0;
                const currentNode = info.node;
                console.log(checkedKeysValue);
                console.log(currentNode);
                const currentPovincdeIdChecked = Number(currentNode.key.split('-')?.[currentLocationIndex]);

                let province = [];
                const allPlans = await fetchAllQuyHoach();
                // console.log(allPlans);

                // in 63 major cities
                // const mainProvince = currentPovincdeIdChecked <= totalMajorCities;

                if (!Array.isArray(checkedKeysValue)) return;
                const plansParams = [];
                const quyhoachIds = checkedKeysValue
                    .filter((key) => key?.startsWith('plan-'))
                    .map((key) => {
                        const item = key?.split('-');
                        // console.log('item', item);
                        plansParams.push([item[1], item[2]].join('-'));
                        return item[1];
                    })
                    .filter((id) => id != null);

                // console.log(plansParams);

                const districtIds = checkedKeysValue
                    .filter((key) => key?.startsWith('district-'))
                    .map((key) => key?.split('-')[1])
                    .filter((id) => id != null);

                // console.log('DisttricIds', districtIds);
                // console.log('QuyhoachIds', quyhoachIds);
                // console.log('Plan', plansParams);

                // if (currentNode) {
                const map = {};
                const memory = [];
                allPlans
                    .filter((item) => quyhoachIds?.toString().includes(item.id?.toString()))
                    .forEach((element) => {
                        const key = `${element.idDistrict}-${element.idProvince}`;
                        map[key] = (map[key] || 0) + 1;
                    });
                const plansFiltered = allPlans
                    .filter((item) => quyhoachIds.includes(item.id?.toString()))
                    .filter((item) => {
                        const key = `${item.idDistrict}-${item.idProvince}`;
                        const hasManyPlan = map[key] > 1;
                        const is2030 = item.description.toLowerCase().includes('2030');
                        const isNotInMemory = !memory.includes(key);
                        if (hasManyPlan && is2030) {
                            return true;
                        } else if (isNotInMemory) {
                            memory.push(key);
                            return true;
                        }
                        return false;
                    })
                    .map((item) => item);

                if (currentNode.key.includes('province') && !currentNode.checked) {
                    provineId = currentPovincdeIdChecked;
                    searchParams.delete('quyhoach');
                    setSearchParams(searchParams);
                    const [, provineResponse] = await getAllPlansDetails();
                    provineResponse.some((item) => {
                        if (item.id_tinh === provineId) {
                            if (!item.link_image) {
                                console.log('Không có ảnh tỉnh');
                            }
                            province = [item];
                            return true;
                        }
                        return false;
                    });
                }
                // else {
                //     searchParams.delete('plans-by-province');
                //     setSearchParams(searchParams);
                // }

                checkedKeys = plansFiltered;

                //  Just test calculcate location
                if (provineId) {

                    const allProvinceNow = plansFiltered
                        .filter((item) => {
                            return item.idProvince === provineId;
                        })
                        .map((item) => {
                            if (!item.location) {
                                return item.boundingbox?.replace(/[\[\]]/g, '').split(',');
                            } else {
                                return item.location?.replace(/[\[\]]/g, '').split(',');
                            }
                        });
                    const everage = allProvinceNow.length * 2;
                    allProvinceNow.forEach((item) => {
                        minLon += Number(item[0]);
                        minLat += Number(item[1]);
                        maxLon += Number(item[2]);
                        maxLat += Number(item[3]);
                    });
                    const centerLon = (minLon + maxLon) / everage;
                    const centerLat = (minLat + maxLat) / everage;

                    center = [centerLon, centerLat];
                } else if (currentNode.key.includes('district')) {

                    const currentDistrict = Number(currentNode.key.split('-')[currentLocationIndex]);
                    const districtPlansFilltered = plansFiltered
                        .filter((item) => currentDistrict === item.idDistrict)
                        .map((item) => {
                            if (!item.location) {
                                return item.boundingbox?.replace(/[\[\]]/g, '').split(',');
                            } else {
                                return item.location?.replace(/[\[\]]/g, '').split(',');
                            }
                        });
                    const everage = districtPlansFilltered.length * 2;
                    districtPlansFilltered.forEach((item) => {
                        minLon += Number(item[0]);
                        minLat += Number(item[1]);
                        maxLon += Number(item[2]);
                        maxLat += Number(item[3]);
                    });
                    const centerLon = (minLon + maxLon) / everage;
                    const centerLat = (minLat + maxLat) / everage;
                    center = [centerLon, centerLat];
                } else {
                    const currentPlan = Number(currentNode.key.split('-')[currentLocationIndex]);
                    const currentPlansFilltered = plansFiltered
                        .filter((item) => currentPlan === item.id)
                        .map((item) => {
                            if (!item.location) {
                                return item.boundingbox?.replace(/[\[\]]/g, '').split(',');
                            } else {
                                return item.location?.replace(/[\[\]]/g, '').split(',');
                            }
                        });
                    const everage = currentPlansFilltered.length * 2;
                    currentPlansFilltered.forEach((item) => {
                        minLon += Number(item[0]);
                        minLat += Number(item[1]);
                        maxLon += Number(item[2]);
                        maxLat += Number(item[3]);
                    });
                    const centerLon = (minLon + maxLon) / everage;
                    const centerLat = (minLat + maxLat) / everage;

                    center = [centerLon, centerLat];
                }
                const locationInfo = await fetchProvinceName(center[1], center[0]);
                dispatch(
                    setCurrentLocation({
                        lat: center[1],
                        lon: center[0],
                        provinceName: locationInfo?.provinceName,
                        districtName: locationInfo?.districtName,
                    }),
                );

                // check if exist major province id
                // console.log('province id', currentPovincdeIdChecked);
                if (provineId) {
                    searchParams.set('plans-by-province', provineId);
                    setSearchParams(searchParams);
                    dispatch(setPlanByProvince(province));
                } else {
                    dispatch(setPlansInfo(plansFiltered));
                    searchParams.delete('quyhoach');
                    searchParams.set('quyhoach', plansParams.join(','));
                    setSearchParams(searchParams);
                }
                // } else {
                //     searchParams.delete('quyhoach');
                //     setSearchParams(searchParams);
                //     dispatch(setPlansInfo([]));
                // }
                console.log('end');
                dispatch(setTreeCheckedKey(checkedKeys.map((item) => ({ id: item.id, idProvince: item.idProvince }))));
            } catch (error) {
                console.log(error);
            }
        },
        [dispatch, searchParams, setSearchParams],
    );

    const handleSearchTree = useCallback((debouncedSearchTerm) => {
        if (!debouncedSearchTerm) {
            return dispatch(searchTreePlans({ newTree: [], expandedKeys: [], autoExpandParent: false }));
        }
        const data = filterTreeData(debouncedSearchTerm);
        dispatch(searchTreePlans(data));
        setLoadingSearch(false);
    }, []);

    const filterTreeData = (searchTerm) => {
        const normalizedTerm = removeAccents(searchTerm?.toLowerCase());
        const expandedKeysSet = new Set();

        const filterNodes = (nodes, parentMatched = false) => {
            return nodes.reduce((acc, node) => {
                const nodeMatch = removeAccents(node.title?.toLowerCase())?.includes(normalizedTerm);
                const filteredChildren = node.children ? filterNodes(node.children, nodeMatch || parentMatched) : [];

                if (nodeMatch || filteredChildren.length > 0 || parentMatched) {
                    if (nodeMatch || parentMatched) {
                        expandedKeysSet.add(node.key);
                    }
                    return [
                        ...acc,
                        {
                            ...node,
                            children: filteredChildren,
                        },
                    ];
                }
                return acc;
            }, []);
        };

        const filteredData = filterNodes(treePlans.treeOriginal);

        return { newTree: filteredData, expandedKeys: Array.from(expandedKeysSet), autoExpandParent: true };
    };

    const onExpand = (expandedKeysValue) => {
        dispatch(setExpandedKeys(expandedKeysValue));
    };
    useEffect(() => {
        dispatch(getTreePlans());
    }, []);

    useEffect(() => {
        handleSearchTree(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return (
        <>
            <Search
                loading={loadingSearch}
                placeholder="Search provinces or districts"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setLoadingSearch(true);
                }}
                style={{ marginBottom: 8 }}
            />
            {treePlans.status === THUNK_API_STATUS.PENDING && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
                </div>
            )}
            {treePlans.treeOriginal.length > 0 && treePlans.status === THUNK_API_STATUS.SUCCESS ? (
                <Tree
                    showLine
                    treeData={searchTreeData.length > 0 ? searchTreeData : treePlans.treeOriginal}
                    checkable
                    checkedKeys={treeCheckedKeys?.map((item) => {
                        if (item.isProvince) {
                            return `province-${item.idProvince}`;
                        }
                        return `plan-${item.id}-${item.idProvince}`;
                    })}
                    onCheck={onCheck}
                    expandedKeys={treePlans.expandedKeys}
                    autoExpandParent={treePlans.autoExpandParent}
                    onExpand={onExpand}
                />
            ) : (
                <p className="text-center">Dữ liệu đang cập nhật!</p>
            )}
        </>
    );
};

export default memo(TreeDirectory);
