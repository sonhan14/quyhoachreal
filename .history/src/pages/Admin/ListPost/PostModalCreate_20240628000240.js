import React, { useEffect, useState } from 'react';
import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { CreateBox, CreateGroup, CreatePost,  } from '../../../services/api';
import { useSelector } from 'react-redux';
const PostModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate, getListViewPost } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [listCategory, setListCategory] = useState([])
    const [form] = Form.useForm();

    const idBox = useSelector((state) => state.getid.idGroup);
    console.log("res redux create idBox",idBox)
    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [imageUrl, setImageUrl] = useState("");

    const [dataThumbnail, setDataThumbnail] = useState([])
    const [dataSlider, setDataSlider] = useState([])

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [postLatitude, setPostLatitude] = useState(null);
    const [postLongitude, setPostLongitude] = useState(null);

    

    const onFinish = async (values) => {
        // console.log(">>> check values: ", values);
        // console.log(">>> check data thumbnail: ", dataThumbnail);
        // console.log(">>> check data slider: ", dataSlider);

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
        const {GroupID, Title, Content, PostLatitude , PostLongitude} = values;
        console.log(">>> check values Group: ", values);

        // const thumbnail = dataThumbnail[0].name;
        // const slider = dataSlider.map((item)=> {item.name})

        setIsSubmit(true)
        const res = await CreatePost( GroupID, Title, Content, PostLatitude , PostLongitude)
        res.headers= {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
        if (res) {  
            
            message.success('Thêm mới Post thành công');
            form.resetFields();
            setOpenModalCreate(false);
            await props.getListViewPost()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
        
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
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(x => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    }

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
                title="Thêm mới Post"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalCreate(false)
                }}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={"50vw"}
                //do not close when click fetchBook
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    
                >
                    <Row gutter={15}>
                        {/* <Col hidden>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                hidden
                                label="GroupID"
                                name="idBox"
                                rules={[{ required: true, message: 'Vui lòng nhập id!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col> */}
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên Group"
                                name="GroupName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên box!' }]}
                            >
                                <Input  />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mô tả"
                                name="Description"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
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
            {/* <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal> */}
        </>
    );
};

export default PostModalCreate;