import { Modal } from 'antd';
import React, { memo } from 'react';
import ReactPlayer from 'react-player/youtube';

const VideoModal = ({ url, isModalOpen, handleCancel, handleOk }) => {
    return (
        <Modal
            open={isModalOpen}
            centered
            onOk={handleOk}
            width={'60vw'}
            height={'74vh'}
            onCancel={handleCancel}
            destroyOnClose
            footer={<></>}
            className="bg-transparent"
            
        >
            <ReactPlayer url={url} playing controls width="100%" height="70vh" className="react-player" />
        </Modal>
    );
};

export default memo(VideoModal);
