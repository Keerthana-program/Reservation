// src/context/AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [owner, setOwner] = useState({ ownerId: "OWNER-d3bd0fb1-2f0b-42c3-9863-ab78730c6afe" });

  
  return (
    <AuthContext.Provider value={{ owner, setOwner }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Updated useAuth() to prevent undefined errors
export const useAuth = () => {
  return useContext(AuthContext) || { owner: null }; 
};
