import './Register.scss'

import { Button, Checkbox, Divider, Form, Input, message, notification } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const {fullname, email, password, phone} = values;
    
  }
  return (

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
              
              <h1 style={{marginBottom:'10px'}}>Đăng ký tài khoản</h1>
  
          <Form.Item
            labelCol={{
              span: 24,
            }}
            label="Tên đăng nhập"
            name="fullname"
            rules={[
              {
                required: true,
                message: 'Please input your fullname!',
              },
            ]}
            
          >
            <Input style={{height:'40px', marginTop:'-6px'}}/>
          </Form.Item>


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
            <Input style={{height:'40px', marginTop:'-10px'}} />
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 24,
            }}            
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password style={{height:'40px', marginTop:'-10px'}} />
          </Form.Item>

          <Form.Item
            labelCol={{
              span: 24,
            }}            
            label="Xác nhận mật khẩu"
            name="passwordConfirm"
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
            ]}
          >
            <Input.Password style={{height:'40px', marginTop:'-10px'}} />
          </Form.Item>

              <Form.Item
                wrapperCol={{
                  span: 24,
                }}
                style={{
                }}
                
              >
                <Button type="primary" className='button-register'  htmlType="Đăng ký" loading={isSubmit}>
                  Đăng ký
                </Button >

              </Form.Item>
              
              <p style={{textAlign: 'center'}}>Bạn đã có tài khoản <a onClick={()=>{navigate('/login')}}>Đăng nhập</a></p>
        </Form>
    </div>


      
  )
  
    
}
export default RegisterPage;