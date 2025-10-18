import type { Route } from "./+types/onboarding";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Choose Your Role - Creator Pool" },
    {
      name: "description",
      content:
        "Choose whether you want to be a Creator or Predictor on Creator Pool.",
    },
  ];
}

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center mb-8">
            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
              <FontAwesomeIcon icon="play" className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">
              Creator Pool
            </span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select how you'd like to participate in Creator Pool. You can always
            change this later in your settings.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Creator Card */}
          <Link
            to="/creator"
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 p-8"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <FontAwesomeIcon
                  icon="video"
                  className="w-10 h-10 text-purple-600"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Creator</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Upload unlisted YouTube videos and create prediction pools for
                your audience. Earn rewards when your content performs well and
                engage with your community in a new way.
              </p>

              {/* Creator Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="w-4 h-4 text-green-500 mr-2"
                  />
                  Create prediction pools for your videos
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="w-4 h-4 text-green-500 mr-2"
                  />
                  Earn rewards from pool participation
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="w-4 h-4 text-green-500 mr-2"
                  />
                  Build deeper fan engagement
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="w-4 h-4 text-green-500 mr-2"
                  />
                  Access creator analytics and insights
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700 font-medium">
                  Perfect for YouTube creators with 1K+ subscribers
                </p>
              </div>
            </div>
          </Link>

          {/* Predictor Card */}
          <Link
            to="/predictor"
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 p-8"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <FontAwesomeIcon
                  icon="chart-line"
                  className="w-10 h-10 text-blue-600"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Predictor
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Predict how YouTube videos will perform and earn rewards when
                you're right. Show off your insights and compete with other
                predictors in the community.
              </p>

              {/* Predictor Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="w-4 h-4 text-green-500 mr-2"
                  />
                  Predict video performance outcomes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="w-4 h-4 text-green-500 mr-2"
                  />
                  Earn rewards for accurate predictions
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="w-4 h-4 text-green-500 mr-2"
                  />
                  Track your prediction accuracy
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FontAwesomeIcon
                    icon="check-circle"
                    className="w-4 h-4 text-green-500 mr-2"
                  />
                  Compete on leaderboards
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium">
                  Great for fans who love predicting content performance
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
