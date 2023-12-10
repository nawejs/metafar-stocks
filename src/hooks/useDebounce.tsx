import { useState, useEffect } from "react";

const useDebounce = (
  value: string,
  delay: number,
  callback: (value: string) => void
) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback(value);
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, callback]);

  return debouncedValue;
};

export default useDebounce;
