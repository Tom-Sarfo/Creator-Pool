import type { Route } from "./+types/dashboard";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/react-router";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Creator Pool" },
    { name: "description", content: "Your Creator Pool dashboard." },
  ];
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 5v10l8-5-8-5z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800">
                Creator Pool
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>

        <SignedIn>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your predictions and track your performance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Total Predictions
              </h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Win Rate
              </h3>
              <p className="text-3xl font-bold text-green-600">0%</p>
              <p className="text-sm text-gray-500 mt-1">Accuracy</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Total Earnings
              </h3>
              <p className="text-3xl font-bold text-blue-600">$0.00</p>
              <p className="text-sm text-gray-500 mt-1">Lifetime</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Activity
              </h2>
              <div className="text-center py-8 text-gray-500">
                <p>No activity yet. Start by exploring pools!</p>
                <Link
                  to="/pools"
                  className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Explore Pools
                </Link>
              </div>
            </div>
          </div>
        </SignedIn>
      </main>
    </div>
  );
}
