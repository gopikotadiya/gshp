import React, { useState, useEffect } from 'react';
import { Card, Button, List, Modal, Form, Input, Switch, Tag, message, Skeleton } from 'antd';
import { UserOutlined, MailOutlined, EnvironmentOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthHeader } from '../../utils/auth';
import { updateUserProfile } from '../../redux/actions/authActions';

const { Meta } = Card;
const { TextArea } = Input;

const cardStyle = {
  width: 360,
  minWidth: 360,
  margin: '8px',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  border: '1px solid #f0f0f0',
  ':hover': {
    transform: 'translateY(-4px)'
  }
};

const FindRoommates = () => {
  const dispatch = useDispatch();
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);
  const headers = getAuthHeader();

  useEffect(() => {
    fetchRoommates();
  }, []);

  const fetchRoommates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/user/roommates/${user.id}`,
        { headers }
      );
      setRoommates(response.data);
    } catch (error) {
      message.error('Failed to fetch roommates: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };


  const handleProfileSubmit = (values) => {
    dispatch(updateUserProfile(user.id, values, headers))
      .then(() => {
        message.success('Profile updated successfully!');
        setIsProfileModalVisible(false);
      })
      .catch((error) => {
        message.error(error || 'Profile update failed');
      });
  }

  const handleContact = (email) => {
    if (!user) {
      message.error('Please login to contact roommates');
      return;
    }
    window.location.href = `mailto:${email}`;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: 24, textAlign: 'right' }}>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            if (!user) {
              message.error('Please login to update profile');
              return;
            }
            form.setFieldsValue({
              address: user.address || '',
              location: user.location || '',
              preference: user.preference || '',
              looking_for_roommate: user.looking_for_roommate || false
            });
            setIsProfileModalVisible(true);
          }}
        >
          {user?.looking_for_roommate ? '✏️ Update Profile' : '🚀 Join Roommate List'}
        </Button>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 3,
            xxl: 3
          }}
          dataSource={roommates}
          renderItem={(profile) => (
            <List.Item>
              <Card
                style={cardStyle}
                actions={[
                  <Button
                    key="contact"
                    type="primary"
                    ghost
                    icon={<MailOutlined />}
                    onClick={() => handleContact(profile.email)}
                  >
                    Contact
                  </Button>
                ]}
              >
                <Meta
                  avatar={<UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />}
                  title={
                    <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                      {profile.first_name} {profile.last_name}
                    </div>
                  }
                  description={
                    <div style={{ marginTop: 12 }}>
                      <Tag 
                        icon={<HomeOutlined />}
                        color={profile.looking_for_roommate ? 'green' : 'red'}
                        style={{ marginBottom: 16, fontSize: '0.9rem' }}
                      >
                        {profile.looking_for_roommate ? 'Actively Searching' : 'Not Currently Looking'}
                      </Tag>
                      <div style={{ marginBottom: 12 }}>
                        <MailOutlined style={{ marginRight: 8, color: '#666' }} />
                        <a href={`mailto:${profile.email}`}>{profile.email}</a>
                      </div>

                      {profile.location && (
                        <div style={{ marginBottom: 12 }}>
                          <EnvironmentOutlined style={{ marginRight: 8, color: '#666' }} />
                          <span style={{ color: '#444' }}>{profile.location}</span>
                        </div>
                      )}

                      {profile.address && (
                        <div style={{ marginBottom: 12 }}>
                          <HomeOutlined style={{ marginRight: 8, color: '#666' }} />
                          <span style={{ color: '#444' }}>{profile.address}</span>
                        </div>
                      )}

                      {profile.preference && (
                        <div style={{ 
                          background: '#f8f9fa',
                          borderRadius: 8,
                          padding: 12,
                          marginTop: 16
                        }}>
                          <div style={{ color: '#666', marginBottom: 8 }}>🏷 Preferences:</div>
                          <div style={{ color: '#444', lineHeight: 1.6 }}>
                            {profile.preference}
                          </div>
                        </div>
                      )}
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="🏠 Update Roommate Profile"
        visible={isProfileModalVisible}
        onCancel={() => setIsProfileModalVisible(false)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ looking_for_roommate: true }}
          onFinish={handleProfileSubmit}
        >
          <Form.Item
            name="looking_for_roommate"
            label="Looking for Roommate"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Current Address"
            tooltip="Where are you currently living?"
          >
            <Input placeholder="123 Main Street, Apt 4B" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Preferred Location"
            tooltip="Where would you like to live?"
          >
            <Input placeholder="Near campus, downtown area" />
          </Form.Item>

          <Form.Item
            name="preference"
            label="Roommate Preferences"
            tooltip="Describe your ideal roommate"
          >
            <TextArea
              rows={4}
              placeholder="Example: Non-smoker, quiet after 10 PM, shares cleaning duties..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            block
            size="large"
            style={{ marginTop: 24 }}
          >
            Save Changes
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default FindRoommates;