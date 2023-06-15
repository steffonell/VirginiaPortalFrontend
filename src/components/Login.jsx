import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicationContext } from "./ApplicationContext";
import ClientDataService from "../services/CustomerService";
import axiosInstance, { setAuthToken } from "./apiService";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setLoggedInClient, setAuthenticated, setUserRole } = useContext(ApplicationContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post("auth/signin", {
        username,
        password,
      });

      console.log('API response: %O', response.data);
      if (response.data.accessToken) {
        const { accessToken, customer, roles } = response.data;
        localStorage.setItem("user", JSON.stringify(response.data));
        setAuthToken(accessToken);
        setUserRole(roles[0]);
        setAuthenticated(true);

        if (roles[0] === "ROLE_FAKTURISTA" || roles[0] === "ROLE_MAGACIONER") {
          navigate("/indents");
        } else {
          setLoggedInClient(customer);
          navigate("/shop");
        }

      } else {
        setError("Netačni kredencijali");
      }
    } catch (error) {
      console.error("Greška prilikom prijavljivanja", error);
      setError("Netačni kredencijali");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Prijava na Virdžinija Portal</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Korisničko ime</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Šifra</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Potvrdi</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
