import React, { useEffect, useState } from 'react';
import { Tag, Spin, Alert } from 'antd';
import TableComponent from '../TableComponent';
import TabComponent from '../TabComponent';
import { getUsformatedDate } from '../../utils/auth';

const SystemManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [apartmentsLoading, setApartmentsLoading] = useState(false);
  const [apartmentsError, setApartmentsError] = useState(null);
  const [apartmentsSearch, setApartmentsSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await fetch('http://127.0.0.1:8000/user/?skip=0&limit=100');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setUsersError(err.message);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setApartmentsLoading(true);
        const response = await fetch('http://127.0.0.1:8000/apartments/?skip=0&limit=100');
        if (!response.ok) throw new Error('Failed to fetch apartments');
        const data = await response.json();
        setApartments(data);
        setFilteredApartments(data);
      } catch (err) {
        setApartmentsError(err.message);
      } finally {
        setApartmentsLoading(false);
      }
    };
    fetchApartments();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  useEffect(() => {
    const filtered = apartments.filter(apartment => {
      const matchesSearch = apartment.title.toLowerCase().includes(apartmentsSearch.toLowerCase()) ||
        apartment.address.toLowerCase().includes(apartmentsSearch.toLowerCase());
      const matchesCity = cityFilter === 'all' || apartment.city === cityFilter;
      return matchesSearch && matchesCity;
    });
    setFilteredApartments(filtered);
  }, [apartmentsSearch, cityFilter, apartments]);

  const userColumns = [
    {
      title: 'Name',
      render: (_, record) => `${record.first_name} ${record.last_name}`,
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: role => <Tag color={role === 'landlord' ? 'blue' : 'green'}>{role}</Tag>,
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Registered Date',
      dataIndex: 'created_at',
      render: date => getUsformatedDate(date),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Roommate Search',
      render: (_, record) => <Tag color={record.looking_for_roommate ? 'green' : 'red'}>
        {record.looking_for_roommate ? 'Yes' : 'No'}
      </Tag>,
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value, record) => record.looking_for_roommate === value,
    },
  ];

  const apartmentColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Address',
      render: (_, record) => `${record.address}, ${record.city}, ${record.state} ${record.zip_code}`,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: price => `$${price.toLocaleString()}/mo`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Details',
      render: (_, record) => `${record.bedrooms} BR, ${record.bathrooms} BA`,
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      render: available => <Tag color={available ? 'green' : 'red'}>
        {available ? 'Available' : 'Rented'}
      </Tag>,
      filters: [
        { text: 'Available', value: true },
        { text: 'Rented', value: false },
      ],
      onFilter: (value, record) => record.availability === value,
    },
    {
      title: 'Listed Date',
      dataIndex: 'created_at',
      render: date => getUsformatedDate(date),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
  ];

  const cityOptions = [...new Set(apartments.map(a => a.city))].map(city => ({
    value: city,
    label: city
  }));

  const tabItems = [
    {
      key: '1',
      label: 'Users',
      content: (
        <TableComponent
          headerTitle={false} 
          data={filteredUsers}
          columns={userColumns}
          loading={usersLoading}
          error={usersError}
          filterOptions={[
            { value: 'all', label: 'All Users' },
            { value: 'landlord', label: 'Landlords' },
            { value: 'tenant', label: 'Tenants' },
          ]}
          onSearch={setSearchTerm}
          onFilterChange={setRoleFilter}
          searchPlaceholder="Search users..."
        />
      )
    },
    {
      key: '2',
      label: 'Listed Apartments',
      content: (
        <TableComponent
          headerTitle={false}
          data={filteredApartments}
          columns={apartmentColumns}
          loading={apartmentsLoading}
          error={apartmentsError}
          filterOptions={[{ value: 'all', label: 'All Cities' }, ...cityOptions]}
          onSearch={setApartmentsSearch}
          onFilterChange={setCityFilter}
          searchPlaceholder="Search apartments..."
        />
      )
    }
  ];

  return (
    <div style={{ padding: '42px' }}> 
        <TabComponent items={tabItems} />
    </div>
  );
};

export default SystemManagement;