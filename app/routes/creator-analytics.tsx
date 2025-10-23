import type { Route } from "./+types/creator-analytics";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUsers,
  faDollarSign,
  faTrophy,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import {
  CREATOR_ANALYTICS_DATA,
  CREATOR_ANALYTICS_POOL_PERFORMANCE,
  CREATOR_ANALYTICS_MONTHLY_DATA,
  TIME_RANGES,
} from "../lib/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Analytics - Creator Pool" },
    {
      name: "description",
      content: "View analytics and insights for your prediction pools.",
    },
  ];
}

export default function CreatorAnalytics() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Analytics
            </h1>
            <p className="text-gray-600">
              Insights and performance metrics for your prediction pools.
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faChartBar}
                className="w-12 h-12 text-orange-600"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Analytics Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              We're working on comprehensive analytics and insights for your
              prediction pools. Soon you'll be able to track performance, view
              detailed metrics, and get actionable insights.
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-orange-900 mb-3">
              <FontAwesomeIcon icon={faLightbulb} className="mr-2" />
              What to Expect
            </h3>
            <ul className="space-y-2 text-sm text-orange-800">
              <li>• Pool performance metrics and trends</li>
              <li>• Participant engagement analytics</li>
              <li>• Revenue and earnings tracking</li>
              <li>• Comparative insights across your content</li>
              <li>• Predictive analytics for future pools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
