import { Carousel } from 'antd';
import React, { memo, useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { DATA_TYPE } from '../../../constants/dataType';
import EmptyMessage from './EmptyMessage';
import Image360Modal from './Image360Modal';
import Image360Plan from './Image360Plan';
import SliderControls from './SliderController';

const All360ImageList = () => {
    const carouselRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image360, setImage360] = useState('');
    const boundingboxDataLocation = useSelector((state) => state.boudingboxSlice.boudingboxData);
    const boudingboxImagesList = boundingboxDataLocation.list_image?.filter(
        (item) => item.loai_anh === DATA_TYPE.IMAGE_360,
    );

    const onViewImage360 = useCallback((ImageUrl) => {
        setIsModalOpen(true);
        setImage360(ImageUrl);
    }, []);

  

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
                {boudingboxImagesList?.map((item, index) => (
                    <Image360Plan
                        item={item}
                        key={index}
                        onViewImage360={onViewImage360}
                    />
                ))}
            </Carousel>
            {boudingboxImagesList?.length === 0 && <EmptyMessage message="Khu vực này chưa có ảnh quy hoạch 360 độ " />}
            <Image360Modal
                imageUrl={image360}
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                handleOk={handleOk}
            />
           {boudingboxImagesList?.length > 4 && (
                <SliderControls handleNext={handleNext} handlePrev={handlePrev} isButtonHandle={false} />
            )}
        </>
    );
};

export default memo(All360ImageList);
