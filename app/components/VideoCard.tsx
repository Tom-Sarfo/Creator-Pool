import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faCalendar,
  faPlus,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";

interface VideoCardProps {
  video: any;
  onEnablePoolClick: (video: any) => void;
  getPoolStatusColor: (status: string) => string;
  getPoolStatusLabel: (status: string) => string;
  formatNumber: (num: number) => string;
}

export default function VideoCard({
  video,
  onEnablePoolClick,
  getPoolStatusColor,
  getPoolStatusLabel,
  formatNumber,
}: VideoCardProps) {
  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-12 sm:w-20 sm:h-14 bg-gray-200 rounded-md overflow-hidden relative">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 rounded-tl">
              {video.duration}
            </div>
            {video.status === "unlisted" && (
              <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-1 rounded-br">
                Unlisted
              </div>
            )}
            {video.isYouTubeVideo && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl flex items-center space-x-1">
                <FontAwesomeIcon icon={faYoutube} className="w-2 h-2" />
                <span>YouTube</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
            {video.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <FontAwesomeIcon icon={faEye} className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {formatNumber(video.views)} views
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <FontAwesomeIcon
                icon={faCalendar}
                className="w-3 h-3 flex-shrink-0"
              />
              <span className="truncate">{video.uploadDate}</span>
            </div>
            {video.hasPool && video.poolData && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPoolStatusColor(video.poolData.status)}`}
              >
                {getPoolStatusLabel(video.poolData.status)}
              </span>
            )}
            {!video.hasPool && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPoolStatusColor("available")}`}
              >
                Available for Pool
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {video.hasPool && video.poolData && (
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
              {!video.hasPool && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">
                    Perfect for predictions
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              {video.hasPool && video.poolData && (
                <Link
                  to={`/creator/pool/${video.poolData.id}?status=${video.poolData.status}`}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
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
              {!video.hasPool && (
                <button
                  onClick={() => onEnablePoolClick(video)}
                  className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                  <span>Enable Prediction Pool</span>
                </button>
              )}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {video.hasPool &&
            video.poolData &&
            ["open", "awaiting_release", "live_tracking", "closed"].includes(
              video.poolData.status
            ) && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>
                    Progress to{" "}
                    {video.poolData.targetViews?.toLocaleString() || "target"}{" "}
                    views
                  </span>
                  <span>
                    {Math.round(
                      ((video.poolData.currentViews || 0) /
                        (video.poolData.targetViews || 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(((video.poolData.currentViews || 0) / (video.poolData.targetViews || 1)) * 100, 100)}%`,
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
