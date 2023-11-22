"use client"
import { ClinicData } from '../types';
import { useState } from 'react';

const useLocalStorage = (keyName: string, defaultValue: null | ClinicData) => {
  const [storedValue, setStoredValue] = useState<null | ClinicData>(() => {
    try {
      const value = window.localStorage.getItem(keyName);

      if (value) {
        return JSON.parse(value) as ClinicData;
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: null | ClinicData) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };

  return [storedValue, setValue] as [ ClinicData | null,  (newValue: null | ClinicData) => void];
};

export default useLocalStorage;