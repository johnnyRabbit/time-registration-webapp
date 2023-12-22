import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userResetPassword } from "../../api/request";
import loginImage from "./img/kameleon_logo.svg"; // Import your login image
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa"; // Import eye icons from react-icons library

const SetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const [isLoginSuccessful, setIsLoginSucessful] = useState<boolean>(false);

  const handleSetPassword = async () => {
    try {
      if (!confirmPassword || !password) {
        setError("Please fill in all required fields.");
        return;
      }

      if (!passwordMatch) {
        setError("Passwords does not match!");
        return;
      }

      setError("");

      const userName = urlParams.get("UserName");
      const code = urlParams.get("Code");

      const response = await userResetPassword(
        password,
        confirmPassword,
        userName || "",
        code || ""
      );
      setIsLoginSucessful(response);

      console.log("Login Successful:", response);

      navigate("/account/login");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    // Check if passwords match whenever the password field changes
    setPasswordMatch(event.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
    // Check if passwords match whenever the confirm password field changes
    setPasswordMatch(event.target.value === password);
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 8 || password.length > 100) {
      return false;
    }

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);

    return hasLowercase && hasUppercase;
  };

  const goBack = () => {
    navigate("/account/login");
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
          <img src={loginImage} alt="Login" />
          <label className="flex items-center content-center justify-center text-base mt-6 text-[#1c85e8]">
            {isLoginSuccessful
              ? "Operation was successful"
              : "Set your password"}
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex flex-col mb-2 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={handlePasswordChange}
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
        <div className="flex flex-col mb-2 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="border border-gray-300 rounded px-3 py-2 pr-10"
            required
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute  top-4 transform -translate-y-1 right-2	"
          >
            {showConfirmPassword ? (
              <FaEyeSlash size={20} className="text-gray-500 " />
            ) : (
              <FaEye size={20} className="text-gray-500" />
            )}
          </button>
        </div>

        <button
          onClick={handleSetPassword}
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-all duration-200 w-full"
        >
          {isLoginSuccessful ? "Return to Login" : "Set New Password"}
        </button>
      </div>
    </div>
  );
};

export default SetPassword;
