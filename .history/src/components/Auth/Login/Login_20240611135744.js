import './Login.scss'
import { Button, Checkbox, Divider, Form, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';

const Login = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch()

//   const handleClickRegister = () => {
//       handleClose()
//       navigate('/register')
//   }
  const onFinish = async (values) => {
    const {username, password} = values;
    setIsSubmit(true);
    const res = await callLogin(username, password);
    setIsSubmit(false);
    console.log("res",res)
    if(res?.data) {
      localStorage.setItem('access_token',res.data.access_token)
      dispatch(doLoginAction(res.data.user))
      message.success('Đăng nhập tài khoản thành công!');
      navigate('/')
    }else{
      notification.error({
        message:'Có lỗi xáy ra',
        description:
          res.message && Array.isArray(res.message) ? res.message[0] :res.message[1],
        duration: 5
      })
    }
  }
  return (
   <>
      <div className="login">
        <Form
              form={form}
              name="basic"
              className="login-form"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 24,
              }}
              style={{
                maxWidth: 400,
                margin: '0 auto'
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              
              <h2 style={{marginBottom:'10px'}}>Đăng nhập</h2>
  
              <Form.Item
                labelCol={{
                  span: 24,
                }}
   
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input style={{
                  height:'40px',
                  marginTop:'-6px'

                }} />
              </Form.Item>
  
              <Form.Item
                labelCol={{
                  span: 24,
                }}            
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password style={{
                  height:'40px',
                  marginTop:'-10px',
                }}/>
              </Form.Item>
  
              
  
              
  
              <Form.Item
                wrapperCol={{
                  span: 24,
                }}
                style={{
                    marginTop:'30px'
                }}
              >
                <Button style={{
                  height:'40px',
                  width:'120px',
                  
                }}  type="primary" htmlType="Đăng nhập" loading={isSubmit}>
                  Đăng nhập
                </Button >

                <Button style={{
                  height:'40px',
                  width:'120px',
                  marginLeft:'40px'
                }} htmlType="Đăng nhập" onClick={() => {
                  form.resetFields();
                }}>
                  Quên mật khẩu
                </Button >
              </Form.Item>
              
            <p style={{textAlign: 'center'}}>Bạn chưa có tài khoản <a style={{marginLeft:'3px', textDecoration:'underline'}} onClick={()=>{navigate('/register')}}>Đăng ký</a></p>
            </Form>
        
    </div>

      {/* <div className="register-page" >
          <h3 style={{textAlign: 'center'}}>Đăng ký người dùng mới</h3>
          <Divider/>
          <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 24,
              }}
              style={{
                maxWidth: 400,
                margin: '0 auto'
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              
  
              <Form.Item
                labelCol={{
                  span: 24,
                }}
                label="email"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
  
              <Form.Item
                labelCol={{
                  span: 24,
                }}            
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
  
              
  
              
  
              <Form.Item
                wrapperCol={{
                  offset: 10,
                  span: 24,
                }}
              >
                <Button type="primary" htmlType="Đăng nhập" loading={isSubmit}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
  
          <h3 style={{textAlign: 'center'}}>Bạn chưa có tài khoản <span onClick={()=>{navigate('/register')}}>Đăng ký</span></h3>
  
    </div> */}
   </>
  )

    
};
export default Login;