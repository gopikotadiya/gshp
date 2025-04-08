import React from 'react';
import { Table, Input, Select, Spin, Alert, Layout, Space, Typography } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

const TableComponent = ({ 
  data, 
  columns, 
  loading, 
  error,
  headerTitle,
  filterOptions,
  onSearch,
  onFilterChange,
  searchPlaceholder = 'Search...',
}) => {
  return (
    <Content className="site-layout-background" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0 }}>{headerTitle}</Title>
          
          <Space>
            {filterOptions && (
              <Select
                style={{ width: 200 }}
                placeholder="Filter by"
                onChange={onFilterChange}
                options={filterOptions}
                allowClear
              />
            )}
            
            <Input.Search 
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
          </Space>
        </div>

        {error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              bordered
              size="middle"
              pagination={{ 
                pageSize: 10, 
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} items`,
              }}
              scroll={{ x: 'max-content' }}
            />
          </Spin>
        )}
      </div>
    </Content>
  );
};

export default TableComponent;