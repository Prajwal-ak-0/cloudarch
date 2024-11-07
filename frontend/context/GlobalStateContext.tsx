// import React, { createContext, useState, ReactNode } from 'react';

// interface GlobalState {
//   cloudProvider: string;
//   setCloudProvider: (value: string) => void;
//   industry: string;
//   setIndustry: (value: string) => void;
// }

// export const GlobalStateContext = createContext<GlobalState>({
//   cloudProvider: 'aws',
//   setCloudProvider: () => {},
//   industry: 'all',
//   setIndustry: () => {},
// });

// interface GlobalStateProviderProps {
//   children: ReactNode;
// }

// export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
//   const [cloudProvider, setCloudProvider] = useState('aws');
//   const [industry, setIndustry] = useState('all');

//   return (
//     <GlobalStateContext.Provider
//       value={{
//         cloudProvider,
//         setCloudProvider,
//         industry,
//         setIndustry,
//       }}
//     >
//       {children}
//     </GlobalStateContext.Provider>
//   );
// };



// frontend/src/context/GlobalStateContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface GlobalState {
  cloudProvider: string;
  setCloudProvider: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
}

export const GlobalStateContext = createContext<GlobalState>({
  cloudProvider: 'aws',
  setCloudProvider: () => {},
  industry: 'all',
  setIndustry: () => {},
});

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cloudProvider, setCloudProviderState] = useState('aws');
  const [industry, setIndustryState] = useState('all');

  // Load from localStorage on mount
  useEffect(() => {
    const savedCloudProvider = localStorage.getItem('cloudProvider');
    const savedIndustry = localStorage.getItem('industry');

    if (savedCloudProvider) {
      setCloudProviderState(savedCloudProvider);
    }
    if (savedIndustry) {
      setIndustryState(savedIndustry);
    }
  }, []);

  // Save to localStorage when values change
  const setCloudProvider = (value: string) => {
    localStorage.setItem('cloudProvider', value);
    setCloudProviderState(value);
  };

  const setIndustry = (value: string) => {
    localStorage.setItem('industry', value);
    setIndustryState(value);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        cloudProvider,
        setCloudProvider,
        industry,
        setIndustry,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};