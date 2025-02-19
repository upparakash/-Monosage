import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", credentials);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
