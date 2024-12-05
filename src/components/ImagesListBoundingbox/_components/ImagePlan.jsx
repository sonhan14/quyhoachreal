import { EnvironmentOutlined } from '@ant-design/icons';
import { Button, Image, Skeleton } from 'antd';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../../../redux/LocationSlice/locationSlice';
const ImagePlan = ({ item }) => {
    const location = item.location.split(',');
    const locationSlice = useSelector((state) => state.locationSlice.location);
    const dispatch = useDispatch();

    // Check url location is equal to location return by api
    const handleCheckLocationIsEqual = () => {
        if (locationSlice.lat !== location[0] && locationSlice.lng !== location[1]) {
            dispatch(setLocation({ lat: location[0], lng: location[1] }));
        }
    };

    return (
        <div className="my-3 image-location">
            <Image
                src={item.imageHttp}
                loading="lazy"
                alt={`Ảnh quy hoạch ${item.id_quyhoach}`}
                className="image-item"
            />
            {!item && <Skeleton.Image active={true} />}
            <Button
                size="small"
                onClick={handleCheckLocationIsEqual}
                className="image-location-btn"
                icon={<EnvironmentOutlined />}
                iconPosition="end"
            >
                Đi tới
            </Button>
        </div>
    );
};

export default memo(ImagePlan);
