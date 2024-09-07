import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Calculator from './Calculator';
import Teachers from './Teachers';
import Students from './Students';
import Settings from './Settings';
import Login from './Login';
import LogoutButton from './LogoutButton';
import './styles/Main.css';

const Main = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router basename="/calculator">
      <div className="App">
        <header>
          <nav>
            <ul>
              <li><Link to="/main">Галоўная</Link></li>
              <li><Link to="/teachers">Настаўнікі</Link></li>
              <li><Link to="/students">Студэнты</Link></li>
              <li><Link to="/settings">Налады</Link></li>
              {isAuthenticated && <LogoutButton />}
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<PrivateRoute isAuthenticated={isAuthenticated} component={Calculator} />} />
          <Route path="/teachers" element={<PrivateRoute isAuthenticated={isAuthenticated} component={Teachers} />} />
          <Route path="/students" element={<PrivateRoute isAuthenticated={isAuthenticated} component={Students} />} />
          <Route path="/settings" element={<PrivateRoute isAuthenticated={isAuthenticated} component={Settings} />} />
          <Route path="/" element={<Navigate to="/main" />} />
        </Routes>
      </div>
    </Router>
  );
};

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default Main;
