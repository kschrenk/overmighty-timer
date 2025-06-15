import { useState, useEffect } from "react";

function useSearchParams() {
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(window.location.search),
  );

  useEffect(() => {
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
