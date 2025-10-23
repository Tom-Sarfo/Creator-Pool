import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatsCard from "./StatsCard";
import { CREATOR_POOLS_STATS } from "../lib/constants";
import {
  faUsersRectangle,
  faUsers,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

interface StatsSectionProps {
  pools: any[];
  className?: string;
}

const iconMap = {
  faUsersRectangle,
  faUsers,
  faDollarSign,
};

export default function StatsSection({
  pools,
  className = "",
}: StatsSectionProps) {
  const getStatsValue = (title: string) => {
    switch (title) {
      case "Active Pools":
        return pools.filter((p) => p.status === "open").length;
      case "Total Participants":
        return pools.reduce((sum, pool) => sum + pool.participants, 0);
      case "Total Staked":
        return `$${pools.reduce((sum, pool) => sum + pool.totalStake, 0).toLocaleString()}`;
      case "Total Earned":
        return `$${pools
          .filter((p) => p.creatorEarnings)
          .reduce((sum, pool) => sum + (pool.creatorEarnings || 0), 0)
          .toFixed(2)}`;
      default:
        return 0;
    }
  };

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ${className}`}>
      {CREATOR_POOLS_STATS.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={getStatsValue(stat.title)}
          icon={iconMap[stat.icon as keyof typeof iconMap]}
          iconColor={stat.iconColor}
          iconBgColor={stat.iconBgColor}
          size={stat.size}
        />
      ))}
    </div>
  );
}
