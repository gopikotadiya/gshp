import React from 'react';
import { Row, Col, Typography } from 'antd';
import '../css/HeroSection.css'; 

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  return (
    <div className="landing-container">
      <section className="landing-hero">
        <div className='hero-overlay'>
        
            <h1 className="hero-title">
              Your Home Away From Home Starts Here!
            </h1>
            <Paragraph className="hero-subtitle">
              Connecting students with perfect housing solutions worldwide
            </Paragraph>
                      
        </div>
      </section>

      <section id="search-section" className="landing-search">
        <Title level={2} className="section-title">Find Your Ideal Student Home</Title>
        <Paragraph type="secondary" className="section-subtitle">
          Browse verified listings, find roommates, and apply for apartments—all in one place!
        </Paragraph>
      </section>

      <section className="landing-landlords">
        <Row justify="center" align="middle">
          <Col xs={24} md={12} className="landlord-content">
            <Title level={2} className="section-title">Landlords: List Your Property Today!</Title>
            <Paragraph type="secondary" className="section-subtitle">
              Reach thousands of students looking for quality housing. Manage properties and applications effortlessly.
            </Paragraph>
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default HeroSection;