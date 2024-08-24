// src/Login.js
import React, { useState } from 'react';
import { loginUser } from '../api/users';

const Login = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ login, password });
      if (response?.data) localStorage.setItem('token', response?.data?.token);
      onLogin();
    } catch (error) {
      alert(error.response?.data.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="text" placeholder="Лагін" value={login} onChange={(e) => setLogin(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Увайсці</button>
    </form>
  );
};

export default Login;
