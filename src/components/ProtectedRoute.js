import React, { useContext } from "react";
import { Route, useNavigate, Outlet } from "react-router-dom";
import { ApplicationContext } from "./ApplicationContext";

const ProtectedRoute = ({ path, element, allowedRoles, ...rest }) => {
  const { authenticated, userRole } = useContext(ApplicationContext);
  const navigate = useNavigate();

  if (!authenticated) {
    return  <Outlet />;;
  }

  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(userRole)) {
    return  <Outlet />;;
  }

  return <Route path={path} element={element} {...rest} />;
};

export default ProtectedRoute;
