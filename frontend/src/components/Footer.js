import React from 'react';
import { Layout, Row, Col } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import '../css/Footer.css';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="footer">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <h3>Quick Links</h3>
          <p><a href="/privacy-policy">Privacy Policy</a></p>
          <p><a href="/terms-of-service">Terms of Service</a></p>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <h3>Contact Us</h3>
          <p>Email: support@gsp.com</p>
          <p>Phone: +1 234 567 890</p>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com">
              <FacebookOutlined />
            </a>
            <a href="https://twitter.com">
              <TwitterOutlined />
            </a>
            <a href="https://instagram.com">
              <InstagramOutlined />
            </a>
          </div>
        </Col>
      </Row>
      <p style={{ marginTop: '20px' }}>
        GSP - Global Student Housing Platform ©2023
      </p>
    </Footer>
  );
};

export default AppFooter;