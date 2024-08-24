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
    <Router>
      <div className="App">
        <header>
          <nav>
            <ul>
              <li><Link to="/calculator/main">Галоўная</Link></li>
              <li><Link to="/calculator/teachers">Настаўнікі</Link></li>
              <li><Link to="/calculator/students">Студэнты</Link></li>
              <li><Link to="/calculator/settings">Налады</Link></li>
              {isAuthenticated && <LogoutButton />}
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/calculator/login" element={<Login />} />
          <Route path="/calculator/main" element={<PrivateRoute isAuthenticated={isAuthenticated} component={Calculator} />} />
          <Route path="/calculator/teachers" element={<PrivateRoute isAuthenticated={isAuthenticated} component={Teachers} />} />
          <Route path="/calculator/students" element={<PrivateRoute isAuthenticated={isAuthenticated} component={Students} />} />
          <Route path="/calculator/settings" element={<PrivateRoute isAuthenticated={isAuthenticated} component={Settings} />} />
          <Route path="/calculator" element={<Navigate to="/calculator/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/calculator/login" />;
};

export default Main;
