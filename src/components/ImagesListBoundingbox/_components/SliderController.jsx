import { DownOutlined, UpOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { memo } from 'react';

const SliderControls = ({ handleNext, handlePrev, isButtonHandle }) => {
    return (
        <div
            className={clsx({
                ['hidden']: isButtonHandle,
            })}
        >
            <UpOutlined onClick={handlePrev} className="slider-top-arrow" />
            <DownOutlined onClick={handleNext} className="slider-down-arrow" />
        </div>
    );
};

export default memo(SliderControls);
