import React from 'react';
import { Row, Col, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../css/HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-section">
      <h1 className="hero-title">Find Your Perfect Student Housing</h1>
      <Row justify="center" gutter={[16, 16]}>
        <Col xs={24} sm={18} md={12} lg={8}>
          <Input
            placeholder="Enter location"
            size="large"
            className="search-input"
          />
        </Col>
        <Col xs={24} sm={18} md={12} lg={8}>
          <Input
            placeholder="Budget"
            size="large"
            className="search-input"
          />
        </Col>
        <Col xs={24} sm={18} md={12} lg={8}>
          <Input
            placeholder="Room Type"
            size="large"
            className="search-input"
          />
        </Col>
      </Row>
      <Button type="primary" icon={<SearchOutlined />} size="large">
        Search
      </Button>
    </div>
  );
};

export default HeroSection;