import React, { useState } from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const TabComponent = ({ items }) => {
  const [activeKey, setActiveKey] = useState(items[0]?.key);

  return (
    <Tabs 
      activeKey={activeKey}
      onChange={setActiveKey}
      tabBarStyle={{ 
        paddingLeft: '24px', 
        background: '#fff',
        borderBottom: '0px solid #f0f0f0'
      }}
      tabBarGutter={12} 
      type="card"
    >
      {items.map(tab => (
        <TabPane
        key={tab.key}
        tab={tab.label} 
      >
        <div >
          {tab.content}
        </div>
      </TabPane>
      ))}
    </Tabs>
  );
};

export default TabComponent;