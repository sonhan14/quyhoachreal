import React, { useEffect, useState } from 'react';
import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UpdateBox } from '../../../services/api';
const BoxModalUpdate = (props) => {
    const { openModalCreate, setOpenModalCreate, getListViewBox } = props;
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [listCategory, setListCategory] = useState([]);
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [imageUrl, setImageUrl] = useState('');

    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [initForm, setInitForm] = useState(null);

    useEffect(() => {
        if (dataUpdate?.BoxID) {
            const init = {
                BoxID: dataUpdate.BoxID,
                BoxName: dataUpdate.BoxName,
                Description: dataUpdate.Description,
                avatarLink: dataUpdate.avatarLink,
            };
            setInitForm(init);
            form.setFieldsValue(init);
        }
        return () => {
            form.resetFields();
        };
    }, [dataUpdate]);

    const onFinish = async (values) => {
        // return;
        // if(dataThumbnail.length === 0) {
        //     notification.error({
        //         message:'Lỗi validate',
        //         description: 'Vui lòng upload ảnh thumbnail'
        //     })
        //     return;
        // }

        // if(dataSlider.length === 0) {
        //     notification.error({
        //         message:'Lỗi validate',
        //         description: 'Vui lòng upload ảnh Slider'
        //     })
        //     return;
        // }
        const { BoxID, BoxName, Description, avatarLink } = values;
        // const thumbnail = dataThumbnail[0].name;
        // const slider = dataSlider.map((item)=> {item.name})

        setIsSubmit(true);
        // const res = await UpdateBox(BoxID, BoxName, Description, avatarLink);
        // res.headers= {
        //     'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        // }

        const token = localStorage.getItem('access_token');
        if (!token) {
            notification.error({
                message: 'Lỗi xác thực',
                description: 'Không tìm thấy token. Vui lòng đăng nhập lại.',
            });
            return;
        }

        const res = await UpdateBox(BoxID, BoxName, Description, avatarLink, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res) {
            message.success('Update box thành công');
            form.resetFields();
            setOpenModalUpdate(false);
            await props.getListViewBox();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }
        setIsSubmit(false);
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        // const res = await callUploadBookImg(file);
        // if (res && res.data) {
        //     setDataThumbnail([{
        //         name: res.data.fileUploaded,
        //         uid: file.uid
        //     }])
        //     onSuccess('ok')
        // } else {
        //     onError('Đã có lỗi khi upload file');
        // }
    };

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        // const res = await callUploadBookImg(file);
        // if (res && res.data) {
        //     //copy previous state => upload multiple images
        //     setDataSlider((dataSlider) => [...dataSlider, {
        //         name: res.data.fileUploaded,
        //         uid: file.uid
        //     }])
        //     onSuccess('ok')
        // } else {
        //     onError('Đã có lỗi khi upload file');
        // }
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([]);
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    };

    const handlePreview = async (file) => {
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    return (
        <>
            <Modal
                title="Update Box"
                open={openModalUpdate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalUpdate(false);
                }}
                okText={'Update'}
                cancelText={'Hủy'}
                confirmLoading={isSubmit}
                width={'50vw'}
                //do not close when click fetchBook
                maskClosable={false}
            >
                <Divider />

                <Form form={form} name="basic" onFinish={onFinish} autoComplete="off">
                    <Row gutter={15}>
                        <Col hidden>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                hidden
                                label="BoxID"
                                name="BoxID"
                                rules={[{ required: true, message: 'Vui lòng nhập id!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên Box"
                                name="BoxName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mô tả"
                                name="Description"
                                rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Avatar"
                                name="avatarLink"
                                rules={[{ required: true, message: 'Vui lòng nhập avatar!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        {/* <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                        </Col> */}
                    </Row>
                </Form>
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default BoxModalUpdate;
