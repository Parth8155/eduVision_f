import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle,
  Users,
  TrendingUp,
  Zap,
  User,
  Mail,
  Lock,
  AlertCircle,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    isValid: false,
  });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
  };

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }
    if (/[^a-zA-Z\d]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }
    return {
      score,
      feedback,
      isValid: score >= 4,
    };
  };

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (!validateName(value.trim()))
          return "First name can only contain letters, spaces, hyphens, and apostrophes (2-50 characters)";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (!validateName(value.trim()))
          return "Last name can only contain letters, spaces, hyphens, and apostrophes (2-50 characters)";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value.trim()))
          return "Please enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (value.length >= 6) {
          if (!/(?=.*[a-z])/.test(value))
            return "Password must contain at least one lowercase letter";
          if (!/(?=.*[A-Z])/.test(value))
            return "Password must contain at least one uppercase letter";
          if (!/(?=.*\d)/.test(value))
            return "Password must contain at least one number";
        }
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
    if (
      name === "confirmPassword" ||
      (name === "password" && formData.confirmPassword)
    ) {
      const confirmPasswordError = validateField(
        "confirmPassword",
        name === "confirmPassword" ? value : formData.confirmPassword
      );
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmPasswordError || undefined,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error || undefined,
    }));
  };

  const isFormValid = () => {
    const hasAllRequiredFields =
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password !== "" &&
      formData.confirmPassword !== "" &&
      acceptTerms;
    if (!hasAllRequiredFields) {
      return false;
    }
    const tempErrors = {};
    tempErrors.firstName = validateField("firstName", formData.firstName);
    tempErrors.lastName = validateField("lastName", formData.lastName);
    tempErrors.email = validateField("email", formData.email);
    tempErrors.password = validateField("password", formData.password);
    tempErrors.confirmPassword = validateField(
      "confirmPassword",
      formData.confirmPassword
    );
    const actualErrors = Object.keys(tempErrors).filter(
      (key) => tempErrors[key]
    );
    return actualErrors.length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.firstName = validateField("firstName", formData.firstName);
    newErrors.lastName = validateField("lastName", formData.lastName);
    newErrors.email = validateField("email", formData.email);
    newErrors.password = validateField("password", formData.password);
    newErrors.confirmPassword = validateField(
      "confirmPassword",
      formData.confirmPassword
    );
    if (!acceptTerms) {
      newErrors.terms = "Please accept the terms and conditions";
    }
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors below and try again");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      if (response.success) {
        toast.success(response.message || "Registration successful!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setAcceptTerms(false);
        setErrors({});
        setTouched({});
        setTimeout(() => {
          navigate("/login", {
            state: {
              message:
                "Account created successfully! Please sign in with your credentials.",
              email: formData.email.trim(),
            },
          });
        }, 1500);
      } else {
        if (response.code === "USER_EXISTS") {
          setErrors({ email: response.message });
          toast.error("An account with this email already exists");
        } else if (response.errors && response.errors.length > 0) {
          const backendErrors = {};
          response.errors.forEach((error) => {
            if (error.includes("First name")) backendErrors.firstName = error;
            if (error.includes("Last name")) backendErrors.lastName = error;
            if (error.includes("email")) backendErrors.email = error;
            if (error.includes("Password")) backendErrors.password = error;
          });
          setErrors(backendErrors);
          toast.error("Please fix the errors and try again");
        } else {
          toast.error(response.message || "Registration failed");
        }
      }
    } catch (error) {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordStrengthBar = ({ score }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            score <= 1
              ? "bg-red-500 w-1/5"
              : score <= 2
              ? "bg-orange-500 w-2/5"
              : score <= 3
              ? "bg-yellow-500 w-3/5"
              : score <= 4
              ? "bg-blue-500 w-4/5"
              : "bg-green-500 w-full"
          }`}
        ></div>
      </div>
    );
  };

  const getPasswordStrengthText = (score) => {
    if (score <= 1) return "Very Weak";
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                StudyAI
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Home
              </Link>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                About
              </a>
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Left Side - Registration Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Join StudyAI Today
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Transform your study experience with AI-powered tools
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-3 pl-10 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.firstName && touched.firstName
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="John"
                        disabled={loading}
                      />
                      <User className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3.5" />
                      {errors.firstName && touched.firstName && (
                        <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-3.5" />
                      )}
                    </div>
                    {errors.firstName && touched.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-3 pl-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.lastName && touched.lastName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Doe"
                        disabled={loading}
                      />
                      <User className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                      {errors.lastName && touched.lastName && (
                        <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-3.5" />
                      )}
                    </div>
                    {errors.lastName && touched.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-3 pl-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="john.doe@example.com"
                      disabled={loading}
                    />
                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                    {errors.email && touched.email && (
                      <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-3.5" />
                    )}
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-3 pl-10 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Create a strong password"
                      disabled={loading}
                    />
                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">
                          Password strength:
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.score <= 2
                              ? "text-red-600"
                              : passwordStrength.score <= 3
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {getPasswordStrengthText(passwordStrength.score)}
                        </span>
                      </div>
                      <PasswordStrengthBar score={passwordStrength.score} />
                      {passwordStrength.feedback.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-gray-600">
                            Password needs:
                          </p>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {passwordStrength.feedback.map(
                              (feedback, index) => (
                                <li key={index}>{feedback}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-3 pl-10 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500"
                          : formData.confirmPassword && !errors.confirmPassword
                          ? "border-green-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm your password"
                      disabled={loading}
                    />
                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      {formData.confirmPassword &&
                        !errors.confirmPassword &&
                        formData.password === formData.confirmPassword && (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        )}
                      <button
                        type="button"
                        className="pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (errors.terms) {
                      setErrors((prev) => ({ ...prev, terms: undefined }));
                    }
                  }}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 ${
                    errors.terms ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                <label
                  htmlFor="accept-terms"
                  className="ml-3 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-600 to-blue-700 items-center justify-center p-12">
          <div className="max-w-lg text-white">
            <h3 className="text-3xl font-bold mb-8">
              Start Your AI-Powered Learning Journey
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    Free to Get Started
                  </h4>
                  <p className="text-green-100">
                    Begin with our free plan and upgrade as you grow. No credit
                    card required.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Instant Setup</h4>
                  <p className="text-green-100">
                    Create your account and start uploading notes immediately.
                    Setup takes less than 2 minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    Join Thousands of Students
                  </h4>
                  <p className="text-green-100">
                    Be part of a growing community of students who are studying
                    smarter, not harder.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Proven Results</h4>
                  <p className="text-green-100">
                    Students report 40% improvement in study efficiency and
                    better exam performance.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">
                  What you get with your free account:
                </h4>
                <ul className="space-y-2 text-green-100">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Upload up to 10 notes per month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    AI-powered OCR text extraction
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Basic study material generation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Access to study tools
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
