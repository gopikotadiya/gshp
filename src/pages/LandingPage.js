import React, { useState } from 'react';
import AppHeader from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AppFooter from '../components/Footer';
import ListApartment from '../components/landlord/ListApartment';
import RentedApartment from '../components/landlord/RentedApartment';

const LandingPage = () => {
  const [activeComponent, setActiveComponent] = useState('home');
  let mainComponent;
  const handleMenuClick = menu => {
    setActiveComponent(menu.key);
  };

  const getComponent = () => {
    switch(activeComponent) {
      case 'list-property':
        return <ListApartment />;
      case 'rental-insights':
        return <RentedApartment />;
      case 'home':
        return <HeroSection />;
      default:
        return <HeroSection />;
    }
  };

  const handleLogoClick = () => {
    setActiveComponent('home');
  };
  
  return (
    <div>
      <AppHeader handleClick={handleMenuClick} onLogoClick={handleLogoClick}/>
      {getComponent()}
      <FeaturesSection />
      <AppFooter />
    </div>
  );
};

export default LandingPage;