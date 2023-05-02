import { toast } from "react-toastify";

export const clearWaititngQueue = () => {
  toast.clearWaitingQueue({
    containerId: "toast-id",
  });
};
