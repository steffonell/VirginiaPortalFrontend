import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicationContext } from "./ApplicationContext";

export const useLogout = () => {
  const { logout } = useContext(ApplicationContext);
  const navigate = useNavigate();

  return () => {
    logout();
    navigate("/");
  };
};
