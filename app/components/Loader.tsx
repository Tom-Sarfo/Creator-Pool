import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "default" | "white";
}

export default function Loader({
  size = "md",
  className = "",
  variant = "default",
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-12 h-12",
  };

  const iconSizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-6 h-6",
  };

  const containerSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-12 h-12",
  };

  const bgColor = variant === "white" ? "bg-white" : "bg-orange-600";
  const iconColor = variant === "white" ? "text-orange-600" : "text-white";

  return (
    <div
      className={`${containerSizeClasses[size]} ${bgColor} rounded flex items-center justify-center play-loader ${className}`}
    >
      <FontAwesomeIcon
        icon="play"
        className={`${iconSizeClasses[size]} ${iconColor} ml-0.5`}
      />
    </div>
  );
}

