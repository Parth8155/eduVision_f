import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../services/authService";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new password reset.");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6)
      return "Password must be at least 6 characters long";
    if (password.length > 128)
      return "Password must be less than 128 characters";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(
      confirmPassword,
      password
    );
    const newErrors = {};
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      toast.success(
        "Password reset successfully! You can now login with your new password."
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
      if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("expired")
      ) {
        setTimeout(() => navigate("/forgot-password"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setTouched({ ...touched, password: true });
    const newErrors = { ...errors };
    delete newErrors.password;
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(confirmPassword, value);
      if (confirmError) {
        newErrors.confirmPassword = confirmError;
      } else {
        delete newErrors.confirmPassword;
      }
    }
    setErrors(newErrors);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setTouched({ ...touched, confirmPassword: true });
    const newErrors = { ...errors };
    const confirmError = validateConfirmPassword(value, password);
    if (confirmError) {
      newErrors.confirmPassword = confirmError;
    } else {
      delete newErrors.confirmPassword;
    }
    setErrors(newErrors);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Password Reset Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now login with
              your new password.
            </p>
            <Link
              to="/login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 inline-block text-center"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Set New Password
            </h1>
            <p className="text-gray-600">
              Please enter your new password below.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your new password"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>
            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Password Requirements:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      password.length >= 6 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  At least 6 characters long
                </li>
                <li className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      /(?=.*[a-z])/.test(password)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  One lowercase letter
                </li>
                <li className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      /(?=.*[A-Z])/.test(password)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      /(?=.*\d)/.test(password) ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  One number
                </li>
              </ul>
            </div>
            <button
              type="submit"
              disabled={
                loading ||
                Object.keys(errors).length > 0 ||
                !password ||
                !confirmPassword
              }
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
