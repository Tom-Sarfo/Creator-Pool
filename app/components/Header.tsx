import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faWallet,
  faSync,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  walletBalance?: number;
  showSyncButton?: boolean;
  showSearchBar?: boolean;
}

export default function Header({
  title,
  onMenuClick,
  showMenuButton = false,
  walletBalance = 0,
  showSyncButton = false,
  showSearchBar = false,
}: HeaderProps) {
  const { user, logout } = useAuth();

  // Get user's full name
  const userName = user?.name || "User";

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 lg:px-6 w-full">
      {/* Left Section: Menu Button + Title */}
      <div className="flex items-center min-w-0 flex-1">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="text-gray-500 hover:text-gray-600 lg:hidden flex-shrink-0 mr-3"
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        )}
        <h2 className="text-lg font-semibold text-gray-900 truncate hidden md:block">
          {title}
        </h2>
      </div>

      {/* Right Section: Search, Wallet, Notifications, User Info */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        {/* Search Bar */}
        {showSearchBar && (
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faSearch}
                className="h-4 w-4 text-gray-400"
              />
            </div>
            <input
              type="text"
              placeholder="Search videos..."
              className="block w-48 lg:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Wallet Balance - Desktop Only */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg">
          <FontAwesomeIcon
            icon={faWallet}
            className="h-4 w-4 text-orange-600"
          />
          <span className="font-semibold text-orange-600 text-sm">
            ${walletBalance.toLocaleString()}
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User Info - Better Grouped */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
              <FontAwesomeIcon
                icon={faUser}
                className="h-4 w-4 text-gray-600"
              />
            </div>
            <span className="text-sm font-medium max-w-[120px] truncate">
              {userName}
            </span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium px-2 py-1 hover:bg-gray-100 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
