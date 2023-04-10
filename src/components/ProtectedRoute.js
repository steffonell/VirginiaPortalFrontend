import useContext from "react";
import { useClientContext } from "./ClientContext";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { ApplicationContext } from "./ApplicationContext";

const ProtectedRoute = ({element }) => {
  const { loggedInClient } = useContext(ApplicationContext);
  const isAuthenticated = true;
  const navigate = useNavigate();

  return isAuthenticated ? (
   element 
  ) : (
    navigate(`/login`)
  );
};

export default ProtectedRoute;
