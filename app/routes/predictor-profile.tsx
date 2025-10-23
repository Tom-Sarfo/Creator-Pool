import { useState } from "react";
import {
  PREDICTOR_PROFILE_DATA,
  PREDICTOR_PROFILE_ACHIEVEMENTS,
} from "../lib/constants";

export default function PredictorProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  const profileData = PREDICTOR_PROFILE_DATA;
  const achievements = PREDICTOR_PROFILE_ACHIEVEMENTS;

  const stats = [
    {
      label: "Total Predictions",
      value: profileData.totalPredictions.toString(),
      icon: "📊",
    },
    { label: "Win Rate", value: `${profileData.winRate}%`, icon: "🎯" },
    {
      label: "Total Earnings",
      value: `$${profileData.totalEarnings.toLocaleString()}`,
      icon: "💰",
    },
    { label: "Current Rank", value: profileData.rank, icon: "🏆" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and view your achievements
        </p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-bold">
              {profileData.username.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {profileData.username}
              </h2>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                {profileData.rank}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{profileData.email}</p>
            <p className="text-sm text-gray-500">
              Member since {profileData.joinDate}
            </p>
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Badges */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {profileData.badges.map((badge, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cyan-100 text-cyan-800 text-sm font-medium rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "achievements"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "preferences"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Preferences
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Security
                </h3>
                <div className="space-y-4">
                  <button className="w-full md:w-auto bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                    Change Password
                  </button>
                  <button className="w-full md:w-auto bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                    Enable Two-Factor Authentication
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.unlocked
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-2xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}
                      >
                        {achievement.icon}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                        {achievement.unlocked && achievement.date && (
                          <p className="text-xs text-green-600 mt-1">
                            Unlocked {achievement.date}
                          </p>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Pool Notifications
                      </p>
                      <p className="text-sm text-gray-600">
                        Get notified about new pools from your favorite creators
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Prediction Results
                      </p>
                      <p className="text-sm text-gray-600">
                        Get notified when your predictions are settled
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Marketing Emails
                      </p>
                      <p className="text-sm text-gray-600">
                        Receive updates about new features and promotions
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Privacy Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Public Profile
                      </p>
                      <p className="text-sm text-gray-600">
                        Allow others to view your prediction history
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
