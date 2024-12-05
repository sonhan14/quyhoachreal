import React, { useEffect, useState } from 'react';
import './ModalUploadImage.scss';
import { Image, Input, Modal, Space } from 'antd';
import { DollarIcon, FileUploadIcon } from '../../Icons';
import { FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Import Axios
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { filterByHouse } from '../../../constants/filter';
import Checkbox from '../../Checkbox';
import { MdOutlineLandslide } from 'react-icons/md';
import { searchLocation } from '../../../services/api';

const ModalUploadImage = ({
    showNotification,
    isModalUpLoadVisible,
    handleCloseModal,
    selectedPosition,
    locationInfo,
}) => {
    const datauser = useSelector((state) => state.account.dataUser);
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('');
    const [priceOnM2, setPriceOnM2] = useState('');
    const [dienTich, setDienTich] = useState();
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [error, setError] = useState(false);
    const [checkedItem, setCheckedItem] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const settings = {
        dots: images.length > 1,
        infinite: images.length > 1,
        speed: 500,
        slidesToShow: images.length > 4 ? 3 : images.length === 1 ? 1 : 2,
        slidesToScroll: images.length > 4 ? 3 : images.length === 1 ? 1 : 2,
    };

    const handleCheckboxChange = (title) => {
        setCheckedItem((prev) => (prev === title ? null : title));
    };

    useEffect(() => {
        const getIdDistrict = async () => {
            try {
                if (locationInfo) {
                    // const res = await getProvince(locationInfo.provinceName);
                    // const data = await findClosestDistrict(res.TinhThanhPhoID, locationInfo.districtName);

                    // data.found ? setSelectedDistrict({ districtId: data.districtId,districtName: data.districtName,}) : console.error(data.error);
                    const res = await searchLocation(locationInfo?.districtName);
                    if (res) {
                        setSelectedDistrict({ districtId: res.idDistrict, districtName: locationInfo?.districtName });
                    } else {
                        setSelectedDistrict({ districtId: null, districtName: null });
                    }
                }
            } catch (error) {
                setSelectedDistrict({ districtId: null, districtName: null });
            }
        };

        getIdDistrict();
    }, [locationInfo, selectedPosition]);

    useEffect(() => {
        if (selectedPosition) {
            setImages([]);
        }
    }, [selectedPosition]);

    const handleUpload = async () => {
        if (
            !datauser ||
            !datauser.UserID ||
            images.length === 0 ||
            !description ||
            !priceOnM2 ||
            !dienTich ||
            !selectedPosition ||
            !selectedDistrict.districtId ||
            !checkedItem
        ) {
            console.error('Missing required fields');
            showNotification(
                'error',
                'Lỗi',
                'Tính năng này yêu cầu đăng nhập, nếu đã đăng nhập vui lòng nhập đủ thông tin',
            );
            return;
        }

        const payload = {
            idUser: datauser.UserID,
            imageLink: JSON.stringify(images),
            description,
            longitude: selectedPosition.lng,
            latitude: selectedPosition.lat,
            priceOnM2,
            idDistrict: selectedDistrict.districtId,
            area: dienTich,
            typeArea: checkedItem,
        };

        try {
            const response = await axios.post('https://landinvest.gachmen.org/api/location/add_info', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            showNotification(
                'success',
                'Thành công',
                'Thêm hình ảnh mảnh đất, dự án thành công, tải lại trang để xem kết quả',
            );
            handleCloseModal();
        } catch (error) {
            console.error('Error uploading data:', error);
            showNotification('error', 'Lỗi', 'Lỗi khi thêm ảnh mảnh đất, dự án');
        }
    };

    const handleSubmit = () => {
        if (inputValue === '') {
            setError(false);
            return;
        }
        const img = new window.Image();
        img.onload = () => {
            setImages((prevImages) => [...prevImages, inputValue]);
            setError(false);
            setInputValue('');
        };
        img.onerror = () => {
            setError(true);
            console.error('Error loading image:', inputValue);
        };
        img.src = inputValue;
    };
    const handleImageLinkEnter = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Modal
            key={1212}
            open={isModalUpLoadVisible}
            // onOk={handleOk}
            onCancel={handleCloseModal}
            footer={null}
            centered
            title={[
                <div className="title--uploadImage">
                    <FileUploadIcon />
                    <p>Thêm hình ảnh mảnh đất, dự án</p>
                    <FiPlus size={22} />
                </div>,
            ]}
        >
            <div className="modal--upload__content">
                <div className="content--container">
                    {/* <a href="https://www.youtube.com/" target="_blank" className="content__link" rel="noreferrer">
                        <div className="content__link--box"></div>
                        <span>Video hướng dẫn Youtube</span>
                    </a> */}
                    <div className="content--input__image">
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                status={error ? 'error' : ''}
                                type="text"
                                placeholder="Link ảnh bạn muốn thêm"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleImageLinkEnter}
                            />
                            <button className="button-image" onClick={handleSubmit}>
                                Tải lên
                            </button>
                        </Space.Compact>

                        {images.length > 0 && (
                            <div className="content__images">
                                <Slider {...settings}>
                                    {images.map((image, index) => (
                                        <Image key={index} src={image} alt={`Image`} className="content__image" />
                                    ))}
                                </Slider>
                            </div>
                        )}
                    </div>
                    <div className="content__price">
                        <label htmlFor="price">Giá/m²</label>
                        <input
                            id="price"
                            type="number"
                            value={priceOnM2}
                            onChange={(e) => setPriceOnM2(e.target.value)}
                        />
                        <DollarIcon />
                    </div>
                    <div className="content__price">
                        <label htmlFor="dienTich">Diện tích</label>
                        <input
                            id="dienTich"
                            type="number"
                            value={dienTich}
                            onChange={(e) => setDienTich(e.target.value)}
                        />
                        <MdOutlineLandslide size={22} />
                    </div>
                    <div className="content__location">
                        <label htmlFor="">Vĩ độ:</label>
                        <span>{selectedPosition?.lat || ''}</span>
                    </div>
                    <div className="content__location">
                        <label htmlFor="">Kinh độ:</label>
                        <span>{selectedPosition?.lng || ''}</span>
                    </div>
                    <div className="filterByHouse">
                        {filterByHouse.map((item) => (
                            <Checkbox
                                key={item.id}
                                title={item.title}
                                id={item.id}
                                color
                                checked={checkedItem === item.title}
                                onChange={() => handleCheckboxChange(item.title)}
                            />
                        ))}
                    </div>
                    <div className="content__location">
                        <label htmlFor="">Huyện:</label>
                        <span>{selectedDistrict?.districtName || ''}</span>
                    </div>
                    {/* <Select
                        showSearch
                        placeholder="Chọn quận/huyện"
                        optionFilterProp="children"
                        onChange={(value) => {
                            setSelectedDistrictId(value);
                            handleSelectedDistrict(value);
                        }}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%' }}
                        value={selectedDistrictId}
                    >
                        {listDistrict.length > 0 &&
                            listDistrict.map((district) => (
                                <Select.Option key={district.DistrictID} value={district.TinhThanhPhoID}>
                                    {district.DistrictName}
                                </Select.Option>
                            ))}
                    </Select> */}
                    <div className="content__description">
                        <label htmlFor="">Mô tả:</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <button className="modal--upload--button" onClick={handleUpload}>
                    Đăng tải
                </button>
            </div>
        </Modal>
    );
};

export default ModalUploadImage;
