import { Link, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

interface SidebarProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: IconProp;
  }>;
  showSettings?: boolean;
}

export default function Sidebar({
  navigation,
  showSettings = true,
}: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 bg-transparent border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <Link
          to="/"
          className="flex items-center space-x-2 mb-8 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
            <FontAwesomeIcon icon="chart-line" className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">Creator Pool</span>
        </Link>

        <nav className="space-y-2">
          {navigation.map((item) => {
            // Special cases: highlight appropriate navigation items for pool detail pages
            const isActive =
              location.pathname === item.href ||
              (item.name === "Active Pools" &&
                location.pathname.startsWith("/predictor/pool/")) ||
              (item.name === "Pools" &&
                location.pathname.startsWith("/creator/pool/"));

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3 text-lg" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {showSettings && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/settings"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname === "/settings"
                  ? "bg-orange-100 text-orange-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <FontAwesomeIcon icon="cog" className="mr-3 text-lg" />
              Settings
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
