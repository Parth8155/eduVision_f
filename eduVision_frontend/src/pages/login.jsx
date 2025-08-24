import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle,
  Users,
  TrendingUp,
  Zap,
  AlertCircle,
  Mail,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (state?.message) {
      toast.success(state.message);
      if (state.email) {
        setEmail(state.email);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value.trim()))
          return "Please enter a valid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const newErrors = { ...errors };
    delete newErrors.email;
    if (touched.email) {
      const error = validateField("email", value);
      if (error) {
        newErrors.email = error;
      }
    }
    setErrors(newErrors);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const newErrors = { ...errors };
    delete newErrors.password;
    if (touched.password) {
      const error = validateField("password", value);
      if (error) {
        newErrors.password = error;
      }
    }
    setErrors(newErrors);
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error || undefined,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    setTouched({ email: true, password: true });
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
      const response = await authService.login({
        email: email.trim(),
        password,
        rememberMe,
      });
      if (response.success) {
        toast.success(response.message || "Login successful!");
        authService.setupTokenRefresh();
        navigate("/dashboard");
      } else {
        if (response.code === "USER_NOT_FOUND") {
          setErrors({ email: "No account found with this email address" });
          toast.error("Account not found. Please check your email or sign up.");
        } else if (response.code === "INVALID_PASSWORD") {
          setErrors({ password: "Incorrect password" });
          toast.error("Incorrect password. Please try again.");
        } else if (response.code === "ACCOUNT_SUSPENDED") {
          toast.error(
            "Your account has been suspended. Please contact support."
          );
        } else if (response.code === "ACCOUNT_DELETED") {
          toast.error(
            "This account has been deleted. Please create a new account."
          );
        } else if (response.errors && response.errors.length > 0) {
          const backendErrors = {};
          response.errors.forEach((error) => {
            if (error.includes("Email")) backendErrors.email = error;
            if (error.includes("Password")) backendErrors.password = error;
          });
          setErrors(backendErrors);
          toast.error("Please fix the errors and try again");
        } else {
          toast.error(response.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
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
                to="/register"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back to StudyAI
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to access your personalized study materials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={() => handleBlur("email", email)}
                      className={`w-full px-3 py-3 pl-10 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3.5" />
                    {errors.email && touched.email && (
                      <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-3.5" />
                    )}
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={() => handleBlur("password", password)}
                      className={`w-full px-3 py-3 pl-10 pr-10 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3.5" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                    disabled={loading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !email.trim() || !password}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-300 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Features (same as before) */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-12">
          <div className="max-w-lg text-white">
            <h3 className="text-3xl font-bold mb-8">
              Simplified Study Materials, Seamless Everywhere
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    AI-Powered Study Tools
                  </h4>
                  <p className="text-blue-100">
                    Generate smart summaries, flashcards, and quizzes from your
                    notes automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    Collaborative Learning
                  </h4>
                  <p className="text-blue-100">
                    Share notes and study materials with classmates seamlessly.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    Progress Tracking
                  </h4>
                  <p className="text-blue-100">
                    Monitor your learning progress with detailed analytics and
                    insights.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Instant Access</h4>
                  <p className="text-blue-100">
                    Access your study materials anywhere, anytime across all
                    devices.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">10,000+</div>
                <div className="text-blue-200 text-sm">Notes Processed</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-blue-200 text-sm">OCR Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50k+</div>
                <div className="text-blue-200 text-sm">Questions Generated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
