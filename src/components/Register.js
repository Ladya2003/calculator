// src/Register.js
import { useState } from 'react';
import { createUser } from '../api/users';

const Register = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser({ login, password, confirmPassword });
      alert(response.data.message);
      setLogin('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="Лагін" value={login} onChange={(e) => setLogin(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="password" placeholder="Пацвердзіць пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      <button type="submit">Зарэгістравацца</button>
    </form>
  );
};

export default Register;
