import React from 'react';
import { redirect } from 'react-router-dom';

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    redirect('/login');
    if (typeof window !== 'undefined') window.location.reload();
  };

  return (
    <button onClick={handleLogout}>
      Выйсці
    </button>
  );
};

export default LogoutButton;
