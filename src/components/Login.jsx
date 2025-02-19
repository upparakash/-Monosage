import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

// Validation Schema for Login and Registration
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const registerSchema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isRegister ? registerSchema : loginSchema),
  });

 
const onLoginSubmit = async (data) => {
  setErrorMessage(""); // Reset error before sending request

  try {
    await login(data);
    navigate("/dashboard");
  } catch (error) {
    console.error("Login Error:", error.response ? error.response.data : error.message);
    setErrorMessage(error.response?.data || "Invalid login. Try again.");
  }
};
  
  
  

const onRegisterSubmit = async (data) => {
  setErrorMessage("");
  setSuccessMessage("");

  try {
    await axios.post("http://localhost:5000/api/register", data);
    setSuccessMessage("Registration successful! Please login.");
    alert("Registration successful! Please login."); // Success alert
    setIsRegister(false);
  } catch (error) {
    if (error.response && error.response.data.error === "Email already exists") {
      setErrorMessage(error.response.data.error);
      alert("Error: Email already exists!"); // Show alert when email is taken
    } else {
      setErrorMessage("Registration failed. Please try again.");
      alert("Registration failed. Please try again.");
    }
  }
};


  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit(isRegister ? onRegisterSubmit : onLoginSubmit)}>
          {isRegister && (
            <>
              <input type="text" {...register("name")} placeholder="Full Name" />
              {errors.name && <p className="error">{errors.name.message}</p>}
            </>
          )}
          <input type="email" {...register("email")} placeholder="Email" />
          {errors.email && <p className="error">{errors.email.message}</p>}
          <input type="password" {...register("password")} placeholder="Password" />
          {errors.password && <p className="error">{errors.password.message}</p>}
          <button type="submit">{isRegister ? "Register" : "Login"}</button>
        </form>
        <p onClick={() => setIsRegister(!isRegister)} className="toggle-link">
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
};

export default Login;
