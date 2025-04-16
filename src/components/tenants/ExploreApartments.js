import React, { useState, useEffect } from 'react';
import { Card, Button, List, Pagination, Modal, Form, Input, DatePicker, message } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const { Meta } = Card;

const ExploreApartments = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isApplicationModalVisible, setIsApplicationModalVisible] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [form] = Form.useForm();
  const pageSize = 25;
  
  const { user } = useSelector((state) => state.auth);
  const tenantId = user?.id;

  useEffect(() => {
    const fetchAvailableApartments = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/apartments/available/', {
          params: {
            skip: (currentPage - 1) * pageSize,
            limit: pageSize
          }
        });
        setApartments(response.data);
        setTotalItems(response.headers['x-total-count'] || 0);
      } catch (error) {
        message.error('Failed to fetch apartments');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableApartments();
  }, [currentPage]);

  const handleApplicationSubmit = async (values) => {
    if (!user) {
      message.error('Please login to apply');
      return;
    }

    try {
      const applicationData = {
        tenant_id: tenantId,
        apartment_id: selectedApartment.id,
        ...values,
        desired_move_in_date: values.desired_move_in_date
        ? values.desired_move_in_date.format('YYYY-MM-DD HH:mm:ss')
        : null,
      };

      await axios.post('http://127.0.0.1:8000/applications/', applicationData);
      message.success('Application submitted successfully!');
      setIsApplicationModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Application submission failed');
    }
  };

  return (
    <div style={{ padding: '42px' }}>
      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={apartments}
        renderItem={(apartment) => (
          <List.Item>
            <Card
              // cover={apartment.images?.length > 0 && (
              //   <img
              //     alt={apartment.title}
              //     src={apartment.images[0]}
              //     style={{ height: 200, objectFit: 'cover' }}
              //   />
              // )}
              actions={[
                <Button
                  type="primary"
                  onClick={() => {
                    if (!user) {
                      message.error('Please login to apply');
                      return;
                    }
                    setSelectedApartment(apartment);
                    setIsApplicationModalVisible(true);
                  }}
                >
                  Apply Now
                </Button>
              ]}
            >
              <Meta
                title={apartment.title}
                description={
                  <div>
                    <p>{apartment.address}</p>
                    <p>{apartment.city}, {apartment.state} {apartment.zip_code}</p>
                    <p>Price: ${apartment.price}/month</p>
                    <p>{apartment.bedrooms} BR | {apartment.bathrooms} BA</p>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 16, textAlign: 'center' }}
      />

      <Modal
        title={`Apply for ${selectedApartment?.title || ''}`}
        visible={isApplicationModalVisible}
        onCancel={() => setIsApplicationModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleApplicationSubmit}>
          <Form.Item
            name="lease_duration"
            label="Lease Duration (months)"
            rules={[{ required: true, message: 'Please input lease duration' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item
            name="desired_move_in_date"
            label="Desired Move-in Date"
            rules={[{ required: true, message: 'Please select move-in date' }]}
          >
            <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < dayjs().startOf('day')}/>
          </Form.Item>

          <Form.Item
            name="application_notes"
            label="Additional Notes"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Submit Application
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ExploreApartments;