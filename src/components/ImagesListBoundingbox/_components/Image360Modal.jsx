import { Modal } from 'antd';
import React, { memo } from 'react';
import ReactPannellum from 'react-pannellum';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';

const Image360Modal = ({ imageUrl, isModalOpen, handleCancel, handleOk }) => {
    const origin = window.location.origin;
    console.log(imageUrl);
    const headers = {
        method: 'GET',
        Referer: 'http://localhost:3000',
        Origin: 'http://localhost:3000/',
        Accept: 'image/*',
        'Content-Type': 'image/jpg',
    };

    return (
        <Modal open={isModalOpen} onOk={handleOk} width={'70vw'} centered onCancel={handleCancel} footer={<></>}>
            <div
                style={{
                    width: '100%',
                    height: '80vh',
                    padding: '0 12px',
                }}
            >
                <ReactPhotoSphereViewer
                    src={imageUrl}
                    requestHeaders={headers}
                    height={'100%'}
                    width={'100%'}
                    navbar={false}
                />
                {/* <ReactPannellum
                    id="1"
                    sceneId="firstScene"
                    imageSource={`${imageUrl}`}
                /> */}

                {/* <img src={laiBaoKhongDuocNuaDi} alt="" width={'100%'} height={'100%'} /> */}
            </div>
        </Modal>
    );
};

export default memo(Image360Modal);
