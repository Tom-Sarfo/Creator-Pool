import type { Route } from "./+types/creator-settings";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTv,
  faBell,
  faCreditCard,
  faLock,
  faCheckCircle,
  faEnvelope,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { CREATOR_SETTINGS_DATA } from "../lib/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings - Creator Pool" },
    {
      name: "description",
      content: "Manage your creator account settings and preferences.",
    },
  ];
}

export default function CreatorSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    poolCreated: true,
    poolSettled: true,
    newParticipant: false,
    weeklyReport: true,
  });

  const settingsData = CREATOR_SETTINGS_DATA;

  const tabs = [
    { id: "profile", name: "Profile", icon: faUser },
    { id: "youtube", name: "YouTube", icon: faTv },
    { id: "notifications", name: "Notifications", icon: faBell },
    { id: "billing", name: "Billing", icon: faCreditCard },
    { id: "privacy", name: "Privacy", icon: faLock },
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Manage your creator account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar navigation */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="mr-3 w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Profile Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={settingsData.displayName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={settingsData.bio}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* YouTube Tab */}
          {activeTab === "youtube" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                YouTube Integration
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
                      <FontAwesomeIcon
                        icon={faYoutube}
                        className="w-6 h-6 text-white"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Connected Channel
                      </p>
                      <p className="text-sm text-gray-600">
                        {settingsData.channelName}
                      </p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Disconnect
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Auto-sync Settings
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Automatically sync new videos
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Sync video statistics daily
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Include private videos in sync
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Pool Created
                        </p>
                        <p className="text-xs text-gray-500">
                          When you create a new prediction pool
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.poolCreated}
                          onChange={(e) =>
                            handleNotificationChange(
                              "poolCreated",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Pool Settled
                        </p>
                        <p className="text-xs text-gray-500">
                          When a pool is settled and results are available
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.poolSettled}
                          onChange={(e) =>
                            handleNotificationChange(
                              "poolSettled",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          New Participant
                        </p>
                        <p className="text-xs text-gray-500">
                          When someone joins your prediction pool
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.newParticipant}
                          onChange={(e) =>
                            handleNotificationChange(
                              "newParticipant",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Weekly Report
                        </p>
                        <p className="text-xs text-gray-500">
                          Weekly summary of your pool performance
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReport}
                          onChange={(e) =>
                            handleNotificationChange(
                              "weeklyReport",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Billing & Payments
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="w-5 h-5 text-green-600 mr-2"
                    />
                    <p className="text-sm font-medium text-green-800">
                      Creator Account - Free Plan
                    </p>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    No monthly fees. You only pay when you earn from pools.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </h3>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center mr-3">
                        <FontAwesomeIcon
                          icon={faCreditCard}
                          className="w-5 h-5 text-white"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          **** **** **** 1234
                        </p>
                        <p className="text-xs text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                      Update
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Earnings History
                  </h3>
                  <div className="space-y-2">
                    {settingsData.earningsHistory.map((earning, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-sm text-gray-600">
                          {earning.month}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {earning.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Privacy & Security
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Account Visibility
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        defaultChecked
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Public - Anyone can see my pools and participate
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Private - Only followers can see my pools
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Data Sharing
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Share anonymous analytics with Creator Pool
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Allow my content to be featured in marketing
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Account Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      Export My Data
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom navigation hint */}
      <div className="lg:hidden mt-8 p-4 bg-orange-50 rounded-lg">
        <p className="text-sm text-orange-700 text-center">
          <FontAwesomeIcon icon={faLightbulb} className="mr-1" />
          Use the settings menu above to navigate between different sections
        </p>
      </div>
    </div>
  );
}
