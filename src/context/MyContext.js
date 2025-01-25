/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

// Create the context
const MyContext = createContext();

// Create the provider component
export const MyProvider = ({ children }) => {
  const [message, setMessage] = useState("Hello from Context!");

  // Add any other state or logic here
  const updateMessage = (newMessage) => setMessage(newMessage);

  return (
    <MyContext.Provider value={{ message, updateMessage }}>
      {children}
    </MyContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useMyContext = () => {
  return useContext(MyContext);
};
