import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Header.css';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Header className="header">
      <div className="logo">GSP - Global Student Housing</div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className="menu">
        <Menu.Item key="1" className="menu-item"><Link to="/">Home</Link></Menu.Item>
        <Menu.Item key="2" className="menu-item"><Link to="/about">About</Link></Menu.Item>
        <Menu.Item key="3" className="menu-item"><Link to="/contact">Contact</Link></Menu.Item>
      </Menu>
      <div>
        {role && (
          <Button type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;