import { ConfigProvider, Tabs } from 'antd';
import React from 'react';
import All360ImageList from './_components/AllI360mageList';
import AllImageList from './_components/AllImageList';
import AllVideoList from './_components/AllVideoList';

const ImageList = ({ children, isShowImagesList }) => {
    const items = [
        {
            key: '1',
            label: 'Ảnh',
            children: <AllImageList />,
        },
        {
            key: '2',
            label: '360',
            children: <All360ImageList />,
        },
        {
            key: '3',
            label: 'Video',
            children: <AllVideoList />,
        },
    ];

    return (
        <div className={`images-list-wrapper ${isShowImagesList ? 'open user-select-none pointer-events-none' : ''}`}>
            <ConfigProvider
                theme={{
                    components: {
                        Tabs: {
                            cardBg: '#fff',
                        },
                    },
                }}
            >
                <Tabs defaultActiveKey="1" items={items} className="images-list-tab" />
            </ConfigProvider>
            {children}
        </div>
    );
};

export default ImageList;
