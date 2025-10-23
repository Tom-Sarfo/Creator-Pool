import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconProp;
  iconColor: string;
  iconBgColor: string;
  size?: "small" | "large" | "medium";
  variant?: "default" | "rounded-xl";
  square?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
  size = "large",
  variant = "default",
  square = false,
}: StatsCardProps) {
  // Container classes based on size and square format
  const containerClasses = square
    ? "p-3 sm:p-4"
    : size === "large"
      ? "p-4 sm:p-6"
      : size === "medium"
        ? "p-6"
        : "p-4";

  // Icon container size
  const iconSize = square
    ? "w-8 h-8"
    : size === "large"
      ? "w-12 h-12"
      : size === "medium"
        ? "p-3" // Special handling for medium
        : "w-8 h-8";

  // Icon size
  const iconInnerSize = square
    ? "w-4 h-4"
    : size === "large"
      ? "w-6 h-6"
      : size === "medium"
        ? "w-6 h-6"
        : "w-5 h-5";

  // Text margin
  const textMargin = square
    ? "ml-3"
    : size === "large"
      ? "ml-4"
      : size === "medium"
        ? "ml-4"
        : "ml-3";

  // Value text size
  const valueSize = square
    ? "text-xl font-bold"
    : size === "large"
      ? "text-3xl font-bold"
      : size === "medium"
        ? "text-2xl font-bold"
        : "text-xl font-semibold";

  // Card variant styles
  const cardClasses =
    variant === "rounded-xl"
      ? "bg-white rounded-xl shadow-sm border border-gray-200"
      : "bg-white rounded-lg shadow-sm border border-gray-200";

  // Icon container classes
  const iconContainerClasses =
    size === "medium"
      ? `${iconSize} ${iconBgColor} rounded-lg flex items-center justify-center`
      : `${iconSize} ${iconBgColor} rounded-lg flex items-center justify-center`;

  // Title text color for different variants
  const titleColor = square
    ? "text-xs font-medium text-gray-500"
    : variant === "rounded-xl"
      ? "text-sm font-medium text-gray-600"
      : "text-sm font-medium text-gray-500";

  return (
    <div className={cardClasses}>
      <div className={containerClasses}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={iconContainerClasses}>
              <FontAwesomeIcon
                icon={icon}
                className={`${iconInnerSize} ${iconColor}`}
              />
            </div>
          </div>
          <div className={`${textMargin} flex-1`}>
            <p className={titleColor}>{title}</p>
            <p className={`${valueSize} text-gray-900`}>
              {typeof value === "number" &&
              title.toLowerCase().includes("amount")
                ? `$${value.toLocaleString()}`
                : value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
