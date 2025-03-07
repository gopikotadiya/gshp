// pages/Register.js
import React from 'react';
import { Form, Input, Button, Card, Select, message } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // For redirection
import { registerUser } from '../redux/actions/authActions'; // Adjust the import path as needed

const { Option } = Select;

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation

  const onFinish = (values) => {
    console.log("Form submitted")
    const { email, first_name, last_name, password, role } = values;
    const userData = { email, first_name, last_name, password, role };

    dispatch(registerUser(userData))
      .then(() => {
        message.success('Registration successful!');
        navigate('/'); // Redirect to the landing page
      })
      .catch((error) => {
        message.error(error || 'Registration failed. Please try again.');
      });
  };

  return (
    <Card title="Register" style={{ width: 300, margin: 'auto', marginTop: '50px' }}>
      <Form name="register" onFinish={onFinish}>
        {/* Email Field */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        {/* First Name Field */}
        <Form.Item
          name="first_name"
          rules={[
            { required: true, message: 'Please input your first name!' },
            { pattern: /^[A-Za-z]+$/, message: 'First name should contain only letters!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="First Name" />
        </Form.Item>

        {/* Last Name Field */}
        <Form.Item
          name="last_name"
          rules={[
            { required: true, message: 'Please input your last name!' },
            { pattern: /^[A-Za-z]+$/, message: 'Last name should contain only letters!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Last Name" />
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

        {/* Confirm Password Field */}
        <Form.Item
          name="confirm_password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
        </Form.Item>

        {/* Role Field */}
        <Form.Item
          name="role"
          rules={[{ required: true, message: 'Please select your role!' }]}
        >
          <Select placeholder="Select a role">
            <Option value="admin">Admin</Option>
            <Option value="tenant">Tenant</Option>
            <Option value="landlord">Landlord</Option>
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Registration;