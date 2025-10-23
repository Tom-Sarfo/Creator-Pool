import type { Route } from "./+types/creator-pools";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faPlus,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import Tabs from "../components/Tabs";
import EnablePoolModal from "../components/EnablePoolModal";
import VideoCard from "../components/VideoCard";
import StatsSection from "../components/StatsSection";
import EmptyState from "../components/EmptyState";
import { extractDurationAndTimeRemaining } from "../lib/utils";
import { EMPTY_STATE_MESSAGES } from "../lib/constants";
import { useAppContext } from "../contexts/AppContext";
import type { Pool } from "../contexts/AppContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pool Management - Creator Pool" },
    {
      name: "description",
      content: "Create and manage prediction pools for your YouTube videos.",
    },
  ];
}

export default function CreatorPools() {
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { pools, addPool, filteredPools, videos } = useAppContext();

  const currentPools = filteredPools(
    activeTab as "active" | "settled" | "expired" | "all"
  );

  const tabs = [
    {
      id: "active",
      name: "Active",
      count: filteredPools("active").length,
    },
    {
      id: "settled",
      name: "Settled",
      count: filteredPools("settled").length,
    },
    {
      id: "expired",
      name: "Expired",
      count: filteredPools("expired").length,
    },
  ];

  const handleCreatePoolClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePool = (poolData: any) => {
    const selectedVideo = videos.find((video) => video.id === poolData.videoId);
    const videoTitle =
      selectedVideo?.title || `Pool for Video ${poolData.videoId}`;
    const questionText =
      poolData.question?.text || "Will this video reach target views?";
    const targetMatch = questionText.match(/([\d,]+)\s*views?/i);
    const targetViews = targetMatch
      ? parseInt(targetMatch[1].replace(/,/g, ""))
      : 50000;
    const { duration, timeRemaining, totalDays } =
      extractDurationAndTimeRemaining(questionText);
    const isUnlistedVideo =
      selectedVideo && selectedVideo.status === "unlisted";
    const creatorPledgeAmount = poolData.pledgeAmount || 0;

    const newPool: Omit<Pool, "id"> = {
      title: videoTitle,
      videoTitle: videoTitle,
      videoId: poolData.videoId,
      question: questionText,
      participants: 0,
      totalStake: creatorPledgeAmount,
      creatorPledge: creatorPledgeAmount,
      predictorStakes: 0,
      timeRemaining: "10m",
      status: "open",
      createdAt: new Date().toISOString(),
      targetViews: targetViews,
      currentViews: 0,
      duration: totalDays,
      predictionWindow: 10,
      ...(selectedVideo && {
        thumbnail: selectedVideo.thumbnail,
      }),
    };

    addPool(newPool);
    handleCloseModal();
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Pool Management
            </h1>
            <p className="text-gray-600">
              Create and manage prediction pools for your YouTube videos.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleCreatePoolClick}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors inline-flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
              Create New Pool
            </button>
          </div>
        </div>
      </div>

      <StatsSection pools={pools} />

      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="space-y-4">
        {currentPools.map((pool) => (
          <div
            key={pool.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <VideoCard pool={pool} showPoolBadge={false} />
          </div>
        ))}
      </div>

      {currentPools.length === 0 && (
        <EmptyState
          icon={faBullseye}
          title="No pools found"
          message={
            EMPTY_STATE_MESSAGES[activeTab as keyof typeof EMPTY_STATE_MESSAGES]
          }
          actionText="Create New Pool"
          onAction={handleCreatePoolClick}
        />
      )}

      <div className="lg:hidden mt-8 p-4 bg-orange-50 rounded-lg">
        <p className="text-sm text-orange-700 text-center">
          <FontAwesomeIcon icon={faLightbulb} className="mr-1" />
          Tap on pool cards to view detailed information and manage settings
        </p>
      </div>

      <EnablePoolModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        video={null}
        onEnablePool={handleCreatePool}
      />
    </div>
  );
}
