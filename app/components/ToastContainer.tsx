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
      className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onRemoveToast} />
      ))}
    </div>
  );
}
