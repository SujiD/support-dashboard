import React, { createContext, useState } from "react";

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState({ error: undefined });

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};
