import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../contexts/AuthContext";
import { CATEGORIES } from "../lib/constants";
import { useAppContext } from "../contexts/AppContext";
import type { Pool, PredictionChoice } from "../lib/types";
import { PredictionResult as PredictionResultEnum } from "../lib/types";
import PredictionModal from "../components/PredictionModal";
import PoolCard from "../components/PoolCard";
import Pagination from "../components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function PredictorPools() {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [preselectedChoice, setPreselectedChoice] = useState<
    PredictionChoice | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { pools, addPrediction, addToast } = useAppContext();
  const { user } = useAuth();
  const categories = CATEGORIES;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const allFilteredPools = pools.filter((pool) => {
    const matchesCategory = selectedCategory === "all";
    const matchesSearch =
      searchQuery === "" ||
      pool.video?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.question?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
console.log("allFilteredPools", allFilteredPools);
  const totalPages = Math.ceil(allFilteredPools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredPools = allFilteredPools.slice(startIndex, endIndex);

  const handlePredictClick = (pool: Pool, choice: PredictionChoice) => {
    setSelectedPool(pool);
    setPreselectedChoice(choice);
    setShowPredictionModal(true);
  };

  const handlePredictionSubmit = (prediction: {
    choice: PredictionChoice;
    stake: number;
  }) => {
    if (!selectedPool) return;

    addPrediction({
      poolId: selectedPool.id,
      predictorId: user?.id || "anonymous",
      choice: prediction.choice,
      stake: prediction.stake,
      result: PredictionResultEnum.PENDING,
    });

    addToast({
      type: "success",
      title: "Prediction Placed!",
      message: `You predicted ${prediction.choice.toUpperCase()} with $${prediction.stake}`,
      duration: 4000,
    });

    setShowPredictionModal(false);
    setSelectedPool(null);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Pools</h1>
        <p className="text-gray-600">
          Discover and participate in prediction pools from your favorite
          creators
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "active"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Active Pools
            </button>
            <button
              onClick={() => setActiveTab("ending")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "ending"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Ending Soon
            </button>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Pool"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-colors"
              />
              <FontAwesomeIcon
                icon="search"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPools.map((pool) => (
          <PoolCard
            key={pool.id}
            pool={pool}
            currentTime={currentTime}
            onPredictClick={handlePredictClick}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={allFilteredPools.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedPool && (
        <PredictionModal
          isOpen={showPredictionModal}
          onClose={() => {
            setShowPredictionModal(false);
            setSelectedPool(null);
            setPreselectedChoice(undefined);
          }}
          pool={selectedPool}
          preselectedChoice={preselectedChoice}
          onSubmit={handlePredictionSubmit}
        />
      )}
    </div>
  );
}
