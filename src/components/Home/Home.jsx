import { FaLocationArrow, FaPaintBrush } from 'react-icons/fa';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import { FiPlus } from 'react-icons/fi';
import { GiGolfFlag } from 'react-icons/gi';
import { LuShare2 } from 'react-icons/lu';
import { MdDeleteForever } from 'react-icons/md';
import { RiSubtractLine } from 'react-icons/ri';
import './Home.scss';

import React, { useCallback, useRef, useState } from 'react';
import { GrLocation } from 'react-icons/gr';

import { Drawer, message, notification } from 'antd';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import 'rc-slider/assets/index.css';
import { FileUploadIcon } from '../Icons';
import ModalDownMenu from './ModalDown/ModalDownMenu';
import ModalPriceFilter from './ModalDown/ModalPriceFilter';
import ModalUploadImage from './ModalUploadImage';

import { AimOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import fetchProvinceName from '../../function/findProvince';
import useTableListOpen from '../../hooks/useTableListOpen';
import useWindowSize from '../../hooks/useWindowSise';
import { backToMyLocation } from '../../redux/search/searchSlice';
import useGetMyLocation from '../Hooks/useGetMyLocation';
import Map from '../Map';
import TablePlans from './TablePlans';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function Home() {
    const [opacity, setOpacity] = useState(1);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [activeItem, setActiveItem] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalUpLoadVisible, setIsModalUploadVisible] = useState(false);
    const [isShowModalPrice, setIsShowModalPrice] = useState(false);
    const [isShowModalQuyhoach, setIsShowModalQuyhoach] = useState(false);
    const [idDistrict, setIdDistrict] = useState(null);
    const dispatch = useDispatch();
    const { isOpen, handleCloseTableList } = useTableListOpen();
    const myLoca = useGetMyLocation();
    const [messageApi, contextHolder] = message.useMessage();
    const { districtName, provinceName } = useSelector((state) => state.searchQuery.searchResult);
    const mapRef = useRef();
    const location = useLocation();
    const windowSize = useWindowSize();
    const [isRefreshTreeData, setIsRefreshTreeData] = useState(false);

    // useEffect(() => {
    //     const searchParams = new URLSearchParams(location.search);
    //     const vitriParam = searchParams.get('vitri');
    //     const vitri = vitriParam ? vitriParam.split(',').map(Number) : [];
    //     if (vitri.length === 2) {
    //       const fetchData = async () => {
    //         try {
    //           const data = await fetchProvinceName(vitri[0], vitri[1]);
    //           if (data) {
    //             setPosition(data);
    //           }
    //         } catch (error) {
    //           console.error('Error fetching province data:', error);
    //         }
    //       };

    //       fetchData();
    //     }
    //   }, [location.search]);

    // const {  displayName } = useSelector((state) => state.searchQuery.searchResult);
    const doRefreshTreeData = (value) => {
        if (value) {
            setIsRefreshTreeData(!isRefreshTreeData);
        } else {
            setIsRefreshTreeData(value);
        }
    };

    const handleShareClick = () => {
        const urlParams = new URLSearchParams(location.search);
        if (selectedPosition) {
            const { lat, lng } = selectedPosition;

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
                .catch((err) => {
                    messageApi.open({
                        type: 'error',
                        content: 'Lỗi khi sao chép vào bộ nhớ',
                    });
                });
        } else {
            messageApi.open({
                type: 'error',
                content: 'Vui lòng chọn vị trí bạn muốn chia sẻ',
            });
        }
    };

    const handleSliderChange = (event) => {
        setOpacity(event.target.value);
    };

    const handleLocationArrowClick = () => {
        if (!selectedPosition) {
            message.success('Vui lòng chọn vị trí bạn muốn tìm');
        } else {
            const [lat, lng] = selectedPosition;
            window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
        }
    };

    const handleCloseModal = () => {
        setIsModalUploadVisible(false);
    };

    const handleClick = useCallback((index) => {
        setActiveItem(index);
        if (index === 3) {
            setIsModalVisible(true);
        } else if (index === 2) {
            setIsShowModalQuyhoach(true);
        }
    }, []);

    const handleModalClose = () => {
        setIsModalVisible(false);
        setActiveItem(0);
    };
    const handleClosePrice = () => {
        setIsShowModalPrice(false);
    };
    // const handleCloseQuyHoach = () => {
    //     setIsShowModalQuyhoach(false);
    //     setActiveItem(0);
    // };
    const [searchParams, setSearchParams] = useSearchParams();
    // const searchParams = new URLSearchParams(location.search);
    const handleBackToMyLocation = async () => {
        const map = mapRef.current;
        if (map) {
            map.setView([myLoca.lat, myLoca.lng], 15, { animate: true, duration: 1, easeLinearity: 0.9 });
        }
        try {
            if (myLoca.lat && myLoca.lng) {
                const info = await fetchProvinceName(myLoca.lat, myLoca.lng);
                dispatch(
                    backToMyLocation({
                        lat: myLoca.lat,
                        lon: myLoca.lng,
                        provinceName: info?.provinceName,
                        districtName: info?.districtName,
                    }),
                );
                searchParams.set('vitri', `${myLoca.lat},${myLoca.lng}`);
                setSearchParams(searchParams);
            } else {
                message.error('Không thể xác định vị trí của bạn');
            }
        } catch (error) {
            console.log(error);
        }
    };
    const buttonRef = useRef();

    const showNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
        });
    };
    const isPhoneSize = windowSize.windowWidth < 768;

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const data = await fetchAllQuyHoach();

    //             const processedList = data.map((qh) => ({
    //                 ...qh,
    //                 boundingbox: processBoundingBox(qh.boundingbox),
    //             }));

    //             setListQuyHoach(processedList);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    return (
        <>
            {contextHolder}
            <div
                className="home-container"
                style={
                    isPhoneSize
                        ? { overflowY: 'auto', position: 'relative', height: '80vh' }
                        : { overflowY: 'auto', position: 'relative', height: '100vh' }
                }
            >
                <div
                    className="slider-container"
                    style={{
                        position: 'fixed',
                        top: 120,
                        right: 10,
                        zIndex: 1000,
                        padding: 10,
                        borderRadius: 4,
                        marginTop: isPhoneSize ? 40 : 0,
                    }}
                >
                    <div className="slider-container-range">
                        <div
                            className="nav-icon-arrow"
                            onClick={() => setOpacity((prev) => (prev === 1 ? 1 : prev + 0.1))}
                        >
                            <FiPlus size={22} />
                        </div>
                        <input
                            type="range"
                            className="slider"
                            orientation="vertical"
                            value={opacity}
                            onChange={handleSliderChange}
                            min={0}
                            max={1}
                            step={0.01}
                            style={{
                                writingMode: 'bt-lr',
                                WebkitAppearance: 'slider-vertical',
                            }}
                        />
                        <div
                            className="nav-icon-arrow"
                            onClick={() => setOpacity((prev) => (prev === 0 ? 0 : prev - 0.1))}
                        >
                            <RiSubtractLine size={22} />
                        </div>
                        <div className="nav-icon">
                            <div className="nav-icon-arrow">
                                <FaArrowRotateLeft size={20} />
                            </div>
                            <div className="nav-icon-arrow" onClick={handleLocationArrowClick}>
                                <FaLocationArrow size={18} />
                            </div>
                            <div className="nav-icon-flag-delete">
                                <GiGolfFlag size={24} />
                                <MdDeleteForever size={22} />
                            </div>
                            <div className="nav-icon-arrow">
                                <FaPaintBrush size={18} />
                            </div>
                            <div className="nav-icon-arrow" onClick={handleShareClick}>
                                <LuShare2 size={20} />
                            </div>
                            <div className="nav-icon-arrow" onClick={handleBackToMyLocation}>
                                <AimOutlined size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Container */}
                <div className="container-header">
                    <div className="container-header-select">
                        <div className="slider-container-location">
                            <GrLocation />
                            <span>
                                {provinceName && districtName ? `${provinceName}, ${districtName}` : 'Không có dữ liệu'}
                            </span>
                        </div>
                        <div
                            ref={buttonRef}
                            className={`slider-list-item ${activeItem === 3 ? 'active_item text-[10px]' : ''}`}
                            onClick={() => handleClick(3)}
                        >
                            Danh sách quy hoạch
                        </div>
                    </div>
                </div>

                {/* Map Container */}
                {!isOpen && (
                    <Map
                        mapRef={mapRef}
                        opacity={opacity}
                        setSelectedPosition={setSelectedPosition}
                        selectedPosition={selectedPosition}
                        setIdDistrict={setIdDistrict}
                        idDistrict={idDistrict}
                    />
                )}

                <ModalDownMenu
                    show={isModalVisible}
                    handleClose={handleModalClose}
                    isRefreshTreeData={isRefreshTreeData}
                    doRefreshTreeData={doRefreshTreeData}
                />
                <ModalPriceFilter showPrice={isShowModalPrice} handleClosePrice={handleClosePrice} />

                {/* upload Image */}
                {isModalUpLoadVisible || (
                    <div className="upload-image-container" onClick={() => setIsModalUploadVisible(true)}>
                        <FileUploadIcon />
                        {windowSize.windowWidth > 768 && (
                            <p className="user-select-none">Thêm hình ảnh mảnh đất, dự án</p>
                        )}
                        <FiPlus size={22} />
                    </div>
                )}

                <ModalUploadImage
                    showNotification={showNotification}
                    isModalUpLoadVisible={isModalUpLoadVisible}
                    handleCloseModal={handleCloseModal}
                    selectedPosition={selectedPosition}
                    locationInfo={provinceName}
                />

                {/* <ModalQuyHoach
                    isShowModalQuyHoach={isShowModalQuyhoach}
                    handleCloseQuyHoach={handleCloseQuyHoach}
                    idDistrict={idDistrict}
                /> */}
            </div>

            <Drawer
                title={'Kho dữ liệu quy hoạch'}
                width={'100vw'}
                height={'100vh'}
                onClose={handleCloseTableList}
                open={isOpen}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
            >
                {!!isOpen && <TablePlans />}
            </Drawer>
        </>
    );
}

export default Home;
