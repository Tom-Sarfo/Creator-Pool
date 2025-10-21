import type { Route } from "./+types/home";
import { Link } from "react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Creator Pool - Predict YouTube Video Performance" },
    {
      name: "description",
      content:
        "Join prediction pools for upcoming videos, showcase your insights, and earn rewards when you're right. It's not gambling—it's community engagement.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <FontAwesomeIcon icon="play" className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Creator Pool
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Go to Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Link
                  to="/onboarding"
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/onboarding"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Get Started
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Predict YouTube Video Performance
            <span className="text-purple-600">
              {" "}
              With Your Favorite Creators
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join prediction pools for upcoming videos, showcase your insights,
            and earn rewards when you're right. It's not gambling it's community
            engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors text-center"
            >
              Get Started
            </Link>
            <Link
              to="/pools"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors text-center"
            >
              Explore Pools
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start predicting and earning rewards
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon
                  icon="video"
                  className="w-8 h-8 text-purple-600"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Creators Create Pools
              </h3>
              <p className="text-gray-600">
                Creators upload unlisted videos and create prediction pools with
                questions like "Will this reach 50K views in 24 hours?"
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon
                  icon="chart-line"
                  className="w-8 h-8 text-blue-600"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Fans Make Predictions
              </h3>
              <p className="text-gray-600">
                Predictors join pools by making predictions and staking rewards.
                The more accurate you are, the more you earn.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon
                  icon="check-circle"
                  className="w-8 h-8 text-green-600"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Earn Rewards
              </h3>
              <p className="text-gray-600">
                When videos go live and results are revealed, accurate
                predictors share the reward pool proportionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600">Active Predictors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Creators</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                $2M+
              </div>
              <div className="text-gray-600">Pool Rewards</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Predicting?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of predictors and creators in the most engaging way
            to interact with YouTube content.
          </p>
          <Link
            to="/onboarding"
            className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <FontAwesomeIcon icon="play" className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">Creator Pool</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Creator Pool. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
