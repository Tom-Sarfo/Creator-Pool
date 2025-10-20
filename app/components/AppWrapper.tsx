import { Outlet } from "react-router";
import { useAppContext } from "../contexts/AppContext";
import ToastContainer from "./ToastContainer";

export default function AppWrapper() {
  const { toasts, removeToast } = useAppContext();

  return (
    <>
      <Outlet />
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}
