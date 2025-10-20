import type { Route } from "./+types/creator-layout";
import { Outlet, Link, useLocation } from "react-router";
import { SignedIn, UserButton } from "@clerk/react-router";
import { useState } from "react";
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
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Creator Dashboard - Creator Pool" },
    {
      name: "description",
      content: "Manage your YouTube videos and prediction pools.",
    },
  ];
}

export default function CreatorLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get the appropriate title based on current route
  const getPageTitle = () => {
    if (location.pathname === "/creator") {
      return "Creator Hub";
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
    return "Creator Dashboard";
  };

  const navigation = [
    { name: "Dashboard", href: "/creator", icon: faHome },
    { name: "Pools", href: "/creator/pools", icon: faUsersRectangle },
    { name: "Analytics", href: "/creator/analytics", icon: faChartLine },
    { name: "Wallet", href: "/creator/wallet", icon: faWallet },
    { name: "Settings", href: "/creator/settings", icon: faCog },
  ];

  const isActive = (href: string) => {
    if (href === "/creator") {
      return location.pathname === "/creator";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <SignedIn>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <Sidebar navigation={navigation} showSettings={false} />
        </div>

        {/* Mobile sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Mobile header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="w-5 h-5 text-white"
                  />
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

            {/* Mobile navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3 w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile user section */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <UserButton afterSignOutUrl="/" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Creator Dashboard
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Manage your content
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top header */}
          <Header
            title={getPageTitle()}
            onMenuClick={() => setSidebarOpen(true)}
            showMenuButton={true}
            walletBalance={0}
            showSyncButton={location.pathname === "/creator"}
            showSearchBar={location.pathname === "/creator"}
          />

          {/* Page content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SignedIn>
  );
}
