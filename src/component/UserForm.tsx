// components/UserForm.tsx

import React, { useState } from 'react';
import { createUser, getUsers } from '../services/userService';

interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
}

const UserForm: React.FC = () => {
  const [userData, setUserData] = useState<User>({ name: '', email: '', password: '' });
  const [users, setUsers] = useState<User[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newUser = await createUser(userData);
      alert('User created successfully!');
      setUserData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      alert('Failed to create user');
    }
  };

  const fetchUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit">Create User</button>
      </form>

      <button onClick={fetchUsers}>Load Users</button>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserForm;
