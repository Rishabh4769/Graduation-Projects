import { useEffect, useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage failures and keep the UI functional.
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
