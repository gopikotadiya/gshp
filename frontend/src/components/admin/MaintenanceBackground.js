import React, { useState, useEffect } from 'react';
import { Tag, Spin, Alert, Modal, Button, message } from 'antd';
import TableComponent from '../TableComponent';
import TabComponent from '../TabComponent';
import { getUsformatedDate } from '../../utils/auth';

const MaintenanceBackground = () => {
  const [backgroundChecks, setBackgroundChecks] = useState([]);
  const [loadingBackground, setLoadingBackground] = useState(false);
  const [errorBackground, setErrorBackground] = useState(null);
  const [selectedBgCheck, setSelectedBgCheck] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBackgroundChecks, setFilteredBackgroundChecks] = useState([]);

  useEffect(() => {
      filterApplications();
    }, [searchTerm, statusFilter, backgroundChecks]);

  const fetchBackgroundChecks = async () => {
    try {
      setLoadingBackground(true);
      const response = await fetch('http://127.0.0.1:8000/background-checks/?skip=0&limit=100');
      if (!response.ok) throw new Error('Failed to fetch background checks');
      const data = await response.json();
      setBackgroundChecks(data);
      setFilteredBackgroundChecks(data);
    } catch (err) {
      setErrorBackground(err.message);
      message.error(err.message);
    } finally {
      setLoadingBackground(false);
    }
  };

  useEffect(() => {
    fetchBackgroundChecks();
  }, []);

  const filterApplications = () => {
  let filtered = backgroundChecks.filter(app => {
    const tenantName = `${app.tenant.first_name} ${app.tenant.last_name}`.toLowerCase();
    const matchesSearch = tenantName.includes(searchTerm.toLowerCase()) ||
      app.apartment.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  setFilteredBackgroundChecks(filtered);
};

  const handleStatusUpdate = async (status) => {
    if (!selectedBgCheck) return;
    
    try {
      setProcessing(true);
      const response = await fetch(`http://127.0.0.1:8000/background-checks/${selectedBgCheck.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update background check status');

      await response.json();
      message.success(`Background check ${status} successfully`);
      fetchBackgroundChecks();
      setSelectedBgCheck(null);
    } catch (err) {
      message.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const bgCheckColumns = [
    {
      title: 'Tenant',
      render: (_, record) => `${record.tenant.first_name} ${record.tenant.last_name}`,
    },
    {
      title: 'Contact',
      render: (_, record) => record.tenant.email,
    },
    {
      title: 'Apartment',
      render: (_, record) => record.apartment.address,
    },
    {
      title: 'Lease Duration',
      render: (_, record) => `${record.application.lease_duration} months`,
      sorter: (a, b) => a.application.lease_duration - b.application.lease_duration,
    },
    {
      title: 'Move-in Date',
      render: (_, record) => getUsformatedDate(record.application.desired_move_in_date),
      sorter: (a, b) => new Date(a.application.desired_move_in_date) - new Date(b.application.desired_move_in_date),
    },
    {
      title: 'Status',
      render: (_, record) => (
        <Tag color={record.status === 'approved' ? 'green' : record.status === 'pending' ? 'orange' : 'red'}>
          {record.status.replace(/_/g, ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        record.status === 'pending' && (
          <Button onClick={() => setSelectedBgCheck(record)}>Review</Button>
        )
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Background Checks',
      content: (
        <TableComponent
          columns={bgCheckColumns}
          data={filteredBackgroundChecks}
          filterOptions={[
            { value: 'all', label: 'All Statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
          onSearch={setSearchTerm}
          onFilterChange={setStatusFilter}
          loading={loadingBackground}
          error={errorBackground}
        />
      ),
    },
    {
      key: '2',
      label: 'Maintenance Requests',
      content: <TableComponent columns={[]} data={[]} />,
    },
  ];

  return (
    <div style={{ padding: '42px' }}>
      <TableComponent
        headerTitle="Background Checks"
        columns={bgCheckColumns}
          data={filteredBackgroundChecks}
          filterOptions={[
            { value: 'all', label: 'All Statuses' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
          onSearch={setSearchTerm}
          onFilterChange={setStatusFilter}
          loading={loadingBackground}
          error={errorBackground}
      />

      <Modal
        title="Background Check Details"
        open={!!selectedBgCheck}
        onCancel={() => setSelectedBgCheck(null)}
        footer={[
          <Button 
            key="reject" 
            type="primary"  
            onClick={() => handleStatusUpdate('rejected')}
            loading={processing}
          >
            Reject
          </Button>,
          <Button 
            key="approve" 
            type="primary" 
            onClick={() => handleStatusUpdate('approved')}
            loading={processing}
          >
            Approve
          </Button>
        ]}
      >
        {selectedBgCheck && (
          <div>
            <p><strong>Tenant:</strong> {selectedBgCheck.tenant.first_name} {selectedBgCheck.tenant.last_name}</p>
            <p><strong>Email:</strong> {selectedBgCheck.tenant.email}</p>
            <p><strong>Apartment:</strong> {selectedBgCheck.apartment.address}</p>
            <p><strong>City/State:</strong> {selectedBgCheck.apartment.city}, {selectedBgCheck.apartment.state}</p>
            <p><strong>Requested At:</strong> {getUsformatedDate(selectedBgCheck.requested_at)}</p>
            <p><strong>Application Status: </strong> 
              <Tag color={selectedBgCheck.application.status === 'background_verified' ? 'green' : 'orange'}>
                {selectedBgCheck.application.status.replace(/_/g, ' ').toUpperCase()}
              </Tag>
            </p>
            <p><strong>Lease Duration:</strong> {selectedBgCheck.application.lease_duration} months</p>
            <p><strong>Desired Move-in:</strong> {getUsformatedDate(selectedBgCheck.application.desired_move_in_date)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MaintenanceBackground;