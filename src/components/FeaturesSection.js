import React from 'react';
import { Row, Col, Card } from 'antd';
import {
  SafetyOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import '../css/FeaturesSection.css';

const { Meta } = Card;

const FeaturesSection = () => {
  const features = [
    {
      title: 'Secure Housing',
      description: 'Find safe and verified student accommodations.',
      icon: <SafetyOutlined className="feature-icon" />,
    },
    {
      title: 'Roommate Matching',
      description: 'Connect with compatible roommates.',
      icon: <TeamOutlined className="feature-icon" />,
    },
    {
      title: 'Maintenance Support',
      description: '24/7 support for all your housing needs.',
      icon: <ToolOutlined className="feature-icon" />,
    },
  ];

  return (
    <div className="features-section">
      <h2 className="features-title">Why Choose Us?</h2>
      <Row gutter={[16, 16]} justify="center">
        {features.map((feature, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card hoverable className="feature-card">
              {feature.icon}
              <Meta title={feature.title} description={feature.description} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FeaturesSection;