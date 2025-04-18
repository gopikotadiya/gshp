import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, message,List, Pagination, Modal, Collapse, Tag, Typography, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getUsformatedDate } from '../../utils/auth';

const { Meta } = Card;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const RentedApartments = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leaseDetails, setLeaseDetails] = useState(null);
  const [payments, setPayments] = useState([]);
  const [deposit, setDeposit] = useState([]);
  const [error, setError] = useState(null);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const pageSize = 10;

  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  useEffect(() => {
    fetchRentedProperties();
  }, [currentPage, userId]);

  useEffect(() => {
    if (selectedApartment) {
      const fetchLeaseDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Fetch lease by apartment ID
          const leaseRes = await axios.get(
            `http://127.0.0.1:8000/leases/apartment/${selectedApartment.id}`
          );
          
          const leaseData = leaseRes.data;
          setLeaseDetails(leaseData);

          // Fetch related data
          const [paymentsRes, depositRes] = await Promise.all([
            axios.get(`http://127.0.0.1:8000/leases/${leaseData.id}/payments`),
            axios.get(`http://127.0.0.1:8000/leases/${leaseData.id}/security-deposit`)
          ]);

          setPayments(paymentsRes.data);
          setDeposit(depositRes.data);
        } catch (err) {
          setError(err.response?.data?.detail || 'Failed to fetch lease details');
        } finally {
          setLoading(false);
        }
      };

      fetchLeaseDetails();
    }
  }, [selectedApartment]);

  const fetchRentedProperties = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/apartments/rented/${userId}`,
        {
          params: {
            skip: (currentPage - 1) * pageSize,
            limit: pageSize
          }
        }
      );
      setProperties(response.data);
    } catch (error) {
      message.error('Failed to fetch rented properties');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={properties}
        renderItem={(property) => (
          <List.Item>
            <Card
              title={property.title}
              actions={[
                <Button 
                  type="primary"
                  onClick={() => setSelectedApartment(property)}
                >
                  View Details
                </Button>
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
                    <Text type="danger">Currently Rented</Text>
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
        total={properties.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 16, textAlign: 'center' }}
      />

      {/* <Modal
        title="Property Details"
        visible={!!selectedProperty}
        onCancel={() => setSelectedProperty(null)}
        footer={[
          <Button key="back" onClick={() => setSelectedProperty(null)}>
            Close
          </Button>
        ]}
      >
        {selectedProperty && (
          <div>
            <p><Text strong>Address:</Text> {selectedProperty.address}</p>
            <p><Text strong>City:</Text> {selectedProperty.city}</p>
            <p><Text strong>State:</Text> {selectedProperty.state}</p>
            <p><Text strong>Zip Code:</Text> {selectedProperty.zip_code}</p>
            <p><Text strong>Price:</Text> ${selectedProperty.price}</p>
            <p><Text strong>Bedrooms:</Text> {selectedProperty.bedrooms}</p>
            <p><Text strong>Bathrooms:</Text> {selectedProperty.bathrooms}</p>
            <p><Text strong>Apartment Number:</Text> {selectedProperty.apartment_number}</p>
            <p><Text strong>Listed Date:</Text> {new Date(selectedProperty.created_at).toLocaleDateString()}</p>
          </div>
        )}
      </Modal> */}
      <Modal
        title={`Lease Details - ${selectedApartment?.title}`}
        visible={!!selectedApartment}
        onCancel={() => setSelectedApartment(null)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setSelectedApartment(null)}>
            Close
          </Button>
        ]}
      >
        {error && <Alert message={error} type="error" className="mb-4" />}
        
        {loading ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        ) : (
          leaseDetails && (
            <Collapse bordered={false} defaultActiveKey={['1', '2', '3', '4']}>
              {/* Lease Information */}
              <Panel header="Lease Information" key="1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text strong>Lease Period:</Text>
                    <div>{getUsformatedDate(leaseDetails.start_date)} - {getUsformatedDate(leaseDetails.end_date)}</div>
                  </div>
                  <div>
                    <Text strong>Monthly Rent:</Text>
                    <div>${leaseDetails.monthly_rent}</div>
                  </div>
                  <div>
                    <Text strong>Security Deposit:</Text>
                    <div>${leaseDetails.deposit_amount}</div>
                  </div>
                  <div>
                    <Text strong>Status:</Text>
                    <Tag color={leaseDetails.lease_status === 'active' ? 'green' : 'red'}>
                      {leaseDetails.lease_status.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              </Panel>

              {/* Tenant Information */}
              <Panel header="Tenant Information" key="2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text strong>Name:</Text>
                    <div>{leaseDetails.tenant.first_name} {leaseDetails.tenant.last_name}</div>
                  </div>
                  <div>
                    <Text strong>Email:</Text>
                    <div>{leaseDetails.tenant.email}</div>
                  </div>
                  <div>
                    <Text strong>Contact Address:</Text>
                    <div>{leaseDetails.tenant.address}</div>
                  </div>
                  <div>
                    <Text strong>Move-in Date:</Text>
                    <div>{getUsformatedDate(leaseDetails.application.desired_move_in_date)}</div>
                  </div>
                </div>
              </Panel>

              {/* Payment History */}
              <Panel header="Payment History" key="3">
                {payments.length === 0 ? (
                  <Text type="secondary">No payments recorded</Text>
                ) : (
                  <List
                    dataSource={payments}
                    renderItem={payment => (
                      <List.Item>
                        <div className="grid grid-cols-3 gap-4 w-full">
                          <div>
                            <Text strong>Amount:</Text>
                            <div>${payment.amount}</div>
                          </div>
                          <div>
                            <Text strong>Date:</Text>
                            <div>{getUsformatedDate(payment.payment_date)}</div>
                          </div>
                          <div>
                            <Text strong>Status:</Text>
                            <Tag color={payment.status === 'paid' ? 'green' : 'red'}>
                              {payment.status.toUpperCase()}
                            </Tag>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </Panel>

              {/* Security Deposit */}
              <Panel header="Security Deposit" key="4">
                {deposit.length === 0 ? (
                  <Text type="secondary">No deposit records found</Text>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Text strong>Amount:</Text>
                      <div>${deposit[0].amount}</div>
                    </div>
                    <div>
                      <Text strong>Status:</Text>
                      <Tag color={deposit[0].status === 'returned' ? 'green' : 'blue'}>
                        {deposit[0].status.toUpperCase()}
                      </Tag>
                    </div>
                    <div>
                      <Text strong>Deposit Date:</Text>
                      <div>{getUsformatedDate(deposit[0].deposit_date)}</div>
                    </div>
                    {deposit[0].returned_date && (
                      <div>
                        <Text strong>Returned Date:</Text>
                        <div>{getUsformatedDate(deposit[0].returned_date)}</div>
                      </div>
                    )}
                  </div>
                )}
              </Panel>
            </Collapse>
          )
        )}
      </Modal>
    </div>
  );
};

export default RentedApartments;