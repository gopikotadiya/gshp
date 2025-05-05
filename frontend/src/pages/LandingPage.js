import React, { useState } from 'react';
import AppHeader from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AppFooter from '../components/Footer';
import ListApartment from '../components/landlord/ListApartment';
import RentedApartment from '../components/landlord/RentedApartment';
import ExploreApartments from '../components/tenants/ExploreApartments';
import FindRoommates from '../components/tenants/FindRoommates';
import ApprovalRequests from '../components/admin/ApprovalRequests';
import MaintenanceBackground from '../components/admin/MaintenanceBackground';
import SystemManagement from '../components/admin/SystemManagement';
import RentalHub from '../components/tenants/RentalHub';

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
      case 'explore-apartments' :
        return <ExploreApartments />
      case 'find-roommate' :
        return <FindRoommates />
        case 'rental-hub':
          return <RentalHub />;
      case 'system-management':
        return <SystemManagement />;
      case 'approval-requests':
        return <ApprovalRequests />;
      case 'background-maintenance':
        return <MaintenanceBackground />;
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