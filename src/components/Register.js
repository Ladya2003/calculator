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
      // TODO: remove
      // const response = await axios.post('https://calculator-d04j.onrender.com/register', { login, password, confirmPassword });
      // const response = await axios.post('http://localhost:5000/register', { login, password, confirmPassword });
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
      <input type="text" placeholder="Login" value={login} onChange={(e) => setLogin(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
