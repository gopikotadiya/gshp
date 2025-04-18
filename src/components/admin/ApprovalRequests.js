import React, { useState, useEffect } from 'react';
import { Button, Modal, Tag, Form, Input, DatePicker, Spin, Alert, message } from 'antd';
import TableComponent from '../TableComponent';
import { getUsformatedDate } from '../../utils/auth';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const ApprovalRequests = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [adminNotesError, setAdminNotesError] = useState('');
  const [leaseModalVisible, setLeaseModalVisible] = useState(false);
  const [leaseForm] = Form.useForm();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/applications/?skip=0&limit=100');
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

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, statusFilter, applications]);

  useEffect(() => {
    if (leaseModalVisible && selectedApp) {
      const startDate = dayjs(selectedApp.desired_move_in_date);
      const endDate = startDate.add(selectedApp.lease_duration, 'month');
      
      leaseForm.setFieldsValue({
        start_date: startDate,
        end_date: endDate,
        monthly_rent: selectedApp.apartment.price,
        deposit_amount: selectedApp.apartment.price,
        payment_due_day: 5,
      });
    }
  }, [leaseModalVisible, selectedApp, leaseForm]);

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

  const handleSendForBackgroundCheck = async () => {
    try {
      setProcessing(true);
      const response = await fetch(`http://127.0.0.1:8000/background-checks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          tenant_id: selectedApp.tenant.id,
          apartment_id: selectedApp.apartment.id,
          application_id: selectedApp.id
        }),
      });

      if (!response.ok) throw new Error('Failed to initiate background check');

      await response.json();
      message.success('Background check initiated successfully');
      fetchApplications();
      setSelectedApp(null);
    } catch (err) {
      message.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      setProcessing(true);
      const values = await form.validateFields();
      
      const payload = {
        ...selectedApp,
        status,
        admin_notes: values.admin_notes || '',
        desired_move_in_date: selectedApp.desired_move_in_date,
        lease_duration: selectedApp.lease_duration,
        application_notes: selectedApp.application_notes
      };

      const response = await fetch(`http://127.0.0.1:8000/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update application');

      const updatedApp = await response.json();
      setApplications(prev => prev.map(app => 
        app.id === updatedApp.id ? updatedApp : app
      ));
      
      message.success(`Application ${status} successfully`);
      setSelectedApp(null);
    } catch (err) {
      message.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleLeaseSubmit = async () => {
    try {
      setProcessing(true);
      const values = await leaseForm.validateFields();
      
      const leasePayload = {
        application_id: selectedApp.id,
        apartment_id: selectedApp.apartment.id,
        tenant_id: selectedApp.tenant.id,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        monthly_rent: values.monthly_rent,
        deposit_amount: values.deposit_amount,
        payment_due_day: 5,
      };

      const leaseResponse = await fetch('http://127.0.0.1:8000/leases/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leasePayload),
      });

      if (!leaseResponse.ok) throw new Error('Lease creation failed');

      const adminNotes = form.getFieldValue('admin_notes') || '';
      const appPayload = {
        ...selectedApp,
        status: 'approved',
        admin_notes: adminNotes,
      };

      const appResponse = await fetch(`http://127.0.0.1:8000/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appPayload),
      });

      if (!appResponse.ok) throw new Error('Status update failed');

      // 3. Update apartment availability
    const apartmentPayload = {
      title: selectedApp.apartment.title,
      address: selectedApp.apartment.address,
      apartment_number: selectedApp.apartment.apartment_number,
      city: selectedApp.apartment.city,
      state: selectedApp.apartment.state,
      zip_code: selectedApp.apartment.zip_code,
      price: selectedApp.apartment.price,
      bedrooms: selectedApp.apartment.bedrooms,
      bathrooms: selectedApp.apartment.bathrooms,
      availability: false,
      images: selectedApp.apartment.images || [],
    };

    const apartmentResponse = await fetch(
      `http://127.0.0.1:8000/apartments/${selectedApp.apartment.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apartmentPayload),
      }
    );
    if (!apartmentResponse.ok) throw new Error('Apartment update failed');

    message.success('Application approved, lease created, and apartment updated');
      setLeaseModalVisible(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      message.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const validateRejection = async () => {
    try {
      const adminNotes = form.getFieldValue('admin_notes');
      if (!adminNotes?.trim()) {
        message.error('Please provide rejection reason in admin notes');
        return;
      }
      await handleStatusUpdate('rejected');
    } catch (err) {
      message.error(err.message);
    }
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
      render: (_, record) => {
        const statusColor = {
          pending: 'orange',
          background_verified: 'cyan',
          under_review: 'blue',
          approved: 'green',
          rejected: 'red'
        }[record.status];
  
        return (
          <Tag color={statusColor || 'red'}>
            {record.status.replace(/_/g, ' ').toUpperCase()}
          </Tag>
        );
      },
    },
  
    {
      title: 'Actions',
      render: (_, record) => (
        (record.status === 'pending' || record.status === 'background_verified') && (
          <Button onClick={() => setSelectedApp(record)}>Review</Button>
        )
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
          { value: 'background_verified', label: 'Background Verified' },
          { value: 'under_review', label: 'Under Review' },
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
        onCancel={() => {
          form.resetFields(); // Clear validations and form state
          setSelectedApp(null);
        }}
        footer={[
          <Button 
            key="reject" 
            type="primary" 
            onClick={validateRejection}
            loading={processing}
          >
            Reject
          </Button>,
          selectedApp?.status === 'pending' ? (
            <Button 
              key="backgroundCheck" 
              type="primary" 
              onClick={handleSendForBackgroundCheck}
              loading={processing}
            >
              Send for Background Check
            </Button>
          ) : (
            <Button 
              key="approve" 
              type="primary" 
              onClick={() => setLeaseModalVisible(true)}
              loading={processing}
            >
              Approve
            </Button>
          )
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
            <Form.Item 
              label="Admin Notes" 
              name="admin_notes"
              // rules={[
              //   ({ getFieldValue }) => ({
              //     validator(_, value) {
              //       if (selectedApp?.status === 'pending' && !value) {
              //         return Promise.reject(new Error('Admin notes are required for rejection'));
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
            >
              <Input.TextArea placeholder="Enter admin notes (required for rejection)" />
              <span>message.error</span>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="Create Lease Agreement"
        open={leaseModalVisible}
        onCancel={() => setLeaseModalVisible(false)}
        onOk={handleLeaseSubmit}
        confirmLoading={processing}
      >
        <Form form={leaseForm} layout="vertical">
          <Form.Item label="Start Date" name="start_date" rules={[{ required: true }]}>
            <DatePicker 
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current < dayjs().startOf('day')} 
            />
          </Form.Item>
          <Form.Item label="End Date" name="end_date" rules={[{ required: true }]}>
            <DatePicker 
              format="YYYY-MM-DD" 
              disabledDate={(current) => current && current <= leaseForm.getFieldValue('start_date')}
            />
          </Form.Item>
          <Form.Item label="Monthly Rent" name="monthly_rent" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Deposit Amount" name="deposit_amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          {/* <Form.Item label="Payment Due Day">
            <Input value="5" disabled />
          </Form.Item> */}
        </Form>
      </Modal>

    </div>
  );
};

export default ApprovalRequests;