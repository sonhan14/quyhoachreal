import './Login.scss'
import { Button, Checkbox, Divider, Form, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


const Login = () => {
  const navigate = useNavigate()
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    
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
              
              <h1 style={{marginBottom:'10px'}}>Đăng nhập</h1>
  
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
                <Input style={{
                  height:'40px'
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
                  height:'40px'
                }}/>
              </Form.Item>
  
              
  
              
  
              <Form.Item
                wrapperCol={{
                  span: 24,
                }}
                style={{
                    marginTop:'20px'
                }}
              >
                <Button style={{
                  height:'40px',
                  width:'120px',
                  
                }}  type="primary" htmlType="Đăng nhập" loading={isSubmit}>
                  Submit
                </Button >

                <Button style={{
                  height:'40px',
                  width:'120px',
                  marginLeft:'40px'
                }} htmlType="Đăng nhập" onClick={() => {
                  form.resetFields();
                }}>
                  Reset
                </Button >
              </Form.Item>
              
            <p style={{textAlign: 'center'}}>Bạn chưa có tài khoản <a style={{marginLeft:'3px', textDecoration:'underline';}} onClick={()=>{navigate('/register')}}>Đăng ký</a></p>
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