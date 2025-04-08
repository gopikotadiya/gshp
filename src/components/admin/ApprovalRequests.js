import React, { useState, useEffect } from 'react';
import { Button, Modal, Tag, Form, Input, DatePicker, Spin, Alert } from 'antd';
import TableComponent from '../TableComponent';
import { getUsformatedDate } from '../../utils/auth';

const ApprovalRequests = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/applications/?skip=0&limit=10');
        if (!response.ok) throw new Error('Failed to fetch applications');
        const data = await response.json();
        setApplications(data);
        setFilteredApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, statusFilter, applications]);

  const filterApplications = () => {
    let filtered = applications.filter(app => {
      const tenantName = `${app.tenant.first_name} ${app.tenant.last_name}`.toLowerCase();
      const matchesSearch = tenantName.includes(searchTerm.toLowerCase()) ||
        app.apartment.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    setFilteredApplications(filtered);
  };

  const formatDate = (dateString) => {
    // return dayjs(dateString).format('MM/DD/YYYY');
  };

  const handleDecision = (status) => {
    Modal.confirm({
      title: `Are you sure you want to ${status} this application?`,
      onOk: () => {
        // API call to update status
        setSelectedApp(null);
      },
    });
  };

  const columns = [
    {
      title: 'Tenant',
      render: (_, record) => `${record.tenant.first_name} ${record.tenant.last_name}`,
    },
    {
      title: 'Apartment',
      render: (_, record) => record.apartment.address,
    },
    {
      title: 'Move-in Date',
      render: (_, record) => getUsformatedDate(record.desired_move_in_date),
      sorter: (a, b) => new Date(a.desired_move_in_date) - new Date(b.desired_move_in_date),
    },
    {
      title: 'Status',
      render: (_, record) => (
        <Tag color={record.status === 'pending' ? 'orange' : record.status === 'approved' ? 'green' : 'red'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Button onClick={() => setSelectedApp(record)}>Review</Button>
      ),
    },
  ];

  return (
    <div>
      <TableComponent
        headerTitle="Approval Requests"
        data={filteredApplications}
        columns={columns}
        loading={loading}
        error={error}
        filterOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ]}
        onSearch={setSearchTerm}
        onFilterChange={setStatusFilter}
        searchPlaceholder="Search by tenant or address..."
      />

      <Modal
        title="Application Details"
        open={!!selectedApp}
        onCancel={() => setSelectedApp(null)}
        footer={[
          <Button key="reject" type="primary" onClick={() => handleDecision('rejected')}>
            Reject
          </Button>,
          <Button key="approve" type="primary" onClick={() => handleDecision('approved')}>
            Approve
          </Button>,
        ]}
      >
        {selectedApp && (
          <Form form={form} layout="vertical" initialValues={selectedApp}>
            <Form.Item label="Tenant Name">
              <Input value={`${selectedApp.tenant.first_name} ${selectedApp.tenant.last_name}`} disabled />
            </Form.Item>
            <Form.Item label="Tenant Email">
              <Input value={selectedApp.tenant.email} disabled />
            </Form.Item>
            <Form.Item label="Apartment">
              <Input value={selectedApp.apartment.title} disabled />
            </Form.Item>
            <Form.Item label="Address">
              <Input value={`${selectedApp.apartment.address}, ${selectedApp.apartment.city}, ${selectedApp.apartment.state} ${selectedApp.apartment.zip_code}`} disabled />
            </Form.Item>
            <Form.Item label="Lease Duration (months)">
              <Input value={selectedApp.lease_duration} disabled />
            </Form.Item>
            <Form.Item label="Desired Move-in Date">
              <Input value={getUsformatedDate(selectedApp.desired_move_in_date)} disabled />
            </Form.Item>
            <Form.Item label="Application Date">
              <Input value={getUsformatedDate(selectedApp.submitted_at)} disabled />
            </Form.Item>
            <Form.Item label="Tenant Notes">
              <Input.TextArea value={selectedApp.application_notes} disabled />
            </Form.Item>
            <Form.Item label="Admin Notes" name="admin_notes">
              <Input.TextArea />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ApprovalRequests;