import { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { ApplicationContext } from "./ApplicationContext";

const AuthenticatedRoute = ({ element, ...rest }) => {
  const { authenticated } = useContext(ApplicationContext);

  if (!authenticated) {
    return <Navigate to="/" />;
  }

  return <Route {...rest} element={element} />;
};

export default AuthenticatedRoute;
