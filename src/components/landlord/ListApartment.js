import React, { useState, useEffect } from 'react';
import { Card, Button, List, Pagination, Modal, Form, Input, Select, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Meta } = Card;
const { Option } = Select;

const ListApartment = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProperty, setEditingProperty] = useState(null);
  const pageSize = 10;

  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  useEffect(() => {
    fetchProperties();
  }, [currentPage, userId]);

  const fetchProperties = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/apartments/landlord/${userId}`,
        {
          params: {
            skip: (currentPage - 1) * pageSize,
            limit: pageSize
          }
        }
      );
      setProperties(response.data);
      setTotalItems(response.headers['x-total-count'] || 0);
    } catch (error) {
      message.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
        title: 'Delete Property',
        content: 'Are you sure you want to delete this property?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          try {
            await axios.delete(`http://127.0.0.1:8000/apartments/${id}`);
            message.success('Property deleted successfully');
            fetchProperties();
          } catch (error) {
            message.error('Failed to delete property');
          }
        }
      });
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingProperty) {
        await axios.put(`http://127.0.0.1:8000/apartments/${editingProperty.id}`, values);
        message.success('Property updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/apartments/', values);
        message.success('Property added successfully');
      }
      setIsModalVisible(false);
      fetchProperties();
    } catch (error) {
      message.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    form.setFieldsValue(property);
    setIsModalVisible(true);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingProperty(null);
          form.resetFields();
          setIsModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add Property
      </Button>

      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={properties}
        renderItem={(property) => (
          <List.Item>
            <Card
              title={property.title}
              actions={[
                <EditOutlined key="edit" onClick={() => handleEdit(property)} />,
                <DeleteOutlined key="delete" onClick={() => handleDelete(property.id)} />,
              ]}
            >
              <Meta
                description={
                  <>
                    <p>{property.address}</p>
                    <p>{property.city}, {property.state} {property.zip_code}</p>
                    <p>Price: ${property.price}</p>
                    <p>Bedrooms: {property.bedrooms}</p>
                    <p>Bathrooms: {property.bathrooms}</p>
                    <p>Availability: {property.availability ? 'Available' : 'Rented'}</p>
                  </>
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
  title={editingProperty ? 'Edit Property' : 'Add New Property'}
  visible={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={[
    <Button key="back" onClick={() => setIsModalVisible(false)}>
      Cancel
    </Button>,
    <Button 
      key="submit" 
      type="primary" 
      onClick={() => form.submit()}
    >
      {editingProperty ? 'Update' : 'Add'}
    </Button>,
  ]}
>
  <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
    <Row gutter={16}>
      {/* Left Column */}
      <Col span={12}>
        <Form.Item 
          name="title" 
          label="Title" 
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          name="address" 
          label="Address" 
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item 
          name="city" 
          label="City" 
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Col>

      {/* Right Column */}
      <Col span={12}>
        <Form.Item 
          name="state" 
          label="State" 
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          name="zip_code" 
          label="Zip Code" 
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          name="price" 
          label="Price ($)" 
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <Form.Item 
          name="bedrooms" 
          label="Bedrooms" 
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item 
          name="bathrooms" 
          label="Bathrooms" 
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>
      </Col>
    </Row>

    <Form.Item 
      name="availability" 
      label="Availability" 
      rules={[{ required: true }]}
    >
      <Select>
        <Option value={true}>Available</Option>
        <Option value={false}>Rented</Option>
      </Select>
    </Form.Item>
  </Form>
</Modal>
    </div>
  );
};

export default ListApartment;