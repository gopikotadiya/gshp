// Header.js
import React, { useState } from 'react';
import { Layout, Button, Avatar, Modal, Form, Input, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser, loginUser, registerUser } from '../redux/actions/authActions';
import '../css/Header.css';

const { Header } = Layout;
const { Option } = Select;

const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn, error } = useSelector((state) => state.auth);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  const handleRegister = (values) => {
    const { email, first_name, last_name, password, role } = values;
    const userData = { email, first_name, last_name, password, role };

    dispatch(registerUser(userData))
      .then(() => {
        // Automatically log in after successful registration
        return dispatch(loginUser(email, password));
      })
      .then(() => {
        message.success('Registration and login successful!');
        setIsRegisterModalVisible(false);
      })
      .catch((error) => {
        message.error(error || 'Registration failed. Please try again.');
      });
  };

  const handleLogin = (values) => {
    const { email, password } = values;
    dispatch(loginUser(email, password))
      .then(() => {
        message.success('Login successful!');
        setIsLoginModalVisible(false);
      })
      .catch((error) => {
        message.error(error || 'Login failed. Please try again.');
      });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };


  const getInitials = () => {
    console.log(user);
    if (!user || typeof user !== 'object') return '';
    const first = user.first_name?.charAt(0) || '';
    const last = user.last_name?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <Header className="header">
      <div className="logo">GSP - Global Student Housing</div>
      {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className="menu">
        <Menu.Item key="1" className="menu-item"><Link to="/">Home</Link></Menu.Item>
        <Menu.Item key="2" className="menu-item"><Link to="/about">About</Link></Menu.Item>
        <Menu.Item key="3" className="menu-item"><Link to="/contact">Contact</Link></Menu.Item>
      </Menu> */}
      <div className="auth-section">
        {isLoggedIn ? (
          <div className="user-profile">
            <Avatar className="avatar" style={{ backgroundColor: '#1890ff' }}>
              {getInitials()}
            </Avatar>
            <Button type="primary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Button className="login-button" variant="outlined" onClick={() => setIsLoginModalVisible(true)}>
              Login
            </Button>
            <Button className="register-button" variant="outlined" onClick={() => setIsRegisterModalVisible(true)}>
              Register
            </Button>
          </div>
        )}
      </div>
      <Modal
        title="Login"
        open={isLoginModalVisible}
        onCancel={() => {
          setIsLoginModalVisible(false);
          
        }}
        footer={null}
        className="login-modal"
      >
        <Form name="login" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
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
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Registration Modal */}
      <Modal
        title="Register"
        visible={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        footer={null}
      >
        <Form name="register" onFinish={handleRegister}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Invalid email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="first_name"
            rules={[
              { required: true, message: 'Please input your first name!' },
              { pattern: /^[A-Za-z]+$/, message: 'First name should contain only letters!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="last_name"
            rules={[
              { required: true, message: 'Please input your last name!' },
              { pattern: /^[A-Za-z]+$/, message: 'Last name should contain only letters!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

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
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="tenant">Tenant</Option>
              <Option value="landlord">Landlord</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  );
};

export default AppHeader;