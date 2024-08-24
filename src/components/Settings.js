import React, { useEffect, useState } from 'react';
import { getUser, updateUser } from '../api/users';

const Settings = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login || !password) {
      return setMessage('Please enter new login or password');
    }
    const response = await updateUser({ login, password });
    alert(response.data.message);
  };

  useEffect(() => {
    const getUserFunction = async () => {
      const response = await getUser();
      if (response?.data?.user) {
        setLogin(response.data.user.login);
      }
    };

    getUserFunction();
  }, []);

  return (
    <div>
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>
          New Login:
          <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
        </label>
        <br />
        <label>
          New Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
      {message && <p style={{color: 'red'}}>{message}</p>}
    </div>
  );
};

export default Settings;
