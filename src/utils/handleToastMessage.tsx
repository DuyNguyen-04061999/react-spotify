import { toast } from "react-toastify";
import { clearWaititngQueue } from "./clearWaitingQueue";
import { ReactNode } from "react";

interface PropsType {
  promise: Promise<unknown>;
  pending: string | ReactNode;
  success: string | ReactNode;
  error: string;
}
interface MyError {
  data?: {
    response: {
      data: {
        message: string;
      };
    };
  };
}
export const handleToastMessage = ({
  promise,
  pending,
  success,
  error,
}: PropsType) => {
  toast.dismiss();
  clearWaititngQueue();
  return toast.promise(promise, {
    pending: {
      ...(pending && {
        render() {
          return pending;
        },
      }),
    },
    success: {
      ...(success && {
        render() {
          return success;
        },
      }),
    },

    error: {
      render({ data }: MyError) {
        // When the promise reject, data will contains the error
        return error || data?.response?.data?.message;
      },
    },
  });
};
