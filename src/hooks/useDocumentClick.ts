import { useEffect } from "react";

type DocumentClickType = () => void;

const useDocumentClick = (onDocumentClick: DocumentClickType) => {
  useEffect(() => {
    const onClick = onDocumentClick;
    document.addEventListener("click", onClick);

    // ==
    return () => document.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useDocumentClick;
