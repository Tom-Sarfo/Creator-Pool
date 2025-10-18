import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserButton } from "@clerk/react-router";
import { faBars, faBell, faWallet } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  walletBalance?: number;
}

export default function Header({
  title,
  onMenuClick,
  showMenuButton = false,
  walletBalance = 0,
}: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 lg:px-6">
      <div className="flex items-center">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="text-gray-500 hover:text-gray-600 lg:hidden"
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        )}
        <h2 className="ml-4 text-lg font-semibold text-gray-900 lg:ml-0">
          {title}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {/* Wallet Balance */}
        <div className="flex items-center space-x-2 text-purple-600">
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
