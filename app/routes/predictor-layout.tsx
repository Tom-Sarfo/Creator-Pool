import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import { UserRole as UserRoleEnum } from "../lib/types";
import {
  faHome,
  faChartLine,
  faWallet,
  faUser,
  faTimes,
  faBrain,
  faUsersRectangle,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PredictorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/predictor", icon: faHome },
    { name: "Active Pools", href: "/predictor/pools", icon: faUsersRectangle },
    {
      name: "My Predictions",
      href: "/predictor/predictions",
      icon: faBrain,
    },
    { name: "Wallet", href: "/predictor/wallet", icon: faWallet },
    { name: "Profile", href: "/predictor/profile", icon: faUser },
  ];

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access the predictor dashboard.
          </p>
          <Link
            to="/login"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Redirect to appropriate dashboard if user doesn't have predictor role
  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRole("predictor")) {
      if (user?.role === UserRoleEnum.CREATOR) {
        navigate("/creator");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, hasRole, user, navigate]);

  // Show access denied message if user is not a predictor
  // Check if user role is USER (predictor role) - handle both enum and string values
  const userRole = user?.role as string | UserRoleEnum | undefined;
  const isPredictor =
    userRole === UserRoleEnum.USER ||
    userRole === "user" ||
    userRole === "predictor";
  if (!isLoading && isAuthenticated && !isPredictor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have access to predictor pages. Your current role:{" "}
            {user?.role || "unknown"}
            <br />
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
      >
        <div
          className="fixed inset-0 bg-gray-600 opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                <FontAwesomeIcon icon={faPlay} className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Creator Pool</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.href
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3 text-lg" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar navigation={navigation} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <Header
          title="Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={true}
          walletBalance={2450.0}
        />

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
