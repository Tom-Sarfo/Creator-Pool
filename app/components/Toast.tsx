import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimes,
  faInfoCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

export interface ToastData {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return faCheckCircle;
      case "error":
        return faExclamationTriangle;
      case "warning":
        return faExclamationTriangle;
      case "info":
      default:
        return faInfoCircle;
    }
  };

  const getIconColor = () => {
    switch (toast.type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "info":
      default:
        return "text-cyan-600";
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
      default:
        return "bg-cyan-50 border-cyan-200";
    }
  };

  return (
    <div
      className={`w-full ${getBgColor()} border rounded-lg shadow-lg p-3 sm:p-4 transition-all duration-300 ease-in-out transform translate-x-0 opacity-100`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FontAwesomeIcon
            icon={getIcon()}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${getIconColor()}`}
          />
        </div>
        <div className="ml-2 sm:ml-3 flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
              {toast.message}
            </p>
          )}
        </div>
        <div className="ml-2 sm:ml-4 flex-shrink-0">
          <button
            onClick={() => onClose(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <FontAwesomeIcon icon={faTimes} className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
