import React from 'react';
import { Tabs } from 'antd';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';

const { TabPane } = Tabs;

const NavigationTabs = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Home" key="1">
        <Home />
      </TabPane>
      <TabPane tab="About" key="2">
        <About />
      </TabPane>
      <TabPane tab="Contact" key="3">
        <Contact />
      </TabPane>
    </Tabs>
  );
};

export default NavigationTabs;