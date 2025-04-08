// Header.js
import React, { useState } from 'react';
import { Layout, Button, Avatar, Modal, Form, Input, message, Select, Menu } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, FormOutlined, BarChartOutlined, FormatPainterOutlined, HomeOutlined, HomeFilled, SettingOutlined, SettingFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser, loginUser, registerUser } from '../redux/actions/authActions';
import '../css/Header.css';

const { Header } = Layout;
const { Option } = Select;

const AppHeader = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn, error } = useSelector((state) => state.auth);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const { handleClick, onLogoClick } = props;

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
    window.location.reload();
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
      <div className="logo" onClick={onLogoClick} >
        GSP - Global Student Housing
      </div>
      <Menu
        mode="horizontal"
        className="nav-menu"
        selectedKeys={[]}
        style={{ borderBottom: 'none', background: 'transparent' }}
      >
        {isLoggedIn && user?.role === 'landlord' && (
          <>
            <Menu.Item key="list-property" icon={<HomeFilled />} onClick={handleClick}> 
              List a Property
            </Menu.Item>
            <Menu.Item className="ant-menu-item-divider" key="divider" disabled style={{ cursor: 'default' }}>
              |
            </Menu.Item>
            <Menu.Item key="rental-insights" onClick={handleClick}>
              Rental Insights
            </Menu.Item>
          </>
        )}

        {isLoggedIn && user?.role === 'tenant' && (
          <>
            <Menu.Item key="explore-apartments" icon={<HomeFilled />} onClick={handleClick}>
              Explore Apartments
            </Menu.Item>
            <Menu.Item className="ant-menu-item-divider" key="divider3" disabled style={{ cursor: 'default' }}>
              |
            </Menu.Item>
            <Menu.Item key="find-roommate" onClick={handleClick}>
              Find Your Roommate
            </Menu.Item>
            <Menu.Item className="ant-menu-item-divider" key="divider4" disabled style={{ cursor: 'default' }}>
              |
            </Menu.Item>
            <Menu.Item key="rental-hub" onClick={handleClick}>
              My Rental Hub
            </Menu.Item>
          </>
        )}

        {isLoggedIn && user?.role === 'admin' && (
          <>
            <Menu.Item key="system-management" icon={<SettingFilled />} onClick={handleClick}>
              System Management
            </Menu.Item>
            <Menu.Item className="ant-menu-item-divider" key="divider5" disabled style={{ cursor: 'default' }}>
              |
            </Menu.Item>
            <Menu.Item key="approval-requests" onClick={handleClick}>
              Approval Requests
            </Menu.Item>
            <Menu.Item className="ant-menu-item-divider" key="divider6" disabled style={{ cursor: 'default' }}>
              |
            </Menu.Item>
            <Menu.Item key="background-maintenance" onClick={handleClick}>
              Background & Maintenance
            </Menu.Item>
          </>
        )}
      </Menu>
      <div className="auth-section">
        {isLoggedIn ? (
          <div className="user-profile">
            <Avatar className="avatar">
              {getInitials()}
            </Avatar>
            <Button className="login-button" variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <Button onClick={() => setIsLoginModalVisible(true)}>
              Login
            </Button>
            <Button onClick={() => setIsRegisterModalVisible(true)}>
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
          <Form.Item className="blue-btn">
            <Button htmlType="submit" block>
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
        className="login-modal"
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

          <Form.Item className="blue-btn">
            <Button htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  );
};

export default AppHeader;