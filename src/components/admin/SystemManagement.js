import React, { useEffect, useState } from 'react';
import { Tag, Spin, Alert } from 'antd';
import TableComponent from '../TableComponent';

const SystemManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/user/');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const filterUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });

    setFilteredUsers(filtered);
  };

  const columns = [
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
      render: date => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Roommate Search',
      render: (_, record) => record.looking_for_roommate ? 'Yes' : 'No',
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value, record) => record.looking_for_roommate === value,
    },
  ];

  return (
    <TableComponent
      headerTitle="User Management"
      data={filteredUsers}
      columns={columns}
      loading={loading}
      error={error}
      filterOptions={[
        { value: 'all', label: 'All Users' },
        { value: 'landlord', label: 'Landlords' },
        { value: 'tenant', label: 'Tenants' },
      ]}
      onSearch={setSearchTerm}
      onFilterChange={setRoleFilter}
      searchPlaceholder="Search users by name or email..."
    />
  );
};

export default SystemManagement;