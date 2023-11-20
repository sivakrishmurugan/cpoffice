"use client"
import { useState } from 'react';
import { Coverage, OptionalCoverage } from '../types';

export interface CoverageResData {
  coverages: Coverage[],
  optionalCoverages: OptionalCoverage[]
}

const useSessionStorage = (keyName: string, defaultValue: null | CoverageResData) => {
  const [storedValue, setStoredValue] = useState<null | CoverageResData>(() => {
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

  const setValue = (newValue: null | CoverageResData) => {
    try {
      window.sessionStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };

  return [storedValue, setValue] as [ CoverageResData | null,  (newValue: null | CoverageResData) => void];
};

export default useSessionStorage;