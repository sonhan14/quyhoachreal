import React, { useEffect, useState } from 'react';
import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UpdateBox, UpdateComment, UpdateGroup } from '../../../services/api';
import { useSelector } from 'react-redux';
const CommentModalUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const idBoxAdmin = useSelector((state) => state.getid.idGroup);
    const adGroupAdmin = useSelector((state) => state.getid.idPost);
    const [initForm, setInitForm] = useState(null);
    useEffect(() => {
        if (dataUpdate?.CommentID) {
            const init = {
                CommentID: dataUpdate.CommentID,
                Content: dataUpdate.Content,
                PhotoURL: null,
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
        const { CommentID, Content, PhotoURL } = values;
        // // const thumbnail = dataThumbnail[0].name;
        // // const slider = dataSlider.map((item)=> {item.name})

        // setIsSubmit(true)
        const res = await UpdateComment(CommentID, Content, PhotoURL);
        res.headers = {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        };
        if (res) {
            message.success('Update comment thành công');
            form.resetFields();
            setOpenModalUpdate(false);
            await props.getListViewComment();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            });
        }

        // setIsSubmit(false)
    };

    return (
        <>
            <Modal
                title="Update Comment"
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
                                label="CommentID"
                                name="CommentID"
                                rules={[{ required: true, message: 'Vui lòng nhập id!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Content"
                                name="Content"
                                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                hidden
                                labelCol={{ span: 24 }}
                                label="PhotoURL"
                                name="PhotoURL"
                                // rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        {/* <Col span={24}>
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
                        </Col> */}

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

export default CommentModalUpdate;
