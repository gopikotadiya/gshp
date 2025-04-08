import React from 'react';
import { Table, Tag } from 'antd';
import TableComponent from '../TableComponent';
import TabComponent from '../TabComponent';

const MaintenanceBackground = () => {
  const maintenanceColumns = [
    {
      title: 'Apartment',
      dataIndex: ['apartment', 'address'],
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Urgency',
      render: (_, record) => (
        <Tag color={
          record.urgency === 'high' ? 'red' : 
          record.urgency === 'medium' ? 'orange' : 'green'
        }>
          {record.urgency}
        </Tag>
      ),
    },
    {
      title: 'Status',
      render: (_, record) => (
        <Tag color={
          record.status === 'completed' ? 'green' :
          record.status === 'in_progress' ? 'blue' : 'orange'
        }>
          {record.status}
        </Tag>
      ),
    },
  ];

  const bgCheckColumns = [
    {
      title: 'Tenant',
      dataIndex: ['tenant', 'name'],
    },
    {
      title: 'Status',
      render: (_, record) => (
        <Tag color={record.status === 'approved' ? 'green' : 'red'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'Report',
      render: (_, record) => (
        <a href={record.report_url} target="_blank" rel="noopener noreferrer">
          View Report
        </a>
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Maintenance Requests',
      content: <TableComponent columns={maintenanceColumns} dataSource={[]} />,
    },
    {
      key: '2',
      label: 'Background Checks',
      content: <TableComponent columns={bgCheckColumns} dataSource={[]} />,
    },
  ];

  return (
    <div style={{ padding: '42px' }}> 
        <TabComponent items={tabItems} />
    </div>
  );
};

export default MaintenanceBackground;