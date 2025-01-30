import React from 'react';
import AppHeader from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AppFooter from '../components/Footer';

const LandingPage = () => {
  return (
    <div>
      <AppHeader />
      <HeroSection />
      <FeaturesSection />
      <AppFooter />
    </div>
  );
};

export default LandingPage;