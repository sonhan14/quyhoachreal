import './Register.scss';
import { Button, Form, Input, message, Modal, notification, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { callLogin, callRegister } from '../../../services/api';
import axios from 'axios';
import { Address6 } from 'ip-address';
// import { doLoginAction } from '../../../redux/account/accountSlice';
// import { useDispatch } from 'react-redux';

const Register = () => {
    // const dispatch = useDispatch();
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [Latitude, setLatitude] = useState(null);
    const [Longitude, setLongitude] = useState(null);
    const [ipAddress, setIpAddress] = useState('');
    const AvatarLink = null;
    const [isCheckEmail, setIsCheckEmail] = useState(false);

    //
    useEffect(() => {
        //Lấy tọa độ người dùng
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error('Error fetching geolocation', error);
                },
            );
        }

        //Lấy Ip người dùng
        axios
            .get('https://api64.ipify.org?format=json')
            .then((response) => {
                // setIpAddress(ip(response.data.ip))
                let userIP = response.data.ip;
                if (Address6.isValid(userIP)) {
                    try {
                        const address = new Address6(userIP);
                        userIP = address.to4().address;
                    } catch (error) {
                        console.error('Error convering IPv6 to IPv4', error);
                    }
                }
                setIpAddress(userIP);
            })
            .catch((error) => {
                console.error('Error fetching IP address', error);
            });
    }, []);

    const onFinish = async (values) => {
        const { Username, Fullname, Password, Gender, Email } = values;
        setIsSubmit(true);
        try {
            //call api
            const res = await callRegister(
                Username,
                Fullname,
                Password,
                Gender,
                Latitude,
                Longitude,
                AvatarLink,
                ipAddress,
                Email,
            );
            setIsSubmit(false);

            if (res) {
                setIsCheckEmail(true);
            } else {
                message.error('Account registration error, Please register again');
            }
        } catch (error) {
            setIsSubmit(false);
            console.error('An error occurred ', error);
            notification.error({
                message: 'Error',
                description: error.message && Array.isArray(error.message) ? error.message[0] : error.message,
                duration: 5,
            });
        }
    };

    return (
        <>
            <Modal
                title="Thông báo"
                open={isCheckEmail}
                onOk={() => {
                    setIsCheckEmail(false);
                    navigate('/login');
                }}
                onCancel={() => setIsCheckEmail(false)}
            >
                <p>Đăng ký thành công, vui lòng kiểm tra email để xác nhận tài khoản</p>
            </Modal>
            <div className="login">
                <Form
                    form={form}
                    name="basic"
                    className="login-form"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: 400, margin: '0 auto' }}
                    // initialValues={{
                    //   Gender: "Nam",
                    //   Latitude: 10.54,
                    //   Longitude: 20.435,
                    //   LastLoginIP: "127.0.0.1",
                    //   AvatarLink: "null"
                    // }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <h2 style={{ marginBottom: '10px' }}>Đăng Ký</h2>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Username"
                        name="Username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input style={{ height: '40px', marginTop: '-6px' }} />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Fullname"
                        name="Fullname"
                        rules={[{ required: true, message: 'Please input your fullname!' }]}
                    >
                        <Input style={{ height: '40px', marginTop: '-6px' }} />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="Email"
                        rules={[{ required: true, message: 'Please input your Email!' }]}
                    >
                        <Input style={{ height: '40px', marginTop: '-6px' }} />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Password"
                        name="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password style={{ height: '40px', marginTop: '-10px' }} />
                    </Form.Item>

                    {/* Hidden Fields */}
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Gender"
                        name="Gender"
                        rules={[{ required: true, message: 'Please select your Gender!' }]}
                    >
                        <Radio.Group>
                            <Radio value="Nam">Nam</Radio>
                            <Radio value="Nữ">Nữ</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {/* <Form.Item name="Latitude" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="Longitude" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="AvatarLink" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="LastLoginIP" hidden>
            <Input />
          </Form.Item> */}

                    <Form.Item wrapperCol={{ span: 24 }} style={{ marginTop: '30px' }}>
                        <Button
                            style={{ height: '40px', width: '120px' }}
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                        >
                            Đăng ký
                        </Button>

                        <Button
                            style={{ height: '40px', width: '120px', marginLeft: '40px' }}
                            onClick={() => form.resetFields()}
                        >
                            Quên mật khẩu
                        </Button>
                    </Form.Item>

                    <p style={{ textAlign: 'center' }}>
                        Bạn đã có tài khoản{' '}
                        <a
                            style={{ marginLeft: '3px', textDecoration: 'underline' }}
                            onClick={() => {
                                navigate('/login');
                            }}
                        >
                            Đăng nhập
                        </a>
                    </p>
                </Form>
            </div>
        </>
    );
};

export default Register;
