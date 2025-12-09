import type { Route } from "./+types/signup";
import { Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { RegisterRequest, UserRole } from "../lib/types";
import { UserRole as UserRoleEnum } from "../lib/types";
import Loader from "../components/Loader";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign Up - Creator Pool" },
    {
      name: "description",
      content:
        "Create your Creator Pool account to start predicting video performance.",
    },
  ];
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, user, isAuthenticated } =
    useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    name: "",
    password: "",
    role: undefined,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Redirect based on user role after successful registration
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === UserRoleEnum.CREATOR) {
        navigate("/creator");
      } else if (user.role === UserRoleEnum.USER) {
        navigate("/predictor");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);

    // Clear validation error when user starts typing
    if (validationErrors.confirmPassword) {
      setValidationErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name || !formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      errors.role = "Please select your role";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      // Navigation will be handled by useEffect when user state updates
    } catch (error) {
      // Error is handled by AuthContext
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
              <FontAwesomeIcon icon={faPlay} className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Creator Pool
            </span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/login"
            className="font-medium text-orange-600 hover:text-orange-500"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                    validationErrors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.name}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                    validationErrors.email
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                I want to be a...
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                    validationErrors.role ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select your role</option>
                  <option value={UserRoleEnum.USER}>
                    Predictor - I want to predict video performance
                  </option>
                  <option value={UserRoleEnum.CREATOR}>
                    Creator - I want to create prediction pools for my videos
                  </option>
                </select>
                {validationErrors.role && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.role}
                  </p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                    validationErrors.password
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  />
                </button>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                    validationErrors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  />
                </button>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Registration Failed
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader size="sm" className="mr-2" />
                    Creating account...
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
