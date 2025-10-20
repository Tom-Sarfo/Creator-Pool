import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconProp;
  iconBgColor?: string;
  iconColor?: string;
  iconSize?: "small" | "medium" | "large";
  className?: string;
  roundedClass?: string;
  shadowClass?: string;
  containerPadding?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  iconSize = "medium",
  className = "",
  roundedClass = "rounded-lg",
  shadowClass = "shadow-sm",
  containerPadding,
}: StatsCardProps) {
  const iconSizes = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  const iconContainerSizes = {
    small: "w-8 h-8",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const valueTextSizes = {
    small: "text-xl font-semibold",
    medium: "text-xl font-semibold",
    large: "text-3xl font-bold",
  };

  const defaultContainerPadding = {
    small: "p-4",
    medium: "p-4",
    large: "p-4 sm:p-6",
  };

  const paddingClass = containerPadding || defaultContainerPadding[iconSize];

  return (
    <div
      className={`bg-white ${roundedClass} ${shadowClass} border border-gray-200 ${paddingClass} ${className}`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div
            className={`${iconContainerSizes[iconSize]} ${iconBgColor} rounded-lg flex items-center justify-center`}
          >
            <FontAwesomeIcon
              icon={icon}
              className={`${iconSizes[iconSize]} ${iconColor}`}
            />
          </div>
        </div>
        <div className="ml-3 sm:ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`${valueTextSizes[iconSize]} text-gray-900`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
