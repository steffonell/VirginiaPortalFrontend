import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ApplicationContext } from "./ApplicationContext";
import ClientDataService from "../services/CustomerService";
import axiosInstance, { setAuthToken } from "./apiService";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setLoggedInClient, setAuthenticated } = useContext(ApplicationContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // Add this line to prevent form submission
  
    try {
      const response = await axiosInstance.post("auth/signin", {
        username,
        password,
      });
  
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setAuthToken(response.data.accessToken);
        setLoggedInClient(response.data.user);
        navigate("/home");
        setAuthenticated(true);
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login", error);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
