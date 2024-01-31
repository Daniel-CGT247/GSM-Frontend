import axios from "axios";
import { useEffect, useState } from "react";
import endpoint from "../utils/endpoint";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh_token")
  );

  useEffect(() => {
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, [accessToken]);

  const login = async (formData) => {
    try {
      const response = await axios.post(
        `${endpoint}/auth/jwt/create`,
        formData
      );
      const { access_token, refresh_token } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Set tokens in state
      setAccessToken(access_token);
      setRefreshToken(refresh_token);

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error.response.data);
    }
  };

  const logout = () => {
    // Clear tokens from localStorage and state
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
  };

  // Add token refresh logic here (if needed)

  return { isLoggedIn, accessToken, refreshToken, login, logout };
};

export default useAuth;
