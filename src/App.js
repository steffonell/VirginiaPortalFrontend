import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "./App.css";
import { ApplicationContext } from "./components/ApplicationContext";
import Login from "./components/Login";
import { eventEmitter } from '../src/components/apiService';
import ProtectedRoutes from "./components/ProtectedRoutes";

const App = () => {

  const { authenticated, userRole, logout  } = useContext(ApplicationContext);

  useEffect(() => {
    const unauthorizedHandler = () => {
      logout();
    };
    
    eventEmitter.on('unauthorized', unauthorizedHandler);
  
    // cleanup
    return () => {
      eventEmitter.off('unauthorized', unauthorizedHandler);
    };
  }, []);

  function ProtectedComponent(Component, userRole, allowedRoles, props) {
    const user = JSON.parse(localStorage.getItem('user')); 
    const token = user ? user.accessToken : null;
  
    if (!authenticated) {
      return <Navigate to="/" replace />;
    } else if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/forbidden" replace />;
    } else {
      return <Component {...props} />;
    }
  }  

  return (
    <BrowserRouter>
      {authenticated ? (
        <ProtectedRoutes userRole={userRole} ProtectedComponent={ProtectedComponent} />
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Add this line */}
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
