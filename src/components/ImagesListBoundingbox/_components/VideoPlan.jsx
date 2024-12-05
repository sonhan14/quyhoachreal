import { EnvironmentOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../../../redux/LocationSlice/locationSlice';
import YoutubeThumbnail from './YoutubeThumbnail';
const ImagePlan = ({ item, openModalVideo }) => {
    const location = item.location.split(',');
    const locationSlice = useSelector((state) => state.locationSlice.location);
    const dispatch = useDispatch();
    let videoId = '';
    const url = item.imageHttp;

    // Check url location is equal to location return by api
    const handleCheckLocationIsEqual = (e) => {
        e.stopPropagation();
        if (locationSlice.lat !== location[0] && locationSlice.lng !== location[1]) {
            dispatch(setLocation({ lat: location[0], lng: location[1] }));
        }
    };

    if (url.includes('watch')) {
        // url example https://www.youtube.com/watch?v=SCM0xI64Peo
        videoId = url.split('=')?.[1];
    } else {
        // url example https://youtu.be/_MZ5y8wMAEk?si=GLhVAnNzifan0hJ3o
        videoId = url.split('/')?.[3].split('?')?.[0];
    }

    return (
        <div className="my-3 image-location" onClick={() => openModalVideo(url)}>
            <YoutubeThumbnail youtubeId={videoId} />
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
