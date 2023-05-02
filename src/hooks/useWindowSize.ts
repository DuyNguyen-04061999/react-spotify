import { useLayoutEffect, useState } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState<number[]>([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();

    //cleanup Fn
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export default useWindowSize;
