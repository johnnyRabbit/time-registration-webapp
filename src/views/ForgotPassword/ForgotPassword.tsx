import React, { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons library
import { useNavigate } from "react-router-dom";
import { userForgotPassword } from "../../api/request";
import loginImage from "./img/kameleon_logo.svg"; // Import your login image

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoginSuccessful, setIsLoginSucessful] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (isLoginSuccessful) {
      navigate("/account/login");
    } else {
      try {
        if (!email) {
          setError("Please fill in all required fields.");
          return;
        }

        if (!validateEmail(email)) {
          setError("Please enter a valid email address.");
          return;
        }

        setError("");

        const response = await userForgotPassword(email);
        setIsLoginSucessful(response);
      } catch (error) {
        console.error("Login Error:", error);
      }
    }
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-100 ">
        <div>
          <button className=" text-[#5a5c69]" onClick={goBack}>
            <FaArrowLeft />
          </button>
        </div>
        <div className="mb-8 mt-8 flex-col ">
          <img src={loginImage} alt="Login" />{" "}
          <label className="flex items-center content-center justify-center text-base mt-6 text-[#1c85e8]">
            {isLoginSuccessful
              ? "Operation was successful"
              : "Reset your password"}
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex flex-col mb-4">
          {!isLoginSuccessful && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
          )}
        </div>

        <button
          onClick={handleForgotPassword}
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-all duration-200 w-full"
        >
          {isLoginSuccessful ? "Return to Login" : "Send a Reset Link"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
