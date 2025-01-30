import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import '../css/Header.css';

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header className="header">
      <div className="logo">GSP - Global Student Housing</div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} className="menu">
        <Menu.Item key="1" className="menu-item"><Link to="/">Home</Link></Menu.Item>
        <Menu.Item key="2" className="menu-item"><Link to="/about">About</Link></Menu.Item>
        <Menu.Item key="3" className="menu-item"><Link to="/contact">Contact</Link></Menu.Item>
      </Menu>
      <div>
        <Button type="primary" className="login-button">
          <Link to="/login">Login</Link>
        </Button>
        <Button type="default">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader;