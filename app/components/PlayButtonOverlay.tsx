import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PlayButtonOverlayProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  iconSize?: "sm" | "md" | "lg";
}

export default function PlayButtonOverlay({
  className = "",
  size = "md",
  iconSize = "md",
}: PlayButtonOverlayProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${className}`}
    >
      <div
        className={`${sizeClasses[size]} bg-red-600 rounded-full flex items-center justify-center shadow-lg`}
      >
        <FontAwesomeIcon
          icon="play"
          className={`${iconSizeClasses[iconSize]} text-white ml-1`}
        />
      </div>
    </div>
  );
}
