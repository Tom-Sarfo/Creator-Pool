import type { Route } from "./+types/creator-layout";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTimes,
  faBars,
  faSync,
  faSearch,
  faBell,
  faChartLine,
  faCog,
  faWallet,
  faHome,
  faUsersRectangle,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Creator Hub - Creator Pool" },
    {
      name: "description",
      content: "Manage your YouTube videos and prediction pools.",
    },
  ];
}

export default function CreatorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get the appropriate title based on current route
  const getPageTitle = () => {
    if (location.pathname === "/creator") {
      return "Creator Hub";
    }
    if (location.pathname.match(/^\/creator\/pools\/\d+$/)) {
      return "Pool Details";
    }
    if (location.pathname.startsWith("/creator/pools")) {
      return "Pools";
    }
    if (location.pathname.startsWith("/creator/analytics")) {
      return "Analytics";
    }
    if (location.pathname.startsWith("/creator/wallet")) {
      return "Wallet";
    }
    if (location.pathname.startsWith("/creator/settings")) {
      return "Settings";
    }
    return "Pool Details";
  };

  const navigation = [
    { name: "Dashboard", href: "/creator", icon: faHome },
    { name: "Pools", href: "/creator/pools", icon: faUsersRectangle },
    { name: "Analytics", href: "/creator/analytics", icon: faChartLine },
    { name: "YouTube", href: "/creator/youtube-settings", icon: faYoutube },
    { name: "Wallet", href: "/creator/wallet", icon: faWallet },
    { name: "Settings", href: "/creator/settings", icon: faCog },
  ];

  const isActive = (href: string) => {
    if (href === "/creator") {
      return location.pathname === "/creator";
    }
    return location.pathname.startsWith(href);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
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
            Please sign in to access the creator dashboard.
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

  // Redirect to appropriate dashboard if user doesn't have creator role
  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRole("creator")) {
      if (user?.role === "predictor") {
        navigate("/predictor");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, hasRole, user, navigate]);

  // Show access denied message if user is not a creator
  if (!isLoading && isAuthenticated && !hasRole("creator")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have access to creator pages. Redirecting to your
            dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar navigation={navigation} showSettings={false} />
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                <FontAwesomeIcon icon={faPlay} className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                Creator Pool
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3 w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Creator Hub
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Manage your content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:pl-64 w-full overflow-hidden">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={true}
          walletBalance={0}
          showSyncButton={false}
          showSearchBar={location.pathname === "/creator"}
        />

        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
