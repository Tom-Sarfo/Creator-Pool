import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

interface IconContainerProps {
  icon: IconProp;
  size?: "small" | "medium" | "large";
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
}

export default function IconContainer({
  icon,
  size = "medium",
  iconColor = "text-orange-600",
  iconBgColor = "bg-orange-100",
  className = "",
}: IconContainerProps) {
  // Container size based on size prop
  const containerSize =
    size === "small"
      ? "w-8 h-8"
      : size === "large"
        ? "w-12 h-12"
        : "w-10 h-10";

  // Icon size based on size prop
  const iconSize =
    size === "small"
      ? "w-4 h-4"
      : size === "large"
        ? "w-6 h-6"
        : "w-5 h-5";

  return (
    <div
      className={`${containerSize} ${iconBgColor} rounded-lg flex items-center justify-center ${className}`}
    >
      <FontAwesomeIcon icon={icon} className={`${iconSize} ${iconColor}`} />
    </div>
  );
}

