"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      if (item) setStoredValue(JSON.parse(item) as T);
    } catch {}
  }, [key]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch {}
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
