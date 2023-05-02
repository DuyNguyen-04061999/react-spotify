import { useEffect } from "react";

const useScrollTop = (dependencyList = [], top = 0) => {
  useEffect(() => {
    window.scroll({
      top: top,
      behavior: "smooth",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencyList]);
};

export default useScrollTop;
