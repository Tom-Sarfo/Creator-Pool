import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface EmptyStateProps {
  icon: IconDefinition;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  message,
  actionText,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <FontAwesomeIcon
        icon={icon}
        className="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <button
            onClick={onAction}
            className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
}
