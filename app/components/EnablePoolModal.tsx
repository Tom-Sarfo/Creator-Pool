import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPlay,
  faEye,
  faClock,
  faRefresh,
  faQuestionCircle,
  faRocket,
  faLightbulb,
  faShieldAlt,
  faChevronDown,
  faDollarSign,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { useAppContext } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { POOL_QUESTIONS, PLEDGE_OPTIONS } from "../lib/constants";
import Loader from "./Loader";
import { formatISODurationShort } from "../lib/utils";
import { poolService } from "../services/pool.service";
import type { Suggestion } from "../lib/types";
import { Label } from "@radix-ui/react-label";
import TextInputField from "./TextInputField";

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
  const { videos, walletBalance, refreshWallet, addToast } = useAppContext();
  const { user, isAuthenticated } = useAuth();
  const [pledgeType, setPledgeType] = useState("fixed");
  const [customAmount, setCustomAmount] = useState("200");
  const [walletError, setWalletError] = useState<string | null>(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(
    video?.id ? video.id.toString() : null
  );
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [analytics, setAnalytics] = useState<{
    avg24hViews: number | null;
    avg48hViews: number | null;
    avg7dViews: number | null;
    avg30dViews: number | null;
    sampleSize: number;
    hasEnoughData: boolean;
  } | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [suggestionsFetched, setSuggestionsFetched] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);

  const questions = suggestions.length > 0 ? suggestions : POOL_QUESTIONS;

  const pledgeOptions = PLEDGE_OPTIONS.map((option) => ({
    ...option,
    amount: option.type === "fixed" ? `$${customAmount}` : option.amount,
  }));

  useEffect(() => {
    if (isOpen && isAuthenticated && user && !suggestionsFetched) {
      fetchSuggestions();
    }

    if (!isOpen) {
      setSuggestionsFetched(false);
      setSuggestionsError(null);
      setSelectedSuggestionIndex(0);
      setCustomQuestion("");
      setAnalytics(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isAuthenticated, user]);

  const fetchSuggestions = async () => {
    if (!user || !isAuthenticated) return;

    setLoadingSuggestions(true);
    setSuggestionsError(null);

    try {
      const videoId = selectedVideoId || video?.id?.toString();
      const response = await poolService.getSuggestions(user.id, videoId);
      setSuggestions(response.suggestions);
      setAnalytics(response.analytics);
      setSuggestionsFetched(true);
      if (response.suggestions.length > 0) {
        setSelectedSuggestionIndex(0);
      }
    } catch (error: any) {
      console.error("Error fetching suggestions:", error);
      setSuggestionsError(
        error?.data?.message || error?.message || "Failed to load suggestions"
      );
      setSuggestions([]);
      setAnalytics(null);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleRegenerate = async () => {
    if (!user || !isAuthenticated) return;

    setSuggestionsFetched(false);
    setLoadingSuggestions(true);
    setSuggestionsError(null);

    try {
      const videoId = selectedVideoId || video?.id?.toString();
      const response = await poolService.getSuggestions(user.id, videoId);
      setSuggestions(response.suggestions);
      setAnalytics(response.analytics);
      setSuggestionsFetched(true);
      if (response.suggestions.length > 0) {
        setSelectedSuggestionIndex(0);
      }
    } catch (error: any) {
      console.error("Error fetching suggestions:", error);
      setSuggestionsError(
        error?.data?.message || error?.message || "Failed to load suggestions"
      );
      setSuggestions([]);
      setAnalytics(null);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  if (!isOpen) return null;

  const unlistedVideos = videos
    .filter((v) => v.status === "unlisted")
    .sort((a, b) => {
      if (a.isYouTubeVideo && !b.isYouTubeVideo) return -1;
      if (!a.isYouTubeVideo && b.isYouTubeVideo) return 1;
      return 0;
    });

  const needsVideoSelection = !video && unlistedVideos.length > 0;

  const selectedVideoData = selectedVideoId
    ? unlistedVideos.find((v) => v.id.toString() === selectedVideoId)
    : null;

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

  const handleVideoSelect = async (videoId: string) => {
    setSelectedVideoId(videoId);
    setShowVideoSelector(false);
    if (isAuthenticated && user) {
      setSuggestionsFetched(false);
      setLoadingSuggestions(true);
      setSuggestionsError(null);

      try {
        const response = await poolService.getSuggestions(user.id, videoId);
        setSuggestions(response.suggestions);
        setAnalytics(response.analytics);
        setSuggestionsFetched(true);
        if (response.suggestions.length > 0) {
          setSelectedSuggestionIndex(0);
        }
      } catch (error: any) {
        console.error("Error fetching suggestions:", error);
        setSuggestionsError(
          error?.data?.message || error?.message || "Failed to load suggestions"
        );
        setSuggestions([]);
        setAnalytics(null);
      } finally {
        setLoadingSuggestions(false);
      }
    }
  };

  // Helper function to format views
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  // Determine if creator has tracked metrics
  const hasTrackedMetrics =
    analytics &&
    (analytics.hasEnoughData || analytics.sampleSize > 0) &&
    (analytics.avg7dViews !== null || analytics.avg24hViews !== null);

  // Determine if creator is new (no tracked videos)
  const isNewCreator =
    suggestions.length === 0 && (!analytics || analytics.sampleSize === 0);

  // Sample suggestions for new creators
  const sampleSuggestions = [
    "Will this video reach 1,000 views within 24 hours?",
    "Will this video reach 10,000 views within 7 days?",
    "Will this video get more than 500 likes in the first 48 hours?",
    "Will this video reach 50,000 views within 30 days?",
  ];

  const handleEnablePool = async () => {
    if (!termsAccepted) return;
    if (needsVideoSelection && !selectedVideoId) return;
    if (isEnabling) return; // Prevent double submission

    // Use custom question if no suggestions available, otherwise use selected suggestion
    let questionText: string;
    let targetViews: number | undefined;
    let trackingDurationDays: number | undefined;

    if (suggestions.length === 0 && customQuestion.trim()) {
      questionText = customQuestion.trim();
      targetViews = undefined;
      trackingDurationDays = undefined;
    } else {
      const selectedQuestion = questions[selectedSuggestionIndex];
      const isSuggestion =
        suggestions.length > 0 && selectedSuggestionIndex < suggestions.length;

      questionText = isSuggestion
        ? (selectedQuestion as Suggestion).question
        : (selectedQuestion as (typeof POOL_QUESTIONS)[0]).text;
      targetViews = isSuggestion
        ? (selectedQuestion as Suggestion).targetViews
        : undefined;
      trackingDurationDays = isSuggestion
        ? (selectedQuestion as Suggestion).trackingDurationDays
        : undefined;
    }

    const pledgeAmount = pledgeType === "fixed" ? parseFloat(customAmount) : 0;

    // Validate wallet balance if pledge is set
    if (pledgeAmount > 0) {
      const balance = walletBalance?.balance || 0;
      if (pledgeAmount > balance) {
        setWalletError(
          `Insufficient wallet balance. You have $${balance.toFixed(2)} but need $${pledgeAmount.toFixed(2)}.`
        );
        addToast({
          type: "error",
          title: "Insufficient Balance",
          message: `You have $${balance.toFixed(2)} but need $${pledgeAmount.toFixed(2)} for the pledge.`,
          duration: 5000,
        });
        return;
      }
      setWalletError(null);
    }

    setIsEnabling(true);

    try {
      const poolData = {
        videoId: selectedVideoId ? parseInt(selectedVideoId) : displayVideo.id,
        question: questionText,
        targetViews,
        trackingDurationDays,
        pledgeType,
        pledgeAmount,
      };

      await onEnablePool?.(poolData);

      await refreshWallet();

      // Close modal on success
      onClose();
    } catch (error: any) {
      console.error("Error enabling pool:", error);

      // Extract error message from various possible error formats
      const backendMessage =
        error?.message ||
        error?.data?.message ||
        error?.response?.data?.message ||
        "";

      // Map backend error messages to user-friendly messages
      let errorMessage: string;
      let errorTitle: string;

      if (
        backendMessage.includes("Insufficient wallet balance") ||
        backendMessage.includes("insufficient wallet balance")
      ) {
        errorTitle = "Insufficient Balance";
        errorMessage =
          "You don't have enough funds. Please reduce your pledge or add funds to your wallet.";
      } else if (backendMessage.includes("Video already has an active pool")) {
        errorTitle = "Pool Already Exists";
        errorMessage = "This video already has an active pool.";
      } else if (backendMessage) {
        errorTitle = "Failed to Enable Pool";
        errorMessage = backendMessage;
      } else {
        errorTitle = "Failed to Enable Pool";
        errorMessage = "Failed to enable pool. Please try again.";
      }

      setWalletError(errorMessage);
      addToast({
        type: "error",
        title: errorTitle,
        message: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsEnabling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 transition-opacity"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onClick={onClose}
        />

        <div className="relative bg-white rounded-md shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col mx-2 sm:mx-0">
          <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Enable Prediction Pool
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
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

          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                Video Preview
              </h3>
              <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative w-full sm:w-48">
                  <img
                    src={displayVideo.thumbnail}
                    alt={displayVideo.title}
                    className="w-full h-32 sm:h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop";
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="w-5 h-5 text-gray-800 ml-1"
                      />
                    </div>
                  </div>

                  {displayVideo.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {formatISODurationShort(displayVideo.duration)}
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base break-words">
                    {displayVideo.title}
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
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

              {needsVideoSelection && (
                <div className="mt-3 sm:mt-4">
                  <button
                    onClick={() => setShowVideoSelector(!showVideoSelector)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg hover:border-orange-500 transition-colors flex items-center justify-between"
                  >
                    <span className="text-xs sm:text-sm text-gray-700">
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
                    <div className="mt-2 max-h-40 sm:max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {unlistedVideos.map((unlistedVideo) => (
                        <button
                          key={unlistedVideo.id}
                          onClick={() =>
                            handleVideoSelect(unlistedVideo.id.toString())
                          }
                          className={`w-full p-2 sm:p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            selectedVideoId === unlistedVideo.id.toString()
                              ? "bg-orange-50 border-orange-200"
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={unlistedVideo.thumbnail}
                                alt={unlistedVideo.title}
                                className="w-12 h-8 object-cover rounded"
                              />
                              {unlistedVideo.isYouTubeVideo && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded flex items-center">
                                  <FontAwesomeIcon
                                    icon={faYoutube}
                                    className="w-2 h-2"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                                  {unlistedVideo.title}
                                </p>
                                {unlistedVideo.isYouTubeVideo && (
                                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                    YouTube
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 break-words">
                                {formatISODurationShort(unlistedVideo.duration)}{" "}
                                • {unlistedVideo.uploadDate}
                                {unlistedVideo.isYouTubeVideo && (
                                  <span className="ml-2 text-red-500">
                                    • Real Video
                                  </span>
                                )}
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

            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                Pledge Options
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Boost your pool size and attract buzz around your content by
                pledging a fixed amount to the pool. More engagement, more
                participants, bigger rewards.
              </p>

              <div className="space-y-2 sm:space-y-3">
                {pledgeOptions.map((option) => (
                  <label
                    key={option.type}
                    className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                      pledgeType === option.type
                        ? "border-orange-500 bg-orange-50"
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
                          ? "border-orange-500"
                          : "border-gray-300"
                      }`}
                    >
                      {pledgeType === option.type && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {option.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm sm:text-base mt-1 sm:mt-0">
                          {option.amount}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {pledgeType === "fixed" && (
                <div className="mt-3 sm:mt-4 space-y-2">
                  <TextInputField
                    value={customAmount}
                    onChange={(value) => {
                      setCustomAmount(value);
                      setWalletError(null);
                    }}
                    type="number"
                    label="Enter Fixed Amount"
                    placeholder="200"
                    leftIcon={faDollarSign}
                    size="medium"
                    fullWidth={true}
                    min={0}
                    step={0.01}
                    onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                      (e.target as HTMLInputElement).blur()
                    }
                    className="text-sm sm:text-base"
                    iconColor="text-gray-600"
                    borderColor="border-gray-300"
                    focusBorderColor="focus:border-orange-500"
                    backgroundColor="bg-white"
                    textColor="text-gray-900"
                    placeholderColor="placeholder-gray-500"
                  />
                  {walletBalance && (
                    <div className="text-xs text-gray-600">
                      Your wallet balance: ${walletBalance.balance.toFixed(2)}
                    </div>
                  )}
                  {walletError && (
                    <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                      {walletError}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  Prediction Question
                </h3>
                {isAuthenticated && !isNewCreator && (
                  <button
                    onClick={handleRegenerate}
                    disabled={loadingSuggestions}
                    className="flex items-center space-x-2 text-sm text-orange-600 hover:text-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingSuggestions ? (
                      <Loader size="sm" />
                    ) : (
                      <FontAwesomeIcon icon={faRefresh} className="w-4 h-4" />
                    )}
                    <span>Regenerate</span>
                  </button>
                )}
              </div>

              {loadingSuggestions && suggestions.length === 0 && !analytics ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader size="sm" />
                    <span className="text-xs sm:text-sm text-gray-500">
                      Loading suggestions...
                    </span>
                  </div>
                </div>
              ) : suggestionsError && suggestions.length === 0 && !analytics ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-xs sm:text-sm text-red-600">
                        {suggestionsError}
                      </span>
                    </div>
                    <button
                      onClick={fetchSuggestions}
                      className="text-xs text-red-600 hover:text-red-700 underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : suggestions.length === 0 ? (
                <>
                  <div className="mb-3 sm:mb-4">
                    <label
                      htmlFor="custom-question"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                    >
                      Enter your prediction question
                    </label>
                    <input
                      id="custom-question"
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="e.g., Will this video reach 10,000 views within 7 days?"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-500"
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 sm:mb-3">
                      Sample Questions (for guidance):
                    </p>
                    <ul className="space-y-1 sm:space-y-2">
                      {sampleSuggestions.map((sample, index) => (
                        <li
                          key={index}
                          onClick={() => setCustomQuestion(sample)}
                          className="p-2 sm:p-3 bg-white border border-gray-200 rounded-lg cursor-pointer transition-all hover:border-orange-500 hover:bg-orange-50 text-xs sm:text-sm text-gray-700 break-words"
                        >
                          {sample}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : suggestions.length > 0 ? (
                <>
                  <button
                    onClick={() => setSelectedSuggestionIndex(0)}
                    className={`w-full bg-cyan-50 border-2 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 text-left transition-colors ${
                      selectedSuggestionIndex === 0
                        ? "border-cyan-500 bg-cyan-100"
                        : "border-cyan-200 hover:border-cyan-300"
                    }`}
                  >
                    <p className="text-gray-900 font-medium mb-2 text-sm sm:text-base break-words">
                      {suggestions[0]?.question}
                    </p>
                    {hasTrackedMetrics && analytics && (
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-cyan-600 mt-2">
                        <FontAwesomeIcon
                          icon={faLightbulb}
                          className="w-4 h-4"
                        />
                        <span>
                          Based on your avg.{" "}
                          {formatViews(
                            analytics.avg7dViews || analytics.avg24hViews || 0
                          )}{" "}
                          views/week
                        </span>
                      </div>
                    )}
                  </button>

                  {suggestions.length > 1 && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                        Or choose from these alternatives:
                      </p>
                      <div className="space-y-1 sm:space-y-2">
                        {suggestions.slice(1).map((suggestion, index) => {
                          const actualIndex = index + 1;
                          return (
                            <button
                              key={actualIndex}
                              onClick={() =>
                                setSelectedSuggestionIndex(actualIndex)
                              }
                              className={`w-full p-2 sm:p-3 text-left border rounded-lg transition-colors ${
                                selectedSuggestionIndex === actualIndex
                                  ? "border-orange-500 bg-orange-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <p className="text-xs sm:text-sm text-gray-900 break-words">
                                {suggestion.question}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {pledgeType === "fixed" && parseFloat(customAmount) > 0 && (
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-green-600 bg-green-50 p-2 sm:p-3 rounded-lg">
                <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4" />
                <span>
                  Your pledge will be automatically deducted from your wallet
                  immediately when you enable the pool
                </span>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 bg-white border-2 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 focus:border-orange-500 focus:outline-none checked:bg-orange-500 checked:border-orange-500 text-white transition-colors duration-200"
                style={{
                  accentColor: "#f94600",
                }}
              />
              <Label
                htmlFor="terms"
                className="text-xs sm:text-sm text-gray-600"
              >
                I agree to Creator Pool's{" "}
                <a
                  href="#"
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  Terms of Service
                </a>{" "}
                and understand that pools are subject to YouTube's performance
                metrics and API data.
              </Label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-3 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEnablePool}
              disabled={
                !termsAccepted ||
                (needsVideoSelection && !selectedVideoId) ||
                (suggestions.length === 0 && !customQuestion.trim()) ||
                !!walletError ||
                isEnabling
              }
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {isEnabling ? (
                <Loader size="sm" variant="white" />
              ) : (
                <FontAwesomeIcon icon={faRocket} className="w-4 h-4" />
              )}
              <span>{isEnabling ? "Enabling..." : "Enable Pool"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
