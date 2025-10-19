import { Outlet, Link, useLocation } from "react-router";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/react-router";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  faHome,
  faChartLine,
  faWallet,
  faUser,
  faTimes,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PredictorLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/predictor", icon: faHome },
    { name: "Active Pools", href: "/predictor/pools", icon: faChartLine },
    {
      name: "My Predictions",
      href: "/predictor/predictions",
      icon: faBrain,
    },
    { name: "Wallet", href: "/predictor/wallet", icon: faWallet },
    { name: "Profile", href: "/predictor/profile", icon: faUser },
  ];

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          {/* Mobile sidebar */}
          <div
            className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}
          >
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
              <div className="flex h-16 items-center justify-between px-4">
                <h1 className="text-xl font-bold text-gray-900">
                  Creator Pool
                </h1>
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
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="mr-3 text-lg"
                    />
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
              title="Predictor Dashboard"
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
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
