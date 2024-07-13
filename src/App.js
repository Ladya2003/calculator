// src/App.js
// import React from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import Calculator from "./Calculator";

const App = () => {
  const handleLogin = (response) => {
    console.log(response);
    // Verify the token on your backend server
  };

  return (
    // <GoogleOAuthProvider clientId="560836881551-ffaqd19krr1o5ef8ategm9dlkjol80ij.apps.googleusercontent.com">
    //   <div className="App">
    //     <h1>Calculator Application</h1>
    //     <GoogleLogin onSuccess={handleLogin} onError={() => console.log('Login Failed')} />
    //   </div>
    // </GoogleOAuthProvider>
    <Calculator />
  );
};

export default App;