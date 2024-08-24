import React from 'react';
import { redirect } from 'react-router-dom';

const LogoutButton = () => {
  const handleLogout = () => {
    window.location.href = 'https://ladya2003.github.io/calculator/';
    localStorage.removeItem('token');
    if (typeof window !== 'undefined') window.location.reload();
  };

  return (
    <button onClick={handleLogout}>
      Выйсці
    </button>
  );
};

export default LogoutButton;
