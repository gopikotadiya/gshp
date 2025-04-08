import React, { useState, useEffect } from 'react';
import { Card, Tag, Spin, Alert, Button, Form, Input, DatePicker, InputNumber, Grid, message } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import ConfirmModalComponent from '../ConfirmModalComponent';
import { getUsformatedDate } from '../../utils/auth';

const { useBreakpoint } = Grid;

const ApplicationCard = ({ app, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const screens = useBreakpoint();

  useEffect(() => {
    form.setFieldsValue({
      lease_duration: app.lease_duration,
      desired_move_in_date: dayjs(app.desired_move_in_date),
      application_notes: app.application_notes
    });
  }, [app, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(`http://127.0.0.1:8000/applications/${app.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Failed to update application');
      const updatedApp = await response.json();
      onUpdate(updatedApp);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating application:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/applications/${app.id}`, {
        method: 'DELETE',
        headers: { 'accept': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to delete application');

      const result = await response.json();
      message.success(result.message);
      onDelete(app.id);
    } catch (err) {
      console.error('Delete failed:', err);
      message.error('Failed to delete application');
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <Card
        title={`Application #${app.id}`}
        extra={
          <div className="flex gap-2">
            {app.status === 'pending' && (
              <>
                <Button
                  type="primary"
                  icon={editMode ? <CloseOutlined /> : <EditOutlined />}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Cancel Edit' : 'Edit Application'}
                </Button>
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() => setShowModal(true)}
                />
              </>
            )}
          </div>
        }
        className="shadow-lg mb-4"
      >
        <Form form={form} layout="vertical" disabled={!editMode}>
          <div className={`grid ${screens.md ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
            {/* Status Section */}
            <Card className="mb-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Application Status:</span>
                <Tag color={
                  app.status === 'pending' ? 'orange' :
                    app.status === 'approved' ? 'green' : 'red'
                } className="text-sm">
                  {app.status.toUpperCase()}
                </Tag>
              </div>
            </Card>

            {/* Dates Section */}
            <Card className="mb-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Submitted Date: </span>
                  {getUsformatedDate(app.submitted_at)}
                </div>
                <Form.Item
                  name="desired_move_in_date"
                  label="Desired Move-in Date"
                  rules={[{ required: true, message: 'Please select move-in date!' }]}
                >
                  <DatePicker
                    className="w-full"
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </Form.Item>
              </div>
            </Card>

            {/* Lease Details Section */}
            <Card className="mb-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Apartment ID: </span>
                  {app.apartment_id}
                </div>
                <Form.Item
                  name="lease_duration"
                  label="Lease Duration (months)"
                  rules={[{
                    required: true,
                    message: 'Please enter lease duration',
                    type: 'number',
                    min: 1
                  }]}
                >
                  <InputNumber min={1} className="w-full" />
                </Form.Item>
              </div>
            </Card>

            {/* Notes Section */}
            <Card>
              <Form.Item
                name="application_notes"
                label="Application Notes"
                rules={[{ required: true, message: 'Please enter application notes!' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Card>
          </div>

          {editMode && (
            <div className="flex justify-end mt-6">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
                size="large"
              >
                Save Changes
              </Button>
            </div>
          )}
        </Form>
      </Card>

      <ConfirmModalComponent
        visible={showModal}
        title="Delete Application"
        content="Are you sure you want to delete this application? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
};

const RentalHub = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/applications/tenant/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch applications');
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user.id]);

  const handleApplicationUpdate = (updatedApp) => {
    setApplications(prev =>
      prev.map(app => app.id === updatedApp.id ? updatedApp : app)
    );
  };

  const handleApplicationDelete = (deletedId) => {
    setApplications(prev =>
      prev.filter(app => app.id !== deletedId)
    );
  };

  if (loading) return <Spin size="large" className="mt-8" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon className="m-4" />;

  if (applications.length === 0) {
    return (
      <div style={{ padding: '42px' }}>
        <Alert
          message="No Applications Found"
          description="You haven't applied to any apartments yet. Start your journey by applying to your dream apartment today!"
          type="info"
          showIcon
          action={
            <Button type="primary" href="/apartments">
              Browse Apartments
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '42px' }}>
      {applications.map((app) => (
        <ApplicationCard
          key={app.id}
          app={app}
          onUpdate={handleApplicationUpdate}
          onDelete={handleApplicationDelete}
        />
      ))}
    </div>
  );
};

export default RentalHub;
