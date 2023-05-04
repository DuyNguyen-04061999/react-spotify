import { useEffect, useRef } from "react";

type Fn = () => void;
//thực thi từ lần 2
const useEffectDidMount = (defaultFn: Fn, dependencyList = []) => {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      return defaultFn();
    }

    didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);
};

export default useEffectDidMount;
