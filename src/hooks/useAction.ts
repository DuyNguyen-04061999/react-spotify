import { handleToastMessage } from "@/utils";
import handleError from "@/utils/handleError";
import { message } from "antd";
import { useId, useRef } from "react";
import { IError } from "@/utils";

interface PropsTypes<Data> {
  promise: (...args: any[]) => Promise<Data>;
  pendingMessage: string | React.ReactNode;
  successMessage: string | React.ReactNode;
  errorMessage: string | React.ReactNode;
  onSuccess: (res: Data) => Promise<void>;
  recall: boolean;
  antd: boolean;
}

const useAction = <Data>({
  promise,
  pendingMessage,
  successMessage,
  errorMessage,
  onSuccess,
  recall = true,
  antd = false,
}: PropsTypes<Data>) => {
  const flagRef = useRef(false);
  const key = useId();

  const onAction = async (...params: any[]) => {
    if (flagRef.current) return;
    flagRef.current = true;
    let res: Data;
    try {
      if (antd) {
        message.open({
          type: "loading",
          key,
          content: pendingMessage,
        });
        res = await promise(...params);
        if (successMessage) {
          message.open({
            key,
            type: "success",
            content: successMessage,
          });
        } else {
          message?.destroy(key);
        }
      } else {
        res = await handleToastMessage({
          promise: promise(...params),
          pending: pendingMessage,
          success: successMessage,
          error: errorMessage,
        });
      }
      await onSuccess?.(res);
    } catch (error) {
      if (antd) {
        handleError(error as IError, antd, key);
      }
      console.log(
        "%cerror index.jsx line:40 ",
        "color: red; display: block; width: 100%;",
        error
      );
    }

    if (recall) {
      flagRef.current = false;
    }
  };

  return onAction;
};

export default useAction;
