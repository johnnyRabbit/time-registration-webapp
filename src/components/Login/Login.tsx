import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons library
import { useNavigate } from "react-router-dom";
import { userAuthenticate } from "../../api/request";
import loginImage from "./img/kameleon_logo.svg"; // Import your login image

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Please fill in all required fields.");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      setError("");
      const response = await userAuthenticate(email, password);

      console.log("Login Successful:", response);

      navigate("/user/time-registration");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const goToForgotPassword = () => {
    navigate("/account/forgot-password");
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-100 ">
        <div className="mb-8 mt-8 flex-col ">
          <img src={loginImage} alt="Login" />{" "}
          <label className="flex items-center content-center justify-center text-xl mt-4 font-bold text-gray-400">
            Time Registration
          </label>
        </div>

        {/* Replace the text with an image */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex flex-col mb-4">
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex flex-col mb-2 relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 pr-10"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute  top-4 transform -translate-y-1 right-2	"
          >
            {showPassword ? (
              <FaEyeSlash size={20} className="text-gray-500 " />
            ) : (
              <FaEye size={20} className="text-gray-500" />
            )}
          </button>
        </div>
        <div className="flex justify-end mb-6">
          <button
            className="text-sm text-gray-500 hover:underline"
            onClick={goToForgotPassword}
          >
            Forgot Password?
          </button>
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-all duration-200 w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
