import { useState } from "react";

const useToggle = () => {
  const [show, setShow] = useState(false);
  const onToggle = () => {
    setShow(!show);
  };

  return {
    show,
    setShow,
    onToggle,
  };
};

export default useToggle;
