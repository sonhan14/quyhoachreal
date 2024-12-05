import { message, notification, Radio } from 'antd';
import L from 'leaflet';
import { debounce } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { FaMapMarkedAlt, FaShareAlt } from 'react-icons/fa';
import { LayersControl, MapContainer, Marker, Pane, Popup, TileLayer, useMapEvents, ZoomControl } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import fetchProvinceName from '../../function/findProvince';
import { formatToVND } from '../../function/formatToVND';
import ResetCenterView from '../../function/resetCenterView';
import useMapParams from '../../hooks/useMapParams';
import useWindowSize from '../../hooks/useWindowSise';
import { selectFilteredMarkers } from '../../redux/filter/filterSelector';
import { setListMarker } from '../../redux/listMarker/listMarkerSllice';
import { setPlanByProvince, setPlansInfo } from '../../redux/plansSelected/plansSelected';
import { setCurrentLocation } from '../../redux/search/searchSlice';
import {
    fetchAllQuyHoach,
    fetchListInfo,
    fetQuyHoachByIdDistrict,
    getAllPlansDetailsByProvineId,
    searchLocation,
} from '../../services/api';
import DrawerView from '../Home/DrawerView';
// import useGetParams from '../Hooks/useGetParams';
import { CloseOutlined, EnvironmentOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Drawer, Tooltip } from 'antd';
import _ from 'lodash';
import { mapImages } from '../../assets/mapImage';
import handleGetLocation from '../../function/handleGetLocation';
import handleShareLocation from '../../function/handleShareLocation';
import { setTreeCheckedKey } from '../../redux/apiCache/treePlans';
import { getBoudingboxData } from '../../redux/boundingMarkerBoxSlice/boundingMarkerBoxSlice';
import GoToLocation from '../_common/GoToLocation';
import MarkerItem from '../ImagesListBoundingbox/_components/MarkerItem';
import ImageList from '../ImagesListBoundingbox/ImagesList';
import UserLocationMarker from '../UserLocationMarker';

const customIcon = new L.Icon({
    iconUrl: require('../../assets/marker.png'),
    iconSize: [38, 38],
    iconAnchor: [22, 38],
    popupAnchor: [-3, -38],
});

const Map = ({ opacity, mapRef, setSelectedPosition, setIdDistrict, idDistrict }) => {
    const [isOverview, setIsOverview] = useState(false);
    const [listenDblClick, setListenDblClick] = useState(false);
    const [idProvince, setIdProvince] = useState();
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    // const searchParams = useGetParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const locationLink = useLocation();
    const dispatch = useDispatch();
    const listMarker = useSelector(selectFilteredMarkers);
    const currentLocation = useSelector((state) => state.searchQuery.searchResult);
    const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolderNoti] = notification.useNotification();
    const plansStored = useSelector((state) => state.plansSelected.quyhoach);
    const quyhoachByProvince = useSelector((state) => state.plansSelected.quyhoachByProvince);
    const boundingboxDataLocation = useSelector((state) => state.boudingboxSlice.boudingboxData);
    const boudingboxImagesList = boundingboxDataLocation.list_image;
    const treeCheckedKeys = useSelector((state) => state.treePlans.treeCheckedKeys);
    const { initialCenter, initialZoom } = useMapParams();
    const windowSize = useWindowSize();
    const [searchPara, setSearchPara] = useSearchParams();
    const closeDrawer = () => setIsDrawerVisible(false);
    const [isLocationInfoOpen, setIsLocationInfoOpen] = useState(false);
    const [pressTimer, setPressTimer] = useState(0);
    const [isLongClick, setIsLongClick] = useState(false);
    const [location, setLocation] = useState([]);
    const [mapZoom, setMapZoom] = useState(13);
    const [isShowImagesList, setShowImagesList] = useState(false);
    const [isShowBtnOpen, setIsShowBtnOpen] = useState(false);

    const onCloseLocationInfo = () => {
        setIsLocationInfoOpen(false);
    };

    const onOpenLocationInfo = () => {
        setIsLocationInfoOpen(true);
    };

    const handleShareLocationNow = () => {
        handleShareLocation(location, mapZoom, messageApi);
    };

    const handleShareLogoLocation = () => {
        handleGetLocation(location, messageApi);
    };

    const onCloseImageList = () => {
        setShowImagesList(false);
    };

    const onOpenImageList = () => {
        setShowImagesList(true);
    };
    const onCloseBtnImageList = () => {
        setIsShowBtnOpen(false);
    };

    const onOpenBtnImageList = () => {
        setIsShowBtnOpen(true);
    };

    const handleGetImagesListDistricts = async (_southWest, _northEast) => {
        if (isShowImagesList) {
            dispatch(getBoudingboxData({ southWest: _southWest, northEast: _northEast }));
        }
        // onOpenImageList();
    };

    const debouncedHandleInput = _.debounce(handleGetImagesListDistricts, 1000);

    const MapEvents = () => {
        const map = useMapEvents({
            moveend: async (e) => {
                const map = e.target;
                const center = map.getCenter();
                const zoom = map.getZoom();
                const { _northEast, _southWest } = map.getBounds();
                // [_northEast, _southWest]
                const searchParams = new URLSearchParams(locationLink.search);
                searchParams.set('vitri', `${center.lat},${center.lng}`);
                searchParams.set('zoom', `${zoom}`);
                const info = await fetchProvinceName(center.lat, center.lng);

                const newUrl = `${locationLink.pathname}?${searchParams.toString()}`;
                window.history.replaceState({}, '', newUrl);

                if (zoom >= 8) {
                    try {
                        const res = await searchLocation(info?.districtName);
                        res ? setIdProvince(res.idDistrict) : setIdDistrict(null);
                    } catch (error) {
                        setIdDistrict(null);
                    }
                }
                if (zoom >= 15) {
                    debouncedHandleInput(_southWest, _northEast);
                    if (!isShowBtnOpen && isShowImagesList) {
                        setShowImagesList(true);
                    } else if (!isShowBtnOpen) {
                        setIsShowBtnOpen(true);
                    }
                } else {
                    if (isShowBtnOpen) {
                        setIsShowBtnOpen(false);
                    }
                    if (isShowImagesList) {
                        setShowImagesList(false);
                    }
                }
            },
            dblclick: debounce(
                async (e) => {
                    const { lat, lng } = e?.latlng;
                    // const isPlansByProvince = searchParams.get('plans-by-province');

                    // if (isPlansByProvince) {
                    // }

                    map.setView([lat, lng]);
                    setSelectedPosition({ lat, lng });

                    try {
                        // Call API province
                        const info = await fetchProvinceName(lat, lng);
                        // Update position info
                        dispatch(
                            setCurrentLocation({
                                lat,
                                lon: lng,
                                provinceName: info.provinceName,
                                districtName: info.districtName,
                            }),
                        );
                        // Call API district
                        const res = await searchLocation(info?.districtName);
                        res ? setIdDistrict(res.idDistrict) : setIdDistrict(null);
                        setListenDblClick(Math.random());
                    } catch (error) {
                        setIdDistrict(null);
                    }
                },
                500,
                { leading: false, trailing: true },
            ),
            zoomend: async () => {
                const zoom = map.getZoom();
                if (zoom < 10) {
                    setIsOverview(true);
                } else {
                    setIsOverview(false);
                }
                setMapZoom(zoom);
            },
            mousedown() {
                if (!isLocationInfoOpen) {
                    const timer = setTimeout(() => {
                        setIsLongClick(true);
                    }, 1000);
                    setPressTimer(timer);
                }
            },
            mouseup(event) {
                if (!isLongClick && isLocationInfoOpen) return;
                const { lat, lng } = event.latlng;
                if (!isLongClick) {
                    clearTimeout(pressTimer);
                } else {
                    setLocation([lat, lng]);
                    onOpenLocationInfo();
                    setIsLongClick(false);
                }
            },
            mousemove() {
                if (isLongClick && pressTimer) {
                    setIsLongClick(false);
                    clearTimeout(pressTimer);
                }
            },
        });
        map.doubleClickZoom.disable();

        return null;
    };

    const handleShareClick = (lat, lng) => {
        const urlParams = new URLSearchParams(locationLink.search);

        urlParams.set('vitri', `${lat},${lng}`);

        const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;

        navigator.clipboard
            .writeText(newUrl)
            .then(() => {
                messageApi.open({
                    type: 'success',
                    content: 'Đã sao chép vào bộ nhớ',
                });
            })
            .catch(() => {
                messageApi.open({
                    type: 'error',
                    content: 'Lỗi khi sao chép vào bộ nhớ',
                });
            });
    };
    const openNotification = (pauseOnHover) => (data, plans) => {
        api.open({
            message: 'Khu vực này có nhiều quy hoạch, vui lòng chọn quy hoạch để xem!',
            description: (
                <Radio.Group
                    onChange={(e) => {
                        const target = plans.map((item) => item).filter((item) => item.id == e.target.value);
                        dispatch(setPlansInfo(target));
                        searchPara.set('quyhoach', `${e.target.value}-${target[0].idProvince}`);
                        setSearchPara(searchPara);
                        api.destroy();
                    }}
                    value={data[0].id}
                >
                    {data.map((plan) => (
                        <Radio key={plan.id} value={plan.id}>
                            {plan.description}
                        </Radio>
                    ))}
                </Radio.Group>
            ),
            showProgress: true,
            pauseOnHover,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetQuyHoachByIdDistrict(idDistrict);
                const plans = await fetchAllQuyHoach();
                if (data && data.length > 0 && data[0]?.huyen_image !== '') {
                    if (data.length > 1) {
                        openNotification(true)(data, plans);
                        dispatch(setPlansInfo(plans.filter((item) => item.id === data[0].id)));
                        searchPara.set('quyhoach', `${data[0].id}-${data[0].idProvince}`);
                        setSearchPara(searchPara);
                    } else {
                        dispatch(setPlansInfo(plans.filter((item) => item.id === data[0].id)));
                        searchPara.set('quyhoach', `${data[0].id}-${data[0].idProvince}`);
                        setSearchPara(searchPara);
                    }
                } else {
                    if (idDistrict && listenDblClick) {
                        messageApi.info('Không tìm thấy quy hoạch cho khu vực này');
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [listenDblClick]);

    useEffect(() => {
        (async () => {
            try {
                const vitri = searchParams.get('vitri') ? searchParams.get('vitri').split(',') : null;
                const LatitudeUrlIndex = 1;
                const LongitudeUrlIndex = 0;
                const quyhoachIds = searchParams.get('quyhoach');
                const quyhoachProvinceId = searchParams.get('plans-by-province');
                const province = {};
                let minLon = 0;
                let minLat = 0;
                let maxLon = 0;
                let maxLat = 0;
                const center = [];
                const childrenBoudingBoxData = [];

                if (quyhoachProvinceId && !isNaN(quyhoachProvinceId)) {
                    const isHasProvince = quyhoachByProvince.some((item) => item.idProvince === quyhoachProvinceId);

                    if (!isHasProvince) {
                        const [, provincePlanDetail] = await getAllPlansDetailsByProvineId(quyhoachProvinceId);

                        // delete quyhoach param is it exist
                        // searchParams.delete('quyhoach');
                        // setSearchParams(searchParams);

                        if (provincePlanDetail) {
                            // add id and image of province
                            province['id_tinh'] = provincePlanDetail.id_tinh;
                            province['link_image'] = provincePlanDetail.link_quy_hoach_tinh;

                            // get children boundingbox of province
                            provincePlanDetail.quan_huyen_1_tinh.forEach((item) => {
                                const boudingboxData = item.quyhoach.map((planItem) => {
                                    if (!planItem.location) {
                                        if (
                                            planItem.boundingbox.startsWith('[') &&
                                            planItem.boundingbox.endsWith(']')
                                        ) {
                                            return JSON.parse(planItem);
                                        }
                                    }
                                    if (!planItem.boundingbox) {
                                        if (planItem.location.startsWith('[') && planItem.location.endsWith(']')) {
                                            return JSON.parse(planItem);
                                        }
                                    }
                                    return !planItem.location
                                        ? planItem.boundingbox.split(',')
                                        : planItem.location.split(',');
                                });

                                childrenBoudingBoxData.push(...boudingboxData);
                            });

                            const everage = childrenBoudingBoxData.length * 2;
                            childrenBoudingBoxData.forEach((item) => {
                                minLon += Number(item[0]);
                                minLat += Number(item[1]);
                                maxLon += Number(item[2]);
                                maxLat += Number(item[3]);
                            });
                            const centerLon = (minLon + maxLon) / everage;
                            const centerLat = (minLat + maxLat) / everage;

                            center.push(centerLon);
                            center.push(centerLat);

                            dispatch(setPlanByProvince([...quyhoachByProvince, province]));
                            const info = await fetchProvinceName(center[LatitudeUrlIndex], center[LongitudeUrlIndex]);
                            dispatch(
                                setCurrentLocation({
                                    lat: center[LatitudeUrlIndex],
                                    lon: center[LongitudeUrlIndex],
                                    provinceName: info?.provinceName,
                                    districtName: info?.districtName,
                                }),
                            );

                            dispatch(
                                setTreeCheckedKey([
                                    ...treeCheckedKeys,
                                    {
                                        isProvince: true,
                                        idProvince: provincePlanDetail.id_tinh,
                                    },
                                ]),
                            );
                        }
                    }
                    return;
                } else {
                    if (quyhoachByProvince.length > 0) {
                        dispatch(setPlanByProvince([]));
                        dispatch(setTreeCheckedKey([...treeCheckedKeys.filter((item) => !item.isProvince)]));
                    }
                }

                if (!!quyhoachIds) {
                    const allPlans = await fetchAllQuyHoach();
                    const currentPlan = Number(quyhoachIds?.split('-')[0]);
                    const map = {};
                    const memory = [];
                    allPlans
                        .filter((item) => quyhoachIds.includes(item.id.toString()))
                        .forEach((element) => {
                            const key = `${element.idDistrict}-${element.idProvince}`;
                            map[key] = (map[key] || 0) + 1;
                        });

                    const plansFiltered = allPlans
                        .filter((item) => quyhoachIds.includes(item.id.toString()))
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

                    //  Mấy đoạn tương tự thế này lặp nhiều lần nhưng chưa có thời gian refactor lại
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

                    center.push(centerLon);
                    center.push(centerLat);

                    dispatch(setPlansInfo(plansFiltered));
                    const info = await fetchProvinceName(center[LatitudeUrlIndex], center[LongitudeUrlIndex]);
                    dispatch(
                        setCurrentLocation({
                            lat: center[LatitudeUrlIndex],
                            lon: center[LongitudeUrlIndex],
                            provinceName: info?.provinceName,
                            districtName: info?.districtName,
                        }),
                    );
                } else if (vitri && vitri.length > 0) {
                    const lat = parseFloat(vitri[0]);
                    const lng = parseFloat(vitri[1]);
                    dispatch(setPlansInfo([]));
                    const info = await fetchProvinceName(lat, lng);
                    dispatch(
                        setCurrentLocation({
                            lat,
                            lon: lng,
                            provinceName: info.provinceName,
                            districtName: info.districtName,
                        }),
                    );
                    const res = await searchLocation(info?.districtName);
                    res ? setIdDistrict(res.idDistrict) : setIdDistrict(null);
                    setListenDblClick(Math.random());
                }
            } catch (error) {
                console.log('error', error);
                setIdDistrict(null);
            }
        })();
    }, []);

    useEffect(() => {
        if (!idProvince) return;

        const fetchData = async () => {
            try {
                const data = await fetchListInfo(idProvince);
                dispatch(setListMarker(data.data || []));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [idProvince]);

    return (
        <>
            {contextHolder}
            {contextHolderNoti}

            {/* <Modal
                title="Khu vực này có nhiều quy hoạch, vui lòng chọn quy hoạch để xem!"
                open={planOption.length > 1}
                onOk={() => setPlanOption([])}
                onCancel={() => setPlanOption([])}
                centered
            >
                <Radio.Group onChange={(e) => setSelectedIDQuyHoach(e.target.value)} value={selectedIDQuyHoach}>
                    {planOption.map((plan) => (
                        <Radio key={plan.id} value={plan.id}>
                            {plan.description}
                        </Radio>
                    ))}
                </Radio.Group>
            </Modal> */}

            {/* Images list when travel to district */}
            {/* {isShowImagesList && ( */}
            <ImageList isShowImagesList={isShowImagesList}>
                <div
                    className="close-boudingbox-list"
                    onClick={() => {
                        onOpenBtnImageList();
                        onCloseImageList();
                    }}
                >
                    <CloseOutlined className="close-icon" />
                </div>
            </ImageList>
            {/* )} */}

            {/* show bounding box data button */}
            <div
                className={`image-list-open bg-white ${!isShowBtnOpen ? 'close' : ''}`}
                onClick={() => {
                    onOpenImageList();
                    onCloseBtnImageList();
                }}
            >
                {/* <img src={images.imageList} alt="Ảnh danh sách quy hoạch" className="image-list-icon" /> */}
                <FaMapMarkedAlt className="image-list-icon" />
            </div>

            <MapContainer
                style={{
                    width: '100vw',
                    height: windowSize.windowWidth > 768 ? 'calc(100vh - 60px)' : 'calc(100vh - 30%)',
                }}
                center={initialCenter}
                zoom={initialZoom}
                maxZoom={30}
                ref={mapRef}
                zoomControl={false}
            >
                <ZoomControl position="bottomright" />
                <UserLocationMarker />
                <MapEvents />
                <GoToLocation />
                {currentLocation && <ResetCenterView lat={currentLocation.lat} lon={currentLocation.lon} />}
                <LayersControl>
                    {windowSize.windowWidth < 768 && (
                        <LayersControl.BaseLayer checked name="Map vệ tinh">
                            <TileLayer
                                url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHVhbmFuaDMxaiIsImEiOiJjbTMzMmo2d3AxZ2g0Mmlwejl1YzM0czRoIn0.vCpAJx2b_FVhC3LDfmdLTA`}
                                attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
                                maxZoom={22}
                            />
                        </LayersControl.BaseLayer>
                    )}
                    {windowSize.windowWidth > 768 && (
                        <LayersControl.BaseLayer checked name="Map vệ tinh">
                            <TileLayer
                                url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
                                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                maxZoom={30}
                                attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a> contributors"
                            />
                        </LayersControl.BaseLayer>
                    )}

                    <LayersControl.BaseLayer name="Map mặc định">
                        <TileLayer
                            maxZoom={25}
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
                <Pane name="PaneThai" style={{ zIndex: 650 }}>
                    {plansStored &&
                        plansStored.length > 0 &&
                        plansStored.map((item, index) => {
                            return (
                                <TileLayer
                                    key={index}
                                    url={`${item.huyen_image}/{z}/{x}/{y}`}
                                    pane="overlayPane"
                                    minZoom={1}
                                    // maxNativeZoom={18}
                                    maxZoom={25}
                                    opacity={opacity}
                                />
                            );
                        })}
                    {quyhoachByProvince &&
                        quyhoachByProvince.length > 0 &&
                        quyhoachByProvince.map((item, index) => {
                            return (
                                <TileLayer
                                    key={index}
                                    url={`${item.link_image}/{z}/{x}/{y}`}
                                    pane="overlayPane"
                                    minZoom={1}
                                    // maxNativeZoom={18}
                                    maxZoom={25}
                                    opacity={opacity}
                                />
                            );
                        })}

                    {/* <TileLayer
                        key={321}
                        url={`https://api.quyhoach.xyz/get_quyhoach_theo_tinh/14/{z}/{x}/{y}`}
                        pane="overlayPane"
                        minZoom={5}
                        maxZoom={22}
                        opacity={opacity}
                    /> */}

                    {/* <TileLayer
                        url={`https://apilandinvest.gachmen.org/get_api_quyhoach/452/{z}/{x}/{y}`}
                        pane="overlayPane"
                        minZoom={1}
                        maxZoom={22}
                        opacity={opacity}
                    /> */}
                    {/* {selectedIDQuyHoach && (
                        <TileLayer
                            url={`https://api.quyhoach.xyz/get_api_quyhoach/${selectedIDQuyHoach}/{z}/{x}/{y}`}
                            pane="overlayPane"
                            minZoom={12}
                            maxZoom={22}
                            opacity={opacity}
                        />
                    )} */}
                </Pane>
                {currentLocation && currentLocation.lat && currentLocation.lon && (
                    <Marker position={[currentLocation.lat, currentLocation.lon]} icon={customIcon}>
                        <Popup>
                            <div>
                                <h3 style={{ fontWeight: 600 }}>
                                    Tỉnh {currentLocation?.provinceName}, Huyện {currentLocation?.districtName}
                                </h3>
                                <p>
                                    Vị trí: {currentLocation?.lat}, {currentLocation?.lon}
                                </p>
                                <button
                                    className="button--share"
                                    onClick={() => handleShareClick(currentLocation?.lat, currentLocation?.lon)}
                                >
                                    <FaShareAlt />
                                    Chia sẻ
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                )}
                {initialCenter && (
                    <>
                        <Marker position={initialCenter} icon={customIcon}>
                            <Popup>Vị trí trung tâm</Popup>
                        </Marker>
                    </>
                )}

                {/* Marker in location now */}
                {mapZoom >= 15 && boudingboxImagesList?.length !== 0 && (
                    <>
                        {boudingboxImagesList?.map((item, index) => (
                            <MarkerItem item={item} key={index} />
                        ))}
                    </>
                )}

                {listMarker.map((marker) => (
                    <Marker key={marker.id} position={[marker.latitude, marker.longitude]} icon={customIcon}>
                        <Popup>
                            <div>
                                <h3 style={{ fontWeight: 600 }}>{marker.description}</h3>
                                <p style={{ fontSize: 20, fontWeight: 400, margin: '12px 0' }}>
                                    Giá/m²: {formatToVND(marker.priceOnM2)}
                                </p>
                                <button
                                    className="button--detail"
                                    onClick={() => {
                                        setIsDrawerVisible(true);
                                        setSelectedMarker(marker);
                                    }}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* {polygon && <Polygon pathOptions={{ fillColor: 'transparent' }} positions={polygon} />} */}
                {selectedMarker && (
                    <DrawerView
                        isDrawerVisible={isDrawerVisible}
                        closeDrawer={closeDrawer}
                        addAt={selectedMarker.addAt}
                        images={selectedMarker.imageLink}
                        description={selectedMarker.description}
                        priceOnM2={selectedMarker.priceOnM2}
                        typeArea={selectedMarker.typeArea}
                        area={selectedMarker.area}
                    />
                )}
                <Drawer
                    placement="left"
                    // closable={true}
                    mask={false}
                    closeIcon={<CloseOutlined style={{ fontSize: 18 }} />}
                    onClose={onCloseLocationInfo}
                    open={isLocationInfoOpen}
                    key={'left'}
                    className="overflow-y-hidden"
                >
                    <div className="ant-drawer-body-wrapper">
                        <div>
                            <img
                                src={mapImages.locationInfo}
                                alt="default map 2x"
                                srcSet={mapImages.locationInfoHd}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="bg-white ant-drawer-body-title-wrapper">
                            <span className="ant-drawer-body-title ">Example: 10°01'06.1"N 105°45'23.2"E</span>
                        </div>
                        <div>
                            <div className="ant-drawer-body-function">
                                <Tooltip title="Lấy tạo độ hiện tại">
                                    <div
                                        className="ant-drawer-body-function-item-wrapper"
                                        onClick={handleShareLogoLocation}
                                    >
                                        <div className="ant-drawer-body-function-item">
                                            <EnvironmentOutlined className="ant-drawer-body-function-item-icon" />
                                        </div>
                                        <span className="ant-drawer-body-function-item-text">Lấy tọa độ</span>
                                    </div>
                                </Tooltip>
                                <Tooltip title="Chia sẻ vị trí hiện tại">
                                    <div
                                        className="ant-drawer-body-function-item-wrapper"
                                        onClick={handleShareLocationNow}
                                    >
                                        <div className="ant-drawer-body-function-item">
                                            <ShareAltOutlined className="ant-drawer-body-function-item-icon" />
                                        </div>
                                        <span className="ant-drawer-body-function-item-text">Chia sẻ</span>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </Drawer>

                {/* {polygonSessionStorage.length > 0 &&
                    isOverview &&
                    polygonSessionStorage.map((polygon, index) => {
                        return (
                            <Polygon
                                key={index}
                                positions={polygon.geometry.coordinates[0].map((coord) => [coord[1], coord[0]])}
                                color="pink"
                                fillOpacity={0.5}
                                fillColor="pink"
                            />
                        );
                    })} */}
                {/* <Polygon
                    positions={polygon.geometry.coordinates[0].map((coord) => [coord[1], coord[0]])}
                    color="pink"
                    fillOpacity={0.5}
                    fillColor="pink"
                /> */}
                {/* {isOverview &&
                    polygonsData.map((item) => {
                        if (item.type === 'Polygon') {
                            return (
                                <Polygon
                                    positions={item.polygons[0].map((coord) => [coord[1], coord[0]])}
                                    color="pink"
                                    fillOpacity={0.5}
                                    fillColor="pink"
                                />
                            );
                        } else if (item.type === 'MultiPolygon') {
                            return item.polygons.map((coordinates) => (
                                <Polygon
                                    positions={coordinates[0].map((coord) => [coord[1], coord[0]])}
                                    color="pink"
                                    fillOpacity={0.5}
                                    fillColor="pink"
                                />
                            ));
                        } else {
                            return null;
                        }
                    })} */}
            </MapContainer>
        </>
    );
};

export default memo(Map);
