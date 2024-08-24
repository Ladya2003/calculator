// src/App.js
import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Main from './components/Main';
import './App.css';
import UserRole from './constants/user';
import { getProtectedUser } from './api/users';
import LoaderComponent from './components/LoaderComponent';

const App = () => {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('role', role);

  const handleLogin = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // TODO: remove
        // const response = await axios.get('https://calculator-d04j.onrender.com/protection', {
          // const token = localStorage.getItem('token');
          setIsLoading(true);

        const response = await getProtectedUser(token);
        response?.data && setRole(response?.data?.role);

        setIsLoading(false);
      } catch (error) {
        localStorage.removeItem('token');
        setRole(null);
        if (error?.response?.status === 403) return alert('You are not an admin');
        alert(error?.response?.status === 401 ? 'Access denied' : 'Invalid token');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) handleLogin();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoaderComponent size="100px"/>
      </div>
    );
  }

  if (!role && !localStorage.getItem('token')) {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Рэгістрацыя</h1>
        <Register />
        <h1 style={{textAlign: 'center'}}>Аўтарызацыя</h1>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      {role === UserRole.Admin && <Main />}
    </div>
  );
};

export default App;
