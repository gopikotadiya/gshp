import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
  const onFinish = (values) => {
    console.log('Received values:', values);
    // Here you can make a POST request with the form data
    // Example: axios.post('/api/login', values);
  };

  return (
    <Card title="Login" style={{ width: 300, margin: 'auto', marginTop: '50px' }}>
      <Form name="login" onFinish={onFinish}>
        {/* Email Field */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters long!' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;