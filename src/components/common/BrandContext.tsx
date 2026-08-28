import React, { createContext, useContext, useState } from 'react';
import { ThemeMode } from '../../types';

interface BrandContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const BrandContext = createContext<BrandContextType>({
  theme: 'neon_noir',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('neon_noir');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'neon_noir' ? 'soft_pastel' : 'neon_noir'));
  };

  return (
    <BrandContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={theme === 'neon_noir' ? 'theme-neon-noir' : 'theme-soft-pastel'}>
        {children}
      </div>
    </BrandContext.Provider>
  );
};

export const useBrandTheme = () => useContext(BrandContext);
