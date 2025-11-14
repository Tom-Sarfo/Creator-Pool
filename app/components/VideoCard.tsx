import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faCalendar,
  faPlus,
  faEllipsisV,
  faUsers,
  faDollarSign,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { useAppContext } from "../contexts/AppContext";
import { getThumbnail, formatISODurationShort } from "../lib/utils";
import { useLivePoolMetrics } from "../hooks/useLivePoolMetrics";

interface VideoCardProps {
  video?: any;
  pool?: any;
  onEnablePoolClick?: (video: any) => void;
  getPoolStatusColor?: (status: string) => string;
  getPoolStatusLabel?: (status: string) => string;
  formatNumber?: (num: number) => string;
  showPoolBadge?: boolean;
  enableLiveMetrics?: boolean; // Disable live metrics in list views to prevent too many requests
}

export default function VideoCard({
  video,
  pool,
  onEnablePoolClick,
  getPoolStatusColor,
  getPoolStatusLabel,
  formatNumber,
  showPoolBadge = true,
  enableLiveMetrics = false, // Default to false - only enable on detail pages
}: VideoCardProps) {
  const { getVideoById } = useAppContext();

  // Determine if this is a pool card or video card
  const isPoolCard = !!pool;
  const data = isPoolCard ? pool : video;

  // Only use live metrics if explicitly enabled AND pool is in active status
  // This prevents too many API calls in list views
  const shouldUseLiveMetrics =
    enableLiveMetrics &&
    isPoolCard &&
    data?.id &&
    data?.status &&
    ["open", "awaiting_release", "live_tracking"].includes(data.status);

  const poolId = shouldUseLiveMetrics ? String(data.id) : "";
  const { metrics: liveMetrics } = useLivePoolMetrics(poolId);

  // Use live metrics for currentViews if available (for pool cards)
  const currentViews =
    shouldUseLiveMetrics && liveMetrics
      ? liveMetrics.viewCount
      : data?.currentViews !== undefined && data?.currentViews !== null
        ? data.currentViews
        : (data as any)?.viewCount || (data as any)?.views || 0;

  // Calculate progress similar to pool-detail.tsx
  const targetViews = data?.targetViews || 0;
  const progress =
    targetViews > 0 ? Math.min((currentViews / targetViews) * 100, 100) : 0;

  // Get thumbnail with fallback for pools
  const thumbnail = getThumbnail(data, getVideoById, isPoolCard);

  // Default utility functions if not provided
  const defaultFormatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const defaultGetPoolStatusColor = (status: string) => {
    const statusConfig = {
      open: "bg-green-100 text-green-800",
      awaiting_release: "bg-yellow-100 text-yellow-800",
      live_tracking: "bg-cyan-100 text-cyan-800",
      closed: "bg-orange-100 text-orange-800",
      settled: "bg-orange-100 text-orange-800",
      available: "bg-gray-100 text-gray-800",
    };
    return (
      statusConfig[status as keyof typeof statusConfig] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const defaultGetPoolStatusLabel = (status: string) => {
    const statusConfig = {
      open: "Open",
      awaiting_release: "Awaiting Release",
      live_tracking: "Live Tracking",
      closed: "Closed",
      settled: "Settled",
      available: "Available for Pool",
    };
    return statusConfig[status as keyof typeof statusConfig] || status;
  };

  const formatNum = formatNumber || defaultFormatNumber;
  const getStatusColor = getPoolStatusColor || defaultGetPoolStatusColor;
  const getStatusLabel = getPoolStatusLabel || defaultGetPoolStatusLabel;

  return (
    <div className="p-3 sm:p-4 lg:p-5">
      <div className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4">
        <div className="flex-shrink-0 relative">
          <div className="w-14 h-10 sm:w-16 sm:h-12 lg:w-20 lg:h-14 bg-gray-200 rounded-md overflow-hidden relative">
            <img
              src={thumbnail}
              alt={data.title || "Pool thumbnail"}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src =
                  "https://via.placeholder.com/300x200?text=No+Thumbnail";
              }}
            />
            {!isPoolCard && (
              <>
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 rounded-tl">
                  {formatISODurationShort(data.duration)}
                </div>
                {data.isYouTubeVideo && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl flex items-center space-x-1">
                    <FontAwesomeIcon icon={faYoutube} className="w-2 h-2" />
                    <span>YouTube</span>
                  </div>
                )}
              </>
            )}
            {isPoolCard && showPoolBadge && (
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-1 rounded-bl flex items-center space-x-1">
                <FontAwesomeIcon icon={faBullseye} className="w-2 h-2" />
                <span>Pool</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2 line-clamp-2">
            {data.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs text-gray-500 mb-2 sm:mb-3">
            {!isPoolCard && (
              <>
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon
                    icon={faEye}
                    className="w-3 h-3 flex-shrink-0"
                  />
                  <span className="truncate">
                    {formatNum(data.views)} views
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="w-3 h-3 flex-shrink-0"
                  />
                  <span className="truncate">{data.uploadDate}</span>
                </div>
              </>
            )}
            {isPoolCard && (
              <>
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="w-3 h-3 flex-shrink-0"
                  />
                  <span className="truncate">
                    {data.participants} participants
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="w-3 h-3 flex-shrink-0"
                  />
                  <span className="truncate">
                    ${formatNum(data.totalStake)} staked
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon
                    icon={faBullseye}
                    className="w-3 h-3 flex-shrink-0"
                  />
                  <span className="truncate">
                    {formatNum(data.targetViews)} target
                  </span>
                </div>
              </>
            )}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}
            >
              {getStatusLabel(data.status)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex-1 min-w-0">
              {!isPoolCard && video?.hasPool && video?.poolData && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">
                    {video.poolData.status === "settled" ? (
                      <>
                        Target reached • +${video.poolData.creatorEarnings || 0}{" "}
                        earned
                      </>
                    ) : (
                      <>
                        ${video.poolData.totalStake.toLocaleString()} pool •{" "}
                        {video.poolData.participants} predictions
                        {video.poolData.timeRemaining && (
                          <> • {video.poolData.timeRemaining} remaining</>
                        )}
                      </>
                    )}
                  </span>
                </div>
              )}
              {!isPoolCard && !video?.hasPool && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">
                    Perfect for predictions
                  </span>
                </div>
              )}
              {isPoolCard && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">
                    {data.status === "settled" ? (
                      <>Target reached • +${data.creatorEarnings || 0} earned</>
                    ) : (
                      <>
                        ${formatNum(data.totalStake)} pool • {data.participants}{" "}
                        predictions
                        {data.timeRemaining && (
                          <> • {data.timeRemaining} remaining</>
                        )}
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              {!isPoolCard && video?.hasPool && video?.poolData && (
                <Link
                  to={`/creator/pool/${video.poolData.id}?status=${video.poolData.status}`}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                    video.poolData.status === "settled"
                      ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}
                >
                  {video.poolData.status === "settled"
                    ? "View Results"
                    : "View Pool"}
                </Link>
              )}
              {!isPoolCard && !video?.hasPool && onEnablePoolClick && (
                <button
                  onClick={() => onEnablePoolClick(video)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-1 sm:space-x-2"
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="hidden sm:inline">
                    Enable Prediction Pool
                  </span>
                  <span className="sm:hidden">Enable Pool</span>
                </button>
              )}
              {isPoolCard && (
                <Link
                  to={`/creator/pool/${data.id}?status=${data.status}`}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                    data.status === "settled"
                      ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}
                >
                  {data.status === "settled" ? "View Results" : "View Pool"}
                </Link>
              )}
              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  className="w-3 h-3 sm:w-4 sm:h-4"
                />
              </button>
            </div>
          </div>

          {((!isPoolCard &&
            video?.hasPool &&
            video?.poolData &&
            ["open", "awaiting_release", "live_tracking", "closed"].includes(
              video.poolData.status
            )) ||
            (isPoolCard &&
              ["open", "awaiting_release", "live_tracking", "closed"].includes(
                data.status
              ))) && (
            <div className="mt-2 sm:mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="truncate">{formatNum(targetViews)} views</span>
                <span className="flex-shrink-0 ml-2">
                  {progress.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div
                  className={`h-1.5 sm:h-2 rounded-full ${
                    progress > 100 ? "bg-green-500" : "bg-orange-600"
                  }`}
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
