import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPlay,
  faEye,
  faClock,
  faRefresh,
  faQuestionCircle,
  faChartLine,
  faRocket,
  faLightbulb,
  faShieldAlt,
  faCircle,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { RECENT_VIDEOS } from "../lib/constants";

interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  views?: number;
  status?: string;
  uploadDate?: string;
}

interface EnablePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  video?: VideoData | null;
  onEnablePool?: (poolData: any) => void;
}

export default function EnablePoolModal({
  isOpen,
  onClose,
  video,
  onEnablePool,
}: EnablePoolModalProps) {
  const [pledgeType, setPledgeType] = useState("fixed");
  const [customAmount, setCustomAmount] = useState("200");
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(
    video?.id ? video.id.toString() : null
  );
  const [showVideoSelector, setShowVideoSelector] = useState(false);

  const questions = [
    {
      id: 0,
      text: "Will this video reach 50,000 views within 7 days of going public?",
      basis: "Based on your channel's average performance",
      performance: "Based on your avg. 68K views/week",
    },
    {
      id: 1,
      text: "Will this video get more than 1,000 likes in the first 24 hours?",
      basis: "Based on your channel's engagement rate",
      performance: "Based on your avg. 4.2% engagement rate",
    },
    {
      id: 2,
      text: "Will this video reach 100,000 views within 14 days?",
      basis: "Based on your channel's performance",
      performance: "Based on your avg. 85K views/2 weeks",
    },
    {
      id: 3,
      text: "Will this video have more than 500 comments in 7 days?",
      basis: "Based on your channel's comment rate",
      performance: "Based on your avg. 320 comments/week",
    },
  ];

  const pledgeOptions = [
    {
      type: "none",
      title: "No Pledge",
      description: "Start with a basic pool (users only)",
      amount: "$0",
    },
    {
      type: "fixed",
      title: "Fixed Amount",
      description: "Add a one-time amount to the pool",
      amount: `$${customAmount}`,
    },
    {
      type: "percentage",
      title: "Revenue Percentage",
      description: "Pledge % of AdSense earnings from this video",
      amount: "15%",
    },
  ];

  if (!isOpen) return null;

  // Get unlisted videos for selection
  const unlistedVideos = RECENT_VIDEOS.filter((v) => v.status === "unlisted");

  // Determine if we need to show video selector (when no specific video is passed)
  const needsVideoSelection = !video && unlistedVideos.length > 0;

  // Get selected video data
  const selectedVideoData = selectedVideoId
    ? unlistedVideos.find((v) => v.id.toString() === selectedVideoId)
    : null;

  // Default video data when creating a new pool (no specific video selected)
  const displayVideo = video ||
    selectedVideoData || {
      id: "new",
      title: needsVideoSelection
        ? "Select a video to create pool"
        : "No unlisted videos available",
      thumbnail:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop",
      duration: "0:00",
      views: 0,
      status: "unlisted",
      uploadDate: "Not selected",
    };

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
    setShowVideoSelector(false);
  };

  const handleEnablePool = () => {
    if (!termsAccepted) return;

    // Don't allow creating pool without selecting a video when needed
    if (needsVideoSelection && !selectedVideoId) return;

    const poolData = {
      videoId: selectedVideoId ? parseInt(selectedVideoId) : displayVideo.id,
      question: questions[selectedQuestion],
      pledgeType,
      pledgeAmount: pledgeType === "fixed" ? parseFloat(customAmount) : 0,
      pledgePercentage: pledgeType === "percentage" ? 15 : 0,
    };

    onEnablePool?.(poolData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Enable Prediction Pool
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Set up a prediction pool for your video to boost engagement
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Video Preview */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Video Preview
              </h3>
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={displayVideo.thumbnail}
                    alt={displayVideo.title}
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="w-5 h-5 text-gray-800 ml-1"
                      />
                    </div>
                  </div>
                  {displayVideo.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {displayVideo.duration}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {displayVideo.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {(displayVideo.views || 0) > 0 && (
                      <div className="flex items-center space-x-1">
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                        <span>
                          {(displayVideo.views || 0).toLocaleString()} views
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                      <span>
                        {displayVideo.uploadDate} • {displayVideo.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Selector - Only show when creating a new pool */}
              {needsVideoSelection && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowVideoSelector(!showVideoSelector)}
                    className="w-full p-3 border border-gray-300 rounded-lg hover:border-purple-500 transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">
                      {selectedVideoData
                        ? "Change Video"
                        : "Select Unlisted Video"}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`w-4 h-4 text-gray-500 transition-transform ${showVideoSelector ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showVideoSelector && (
                    <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {unlistedVideos.map((unlistedVideo) => (
                        <button
                          key={unlistedVideo.id}
                          onClick={() =>
                            handleVideoSelect(unlistedVideo.id.toString())
                          }
                          className={`w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            selectedVideoId === unlistedVideo.id.toString()
                              ? "bg-purple-50 border-purple-200"
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={unlistedVideo.thumbnail}
                              alt={unlistedVideo.title}
                              className="w-12 h-8 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                {unlistedVideo.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {unlistedVideo.duration} •{" "}
                                {unlistedVideo.uploadDate}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pledge Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pledge Options
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Boost your pool size and attract more participants by pledging a
                portion of your AdSense revenue
              </p>

              <div className="space-y-3">
                {pledgeOptions.map((option) => (
                  <label
                    key={option.type}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      pledgeType === option.type
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pledgeType"
                      value={option.type}
                      checked={pledgeType === option.type}
                      onChange={(e) => setPledgeType(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                        pledgeType === option.type
                          ? "border-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {pledgeType === option.type && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {option.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {option.amount}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Custom Amount Input */}
              {pledgeType === "fixed" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Fixed Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Prediction Question */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Prediction Question
                </h3>
                <button className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 transition-colors">
                  <FontAwesomeIcon icon={faRefresh} className="w-4 h-4" />
                  <span>Regenerate</span>
                </button>
              </div>

              {/* Main Question */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-blue-600">AI Generated</span>
                </div>
                <p className="text-gray-900 font-medium mb-2">
                  {questions[selectedQuestion].text}
                </p>
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <FontAwesomeIcon icon={faLightbulb} className="w-4 h-4" />
                  <span>{questions[selectedQuestion].performance}</span>
                </div>
              </div>

              {/* Alternative Questions */}
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Or choose from these alternatives:
                </p>
                <div className="space-y-2">
                  {questions.slice(1).map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => setSelectedQuestion(question.id)}
                      className={`w-full p-3 text-left border rounded-lg transition-colors ${
                        selectedQuestion === question.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-sm text-gray-900">{question.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Estimated Pool Impact */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="w-5 h-5 text-gray-600"
                />
                <h3 className="text-lg font-medium text-gray-900">
                  Estimated Pool Impact
                </h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    $1,240
                  </div>
                  <p className="text-sm text-gray-600">Expected Pool Size</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Predicted Participants:
                    </span>
                    <span className="font-medium">~850</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Engagement Boost:</span>
                    <span className="font-medium">+25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Your pledge:</span>
                    </div>
                    <span className="font-medium">
                      ${pledgeType === "fixed" ? customAmount : "0"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">User predictions:</span>
                    </div>
                    <span className="font-medium">~$1,040</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Message */}
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4" />
              <span>Your pledge is held securely until pool settlement</span>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to Creator Pool's{" "}
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  Terms of Service
                </a>{" "}
                and understand that pools are subject to YouTube's performance
                metrics and API data.
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEnablePool}
              disabled={
                !termsAccepted || (needsVideoSelection && !selectedVideoId)
              }
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faRocket} className="w-4 h-4" />
              <span>Enable Pool</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
