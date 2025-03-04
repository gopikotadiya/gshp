import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    // Simulate API call to backend for authentication
    setTimeout(() => {
      const { username, password } = values;
      // Mock roles based on username (replace with actual backend logic)
      let role = '';
      if (username === 'admin' && password === 'admin123') {
        role = 'admin';
      } else if (username === 'tenant' && password === 'tenant123') {
        role = 'tenant';
      } else if (username === 'landlord' && password === 'landlord123') {
        role = 'landlord';
      } else {
        message.error('Invalid credentials');
        setLoading(false);
        return;
      }
      localStorage.setItem('role', role); // Store role in localStorage
      message.success('Login successful');
      navigate(`/${role}/dashboard`); // Redirect to role-specific dashboard
      setLoading(false);
    }, 1000);
  };

  return (
    <Card title="Login" style={{ width: 300, margin: 'auto', marginTop: '50px' }}>
      <Form name="login" onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;