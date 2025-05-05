import React, { useState, useEffect } from 'react';
import { Modal, Spin, Alert, Button, Typography, Collapse, Tag, Card, Grid, List } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
import { getUsformatedDate } from '../utils/auth';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);
const { useBreakpoint } = Grid;
const { Panel } = Collapse;
const { Text } = Typography;

const LeaseDetailsModal = ({ lease, visible, onClose }) => {
    const [deposit, setDeposit] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (visible) {
        const fetchDetails = async () => {
          try {
            setLoading(true);
            const [depositRes, paymentsRes] = await Promise.all([
              fetch(`http://127.0.0.1:8000/leases/${lease.id}/security-deposit`),
              fetch(`http://127.0.0.1:8000/leases/${lease.id}/payments`)
            ]);
  
            if (!depositRes.ok) throw new Error('Failed to fetch deposit details');
            if (!paymentsRes.ok) throw new Error('Failed to fetch payment history');
  
            const [depositData, paymentsData] = await Promise.all([
              depositRes.json(),
              paymentsRes.json()
            ]);
  
            setDeposit(depositData);
            setPayments(paymentsData);
            setError(null);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
  
        fetchDetails();
      }
    }, [visible, lease.id]);
  
    const handlePayRent = (month, year) => {
      console.log(`Paying rent for ${month}/${year}`);
    };
  
    const isRentDue = () => {
      const today = dayjs();
      const leaseStart = dayjs(lease.start_date);
      const leaseEnd = dayjs(lease.end_date);
      
      return today.isBetween(leaseStart, leaseEnd, 'month', '[]');
    };
  
    return (
      <Modal
        title={`Lease Details - ${lease.apartment.title}`}
        visible={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        centered
      >
        {error && <Alert message={error} type="error" className="mb-4" />}
        
        <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
          <Panel header="Lease Information" key="1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>Lease Period:</Text>
                <div>{getUsformatedDate(lease.start_date)} - {getUsformatedDate(lease.end_date)}</div>
              </div>
              <div>
                <Text strong>Monthly Rent:</Text>
                <div>${lease.monthly_rent}</div>
              </div>
              <div>
                <Text strong>Payment Due Day:</Text>
                <div>{lease.payment_due_day}th of each month</div>
              </div>
              <div>
                <Text strong>Lease Status:</Text>
                <Tag color={lease.lease_status === 'active' ? 'green' : 'red'}>
                  {lease.lease_status.toUpperCase()}
                </Tag>
              </div>
            </div>
          </Panel>
  
          <Panel header="Security Deposit" key="2">
            {loading ? (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            ) : deposit.length === 0 ? (
              <div className="flex justify-between items-center">
                <Text type="secondary">No deposit records found</Text>
                <Button type="primary">Pay Security Deposit</Button>
              </div>
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
  
          <Panel header="Rent Payments" key="3">
            {loading ? (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            ) : (
              <>
                <div className="mb-4">
                  <Button 
                    type="primary" 
                    disabled={!isRentDue()}
                    onClick={() => {
                      const currentMonth = dayjs().month() + 1;
                      const currentYear = dayjs().year();
                      handlePayRent(currentMonth, currentYear);
                    }}
                  >
                    Pay Current Month Rent
                  </Button>
                </div>
  
                {payments.length === 0 ? (
                  <Text type="secondary">No payments recorded</Text>
                ) : (
                  <List
                    dataSource={payments}
                    renderItem={payment => (
                      <List.Item>
                        <div className="grid grid-cols-3 gap-4 w-full">
                          <div>
                            <Text strong>Period:</Text>
                            <div>{payment.month}/{payment.year}</div>
                          </div>
                          <div>
                            <Text strong>Amount:</Text>
                            <div>${payment.amount}</div>
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
              </>
            )}
          </Panel>
        </Collapse>
      </Modal>
    );
  };
  
  const LeaseCard = ({ lease }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const screens = useBreakpoint();

    return (
      <>
        <Card
          title={`${lease.apartment.title} (Lease #${lease.id})`}
          className="shadow-lg mb-4"
          extra={
            <Button 
              type="primary" 
              onClick={() => setModalVisible(true)}
            >
              View Details
            </Button>
          }
        >
          <div className={`grid ${screens.md ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
            <div>
                <div className="font-medium">Address:</div>
                <div>{lease.apartment.address}, {lease.apartment.city}, {lease.apartment.state} {lease.apartment.zip_code}</div>
            </div>
            
            <div>
                <div className="font-medium">Lease Period:</div>
                <div>{getUsformatedDate(lease.start_date)} - {getUsformatedDate(lease.end_date)}</div>
            </div>
            
            <div>
                <div className="font-medium">Monthly Rent:</div>
                <div>${lease.monthly_rent}</div>
            </div>
            
            <div>
                <div className="font-medium">Security Deposit:</div>
                <div>${lease.deposit_amount}</div>
            </div>
            
            <div>
                <div className="font-medium">Status:</div>
                <Tag color={lease.lease_status === 'active' ? 'green' : 'red'}>
                {lease.lease_status.toUpperCase()}
                </Tag>
            </div>
          </div>
        </Card>
  
        <LeaseDetailsModal 
          lease={lease} 
          visible={modalVisible} 
          onClose={() => setModalVisible(false)} 
        />
      </>
    );
  };
  
export default LeaseCard