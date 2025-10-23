import { useEffect, useState } from "react";
import Toast, { type ToastData } from "./Toast";

interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  onRemoveToast,
}: ToastContainerProps) {
  return (
    <div
      id="toast-container"
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 w-full max-w-sm px-4 sm:px-0 sm:max-w-md"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onRemoveToast} />
      ))}
    </div>
  );
}
