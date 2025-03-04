// src/pages/Login.js
import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/actions/authActions';

const Login = () => {
  const dispatch = useDispatch();

  const onFinish = (values) => {
    const { email, password } = values;
    dispatch(loginUser(email, password))
      .then(() => {
        message.success('Login successful!');
      })
      .catch((error) => {
        message.error(error || 'Login failed. Please try again.');
      });
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