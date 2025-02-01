/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

// Create the context
const MyContext = createContext();

// Create the provider component
export const MyProvider = ({ children }) => {
  const [createMatchModal, setcreateMatchModal] = useState(false);

  return (
    <MyContext.Provider value={{ createMatchModal, setcreateMatchModal }}>
      {children}
    </MyContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useMyContext = () => {
  return useContext(MyContext);
};
