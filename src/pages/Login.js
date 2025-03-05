// src/pages/Login.js
import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/actions/authActions';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // React Router's navigate function

  const [error, setError] = useState(null);
  const onFinish = (values) => {
    const { email, password } = values;
    dispatch(loginUser(email, password))
      .then(() => {
        message.success('Login successful!');
        setError(null);
        navigate('/');
      })
      .catch((error) => {
        message.error(error || 'Login failed. Please try again.');
        setError(error || 'Login failed. Please try again.');
        console.log(error);
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
        {error && <div className="error-message">{error}</div>}
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