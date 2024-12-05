import { Avatar, Drawer, Image as AntImage, Space, Modal } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import './DrawerView.scss';
import { calculateDate } from '../../../function/calculateDate';
import { formatToVND } from '../../../function/formatToVND';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { useSelector } from 'react-redux';
import ModalPreview from './ModalPreview';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';

const DrawerView = ({ isDrawerVisible, closeDrawer, images, description, priceOnM2, addAt, typeArea, area }) => {
    const user = useSelector((state) => state.account.Users);
    const settings = {
        dots: images.length > 1,
        infinite: images.length > 1,
        speed: 500,
        slidesToShow: images.length > 4 ? 3 : images.length === 1 ? 1 : 2,
        slidesToScroll: images.length > 4 ? 3 : images.length === 1 ? 1 : 2,
    };
    const [processedImages, setProcessedImages] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const checkImages = async () => {
            const processed = await Promise.all(
                images.map(({ id, imageLink }) => {
                    return new Promise((resolve) => {
                        const img = new window.Image();
                        img.src = imageLink;

                        img.onload = () => {
                            // Check if the image is 360 based on the aspect ratio (2:1 for 360-degree images)
                            const isPanoramic = img.width / img.height === 2;
                            resolve({ id, imageLink, is360: isPanoramic });
                        };

                        img.onerror = () => {
                            // If image fails to load, consider it as non-360 image
                            resolve({ id, imageLink, is360: false });
                        };
                    });
                }),
            );
            setProcessedImages(processed);
        };

        checkImages();
    }, [images]);

    const handleOpenPreview = (img) => {
        setPreviewOpen(true);
        setSelectedImage(img);
    };
    const handleClose = () => {
        setPreviewOpen(false);
        setSelectedImage(null);
    };

    return (
        <>
            <Drawer placement="bottom" closable={false} onClose={closeDrawer} open={isDrawerVisible}>
                <div className="drawer--content__container">
                    <div className="drawer--content__detail">
                        <h3 style={{ fontWeight: 700 }}>{description}</h3>
                        <Space.Compact style={{ alignItems: 'center' }}>
                            <Avatar
                                size={40}
                                src={user?.avatarLink}
                                style={{ backgroundColor: '#10b700', color: '#fff' }}
                            >
                                {user?.avatarLink || user?.FullName?.charAt(0) || 'T'}
                            </Avatar>
                            <p style={{ marginLeft: '1rem', fontWeight: 600 }}>{user?.FullName || ''}</p>
                        </Space.Compact>
                        <p>Loại tài sản: {typeArea}</p>
                        <p>Giá/m²: {formatToVND(priceOnM2)}</p>
                        <p>Ngày đăng: {calculateDate(addAt)}</p>
                        <p>Diện tích: {area} m²</p>
                    </div>
                    <div className="drawer__image">
                        {processedImages.length > 0 ? (
                            <Slider {...settings}>
                                {processedImages.map(({ id, imageLink, is360 }) => (
                                    <div key={id}>
                                        {is360 || (
                                            <AntImage
                                                src={imageLink}
                                                alt={`Image ${id}`}
                                                className="drawer--content__image"
                                            />
                                        )}
                                        {is360 && (
                                            <div className="image" onClick={() => handleOpenPreview(imageLink)}>
                                                <img src={imageLink} alt={`Image ${id}`} />
                                                <div class="image-mask">
                                                    <div class="image-mask-info">
                                                        <span role="img" aria-label="eye" class="anticon anticon-eye">
                                                            <svg
                                                                viewBox="64 64 896 896"
                                                                focusable="false"
                                                                data-icon="eye"
                                                                width="1em"
                                                                height="1em"
                                                                fill="currentColor"
                                                                aria-hidden="true"
                                                            >
                                                                <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                                                            </svg>
                                                        </span>
                                                        Preview
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p>Đang tải hình ảnh...</p>
                        )}
                    </div>
                </div>
                <Modal open={previewOpen} onCancel={handleClose} footer={null} width={'90vw'} closable={false}>
                    {selectedImage && (
                        <ReactPhotoSphereViewer src={selectedImage} width="100%" height="90vh"></ReactPhotoSphereViewer>
                    )}
                </Modal>
            </Drawer>
        </>
    );
};

export default memo(DrawerView);
