import { useState, useEffect } from "react";

function useSearchParams() {
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(window.location.search),
  );

  useEffect(() => {
    // @TODO: fix this
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const getParam = (key: string) => {
    return searchParams.get(key);
  };

  return {
    getParam,
  };
}

export default useSearchParams;
