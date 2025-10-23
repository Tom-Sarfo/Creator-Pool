import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserButton } from "@clerk/react-router";
import {
  faBars,
  faBell,
  faWallet,
  faSync,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

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
  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 lg:px-6 w-full">
      <div className="flex items-center min-w-0 flex-1">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="text-gray-500 hover:text-gray-600 lg:hidden flex-shrink-0"
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        )}
        <h2 className="ml-4 text-lg font-semibold text-gray-900 lg:ml-0 truncate">
          {title}
        </h2>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Wallet Balance */}
        <div className="flex items-center space-x-2 text-orange-600">
          <FontAwesomeIcon icon={faWallet} className="h-5 w-5" />
          <span className="font-semibold">
            ${walletBalance.toLocaleString()}
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600">
          <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
        </button>

        {/* User menu */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
