import { Carousel, Spin } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { DATA_TYPE } from '../../../constants/dataType';
import SliderControls from './SliderController';
import VideoModal from './VideoModal';
import VideoPlan from './VideoPlan';
import EmptyMessage from './EmptyMessage';

const AllVideoList = ({ map }) => {
    const carouselRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const boundingboxDataLocation = useSelector((state) => state.boudingboxSlice.boudingboxData);
    const boudingboxVideoList = boundingboxDataLocation.list_image?.filter(
        (item) => item.loai_anh === DATA_TYPE.FLYCAM_VIDEO || item.loai_anh === DATA_TYPE.VIDEO,
    );
    const [videoUrl, setVideoUrl] = useState('');
    const onGoToLocation = useCallback((location) => {
        const zoom = 20;
        map.flyTo(location, zoom, { duration: 1 });
    }, []);

    const handleOpenVideo = useCallback(
        (videoUrl) => {
            setVideoUrl(videoUrl);
            setIsModalOpen(true);
        },
        [videoUrl],
    );

    const handleOk = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // handle next modal
    const handlePrev = useCallback(() => {
        carouselRef.current?.prev();
    }, []);

    // handle prev modal
    const handleNext = useCallback(() => {
        carouselRef.current?.next();
    }, []);

    return (
        <>
            <Carousel
                ref={carouselRef}
                dotPosition="left"
                dots={false}
                infinite
                speed={500}
                draggable
                slidesToShow={4}
                className="image-carousel"
            >
                {boudingboxVideoList?.map((item, index) => (
                    <VideoPlan
                        item={item}
                        key={index}
                        openModalVideo={handleOpenVideo}
                        onGoToLocation={onGoToLocation}
                    />
                ))}
            </Carousel>
            {boudingboxVideoList?.length === 0 && <EmptyMessage message="Khu vực này chưa có video quy hoạch" />}
            <VideoModal isModalOpen={isModalOpen} url={videoUrl} handleCancel={handleCancel} handleOk={handleOk} />
            {boudingboxVideoList?.length > 4 && (
                <SliderControls handleNext={handleNext} handlePrev={handlePrev} isButtonHandle={false} />
            )}
        </>
    );
};

export default AllVideoList;
