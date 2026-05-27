import { createContext, useContext } from 'react';

export const StorageContext = createContext(null);

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage debe usarse dentro de StorageProvider');
  return ctx;
}
