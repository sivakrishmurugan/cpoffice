"use client"
import { useState } from 'react';
import { Coverage } from '../types';

export interface CoverageResData {
  coverages: Coverage[],
  optionalCoverages: Coverage[]
}

const useSessionStorage = <T>(keyName: string, defaultValue: T): [T, (newValue: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = window.sessionStorage.getItem(keyName);

      if (value) {
        return JSON.parse(value);
      } else {
        window.sessionStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: T | ((val: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(storedValue) : newValue;
      window.sessionStorage.setItem(keyName, JSON.stringify(valueToStore));
      setStoredValue(valueToStore);
    } catch (err) {}
  };

  return [storedValue, setValue];
};

export default useSessionStorage;